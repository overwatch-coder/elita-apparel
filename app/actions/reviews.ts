"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(data: {
  product_id: string;
  rating: number;
  comment?: string;
  image_url?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // Check if user has an order for this product
  const { data: purchaseCheck } = await supabase
    .from("order_items")
    .select("id, orders!inner(user_id)")
    .eq("product_id", data.product_id)
    .eq("orders.user_id", user.id)
    .limit(1);

  if (!purchaseCheck || purchaseCheck.length === 0) {
    return {
      success: false,
      error: "You must have purchased this product to leave a review",
    };
  }

  // Check if already reviewed
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", data.product_id)
    .eq("user_id", user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    return { success: false, error: "You have already reviewed this product" };
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: data.product_id,
    user_id: user.id,
    rating: data.rating,
    comment: data.comment || null,
    image_url: data.image_url || null,
    is_approved: false,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      image_url,
      created_at,
      user_id
    `,
    )
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error || !data) return { reviews: [], avgRating: 0, count: 0 };

  // Fetch profile names
  const userIds = [...new Set(data.map((r) => r.user_id))];
  const { data: profiles } =
    userIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds)
      : { data: [] as any[] };

  const profileMap = new Map(
    (profiles || []).map((p: any) => [p.id, p.full_name]),
  );

  const reviews = data.map((r) => ({
    ...r,
    profiles: { full_name: profileMap.get(r.user_id) || null },
  }));
  const count = reviews.length;
  const avgRating =
    count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return { reviews, avgRating: Math.round(avgRating * 10) / 10, count };
}

export async function moderateReview(id: string, approve: boolean) {
  const supabase = await createClient();

  if (approve) {
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}
