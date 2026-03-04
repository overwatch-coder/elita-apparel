import { createClient } from "@/lib/supabase/server";
import { CollectionsClient } from "@/components/admin/collections-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collections | Admin" };

export default async function AdminCollectionsPage() {
  const supabase = await createClient();

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });

  return <CollectionsClient collections={collections || []} />;
}
