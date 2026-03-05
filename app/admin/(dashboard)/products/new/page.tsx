import { createClient } from "@/lib/supabase/server";
import { ProductWizard } from "@/components/admin/product-wizard";
import type { Metadata } from "next";
import { Suspense } from "react";

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
      <Suspense
        fallback={
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        }
      >
        <ProductWizard
          categories={categories || []}
          collections={collections || []}
          fabricTypes={fabricTypes || []}
        />
      </Suspense>
    </div>
  );
}
