import { createClient } from "@/lib/supabase/server";
import { DiscountsClient } from "@/components/admin/discounts-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Discounts | Admin" };

export default async function AdminDiscountsPage() {
  const supabase = await createClient();

  const { data: discounts } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return <DiscountsClient discounts={discounts || []} />;
}
