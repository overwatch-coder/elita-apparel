"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSubscribers() {
  const supabase = await createClient();

  // Ensure admin role
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || userData.user?.user_metadata.role !== "admin") {
    return { error: "Unauthorized access" };
  }

  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching subscribers:", error);
    return { error: error.message };
  }

  return { subscribers: data };
}
