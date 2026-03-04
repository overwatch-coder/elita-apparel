import { createClient } from "@/lib/supabase/server";
import { InventoryClient } from "@/components/admin/inventory-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inventory | Admin" };

export default async function AdminInventoryPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("stock_quantity", { ascending: true });

  return <InventoryClient products={products || []} />;
}
