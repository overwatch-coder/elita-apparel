import { createClient } from "@/lib/supabase/server";
import { FabricTypesClient } from "@/components/admin/fabric-types-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fabric Types | Admin" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

export default async function AdminFabricTypesPage({
  searchParams,
}: PageProps) {
  const { page = "1", pageSize = "10" } = await searchParams;
  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();

  const { data: fabricTypes, count } = await supabase
    .from("fabric_types")
    .select("*", { count: "exact" })
    .order("name")
    .range(from, to);

  return (
    <FabricTypesClient
      initialFabricTypes={fabricTypes || []}
      totalCount={count || 0}
      pageSize={size}
      currentPage={currentPage}
    />
  );
}
