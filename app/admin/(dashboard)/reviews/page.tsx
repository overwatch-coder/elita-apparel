import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReviewsModerationClient } from "./reviews-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reviews Moderation | Admin" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const {
    page = "1",
    pageSize = "10",
    status = "all",
    q = "",
  } = await searchParams;

  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Build query
  let query = supabase.from("reviews").select(
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
    { count: "exact" },
  );

  // Status Filter
  if (status === "pending") {
    query = query.eq("is_approved", false);
  } else if (status === "approved") {
    query = query.eq("is_approved", true);
  }

  // Search Filter (if possible via Supabase, but comment is text searchable)
  if (q) {
    query = query.ilike("comment", `%${q}%`);
  }

  const {
    data: reviews,
    count,
    error: reviewsError,
  } = await query.order("created_at", { ascending: false }).range(from, to);

  if (reviewsError) {
    console.error("Error fetching reviews:", reviewsError);
  }

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

  return (
    <ReviewsModerationClient
      reviews={enrichedReviews}
      totalCount={count || 0}
      pageSize={size}
      currentPage={currentPage}
    />
  );
}
