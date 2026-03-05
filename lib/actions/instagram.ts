"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { InstagramPost } from "@/lib/types/database";

export async function getInstagramPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching instagram posts:", error);
    return [];
  }
  return data as InstagramPost[];
}

export async function getInstagramLimit() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "instagram_feed_limit")
    .single();

  if (error) {
    console.error("Error fetching instagram limit:", error);
    return 6;
  }
  return parseInt(data.value as string) || 6;
}

export async function upsertInstagramPost(post: Partial<InstagramPost>) {
  const supabase = await createClient();

  if (!post.image_url || !post.post_url) {
    return { success: false, error: "Image URL and Post URL are required" };
  }

  const postData = {
    image_url: post.image_url,
    post_url: post.post_url,
    display_order: post.display_order ?? 0,
    is_active: post.is_active ?? true,
  };

  const { data, error } = post.id
    ? await supabase
        .from("instagram_posts")
        .update(postData)
        .eq("id", post.id)
        .select()
    : await supabase.from("instagram_posts").insert(postData).select();

  if (error) {
    console.error("Error upserting instagram post:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true, data };
}

export async function deleteInstagramPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("instagram_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting instagram post:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateInstagramLimit(limit: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert({
    key: "instagram_feed_limit",
    value: JSON.stringify(limit),
    description: "Number of Instagram posts to show on the landing page",
  });

  if (error) {
    console.error("Error updating instagram limit:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
