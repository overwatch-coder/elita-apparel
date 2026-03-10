import { createClient } from "@/lib/supabase/server";
import { CollectionsClient } from "@/components/admin/collections-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Collections | Admin" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminCollectionsPage({
  searchParams,
}: PageProps) {
  const { page = "1", pageSize = "10" } = await searchParams;
  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();

  const { data: collections, count } = await supabase
    .from("collections")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <CollectionsClient
      collections={collections || []}
      totalCount={count || 0}
      pageSize={size}
      currentPage={currentPage}
    />
  );
}
