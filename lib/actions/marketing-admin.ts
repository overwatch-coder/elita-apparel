"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSubscribers(page = 1, pageSize = 20) {
  const supabase = await createClient();

  // Ensure admin role
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || userData.user?.user_metadata.role !== "admin") {
    return { error: "Unauthorized access" };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching subscribers:", error);
    return { error: error.message };
  }

  // Resolve missing names from orders for subscribers without a full_name
  const enrichedSubscribers = await Promise.all(
    data.map(async (sub) => {
      if (!sub.full_name) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("customer_name")
          .eq("customer_email", sub.email)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (orderData?.customer_name) {
          return { ...sub, full_name: orderData.customer_name };
        }
      }
      return sub;
    }),
  );

  return {
    subscribers: enrichedSubscribers,
    totalCount: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
