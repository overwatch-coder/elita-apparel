"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSizeGuides() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("size_guides")
    .select("*")
    .order("title");

  if (error) return { guides: [] };
  return { guides: data };
}

export async function getSizeGuide(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("size_guides")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createSizeGuide(data: {
  title: string;
  content_html: string;
  category?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("size_guides").insert({
    title: data.title,
    content_html: data.content_html,
    category: data.category || null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/size-guides");
  return { success: true };
}

export async function updateSizeGuide(
  id: string,
  data: {
    title?: string;
    content_html?: string;
    category?: string;
  },
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("size_guides")
    .update(data)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/size-guides");
  return { success: true };
}

export async function deleteSizeGuide(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("size_guides").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/size-guides");
  return { success: true };
}
