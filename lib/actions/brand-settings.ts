"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBrandSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brand_settings")
    .select("*")
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching brand settings:", error);
    return { error: error.message };
  }

  return { settings: data };
}

export async function updateBrandSettings(formData: {
  brand_voice: string;
  ai_model_preference: string;
}) {
  const supabase = await createClient();

  // Try to get existing settings first
  const { data: existing } = await supabase
    .from("brand_settings")
    .select("id")
    .single();

  let error;
  if (existing) {
    const { error: updateError } = await supabase
      .from("brand_settings")
      .update(formData)
      .eq("id", existing.id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("brand_settings")
      .insert(formData);
    error = insertError;
  }

  if (error) {
    console.error("Error updating brand settings:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}
