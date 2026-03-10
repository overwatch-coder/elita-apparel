import { createClient } from "@/lib/supabase/server";
import { CategoriesClient } from "@/components/admin/categories-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories | Admin" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { page = "1", pageSize = "10" } = await searchParams;
  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();

  const { data: categories, count } = await supabase
    .from("categories")
    .select("*", { count: "exact" })
    .order("name")
    .range(from, to);

  return (
    <CategoriesClient
      categories={categories || []}
      totalCount={count || 0}
      pageSize={size}
      currentPage={currentPage}
    />
  );
}
