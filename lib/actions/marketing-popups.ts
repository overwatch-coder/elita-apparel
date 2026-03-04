"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPopups() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("marketing_popups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching popups:", error);
    return { error: error.message };
  }

  return { popups: data };
}

export async function getActivePopups() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("marketing_popups")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching active popups:", error);
    return { error: error.message };
  }

  return { popups: data };
}

export async function createPopup(formData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("marketing_popups")
    .insert(formData)
    .select()
    .single();

  if (error) {
    console.error("Error creating popup:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/marketing/popups");
  return { data };
}

export async function updatePopup(id: string, updates: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("marketing_popups")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating popup:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/marketing/popups");
  return { success: true };
}

export async function deletePopup(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("marketing_popups")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting popup:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/marketing/popups");
  return { success: true };
}

export async function togglePopupActive(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("marketing_popups")
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error toggling popup:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/marketing/popups");
  return { success: true };
}
