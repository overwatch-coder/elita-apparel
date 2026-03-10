import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SizeGuidesClient } from "./size-guides-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guides | Admin",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminSizeGuidesPage({ searchParams }: PageProps) {
  const { page = "1", pageSize = "10" } = await searchParams;
  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: guides, count } = await supabase
    .from("size_guides")
    .select("*", { count: "exact" })
    .order("title")
    .range(from, to);

  return (
    <SizeGuidesClient
      guides={guides || []}
      totalCount={count || 0}
      pageSize={size}
      currentPage={currentPage}
    />
  );
}
