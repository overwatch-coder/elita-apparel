import { createClient } from "@/lib/supabase/server";
import { ProductWizard } from "@/components/admin/product-wizard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Product | Admin" };

export default async function NewProductPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: collections }, { data: fabricTypes }] =
    await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("collections").select("*").order("name"),
      supabase.from("fabric_types").select("*").order("name"),
    ]);

  return (
    <div className="space-y-6">
      <ProductWizard
        categories={categories || []}
        collections={collections || []}
        fabricTypes={fabricTypes || []}
      />
    </div>
  );
}
