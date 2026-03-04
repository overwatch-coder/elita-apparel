import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReviewsModerationClient } from "./reviews-client";

export const metadata = {
  title: "Reviews Moderation | Admin",
};

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check admin
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!admin) redirect("/");

  // Fetch all reviews with product info
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      image_url,
      is_approved,
      created_at,
      user_id,
      products:product_id (name, slug)
    `,
    )
    .order("created_at", { ascending: false });

  // Fetch user names for the reviews
  const userIds = [...new Set((reviews || []).map((r: any) => r.user_id))];
  const { data: profiles } =
    userIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds)
      : { data: [] };

  const profileMap = new Map(
    (profiles || []).map((p: any) => [p.id, p.full_name]),
  );

  const enrichedReviews = (reviews || []).map((r: any) => ({
    ...r,
    profiles: { full_name: profileMap.get(r.user_id) || null },
  }));

  return <ReviewsModerationClient reviews={enrichedReviews} />;
}
