"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToWishlist(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase.from("wishlists").insert({
    user_id: user.id,
    product_id: productId,
  });

  if (error) {
    // Ignore duplicate
    if (error.code === "23505") return { success: true };
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function removeFromWishlist(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getWishlist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { items: [] };

  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);

  if (error) return { items: [] };
  return { items: data.map((w) => w.product_id) };
}

export async function syncGuestWishlist(productIds: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || productIds.length === 0) return { success: false };

  // Upsert each product — ignore duplicates
  const rows = productIds.map((productId) => ({
    user_id: user.id,
    product_id: productId,
  }));

  const { error } = await supabase
    .from("wishlists")
    .upsert(rows, { onConflict: "user_id,product_id", ignoreDuplicates: true });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
