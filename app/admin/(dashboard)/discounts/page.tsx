import { createClient } from "@/lib/supabase/server";
import { DiscountsClient } from "@/components/admin/discounts-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Discounts | Admin" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminDiscountsPage({ searchParams }: PageProps) {
  const { page = "1", pageSize = "10" } = await searchParams;
  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();

  const { data: discounts, count } = await supabase
    .from("discount_codes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <DiscountsClient
      discounts={discounts || []}
      totalCount={count || 0}
      pageSize={size}
      currentPage={currentPage}
    />
  );
}
