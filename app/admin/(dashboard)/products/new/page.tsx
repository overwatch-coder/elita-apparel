import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Product | Admin" };

export default async function NewProductPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: collections }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("collections").select("*").order("name"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">New Product</h1>
        <p className="text-muted-foreground mt-1">Create a new product</p>
      </div>
      <ProductForm
        categories={categories || []}
        collections={collections || []}
      />
    </div>
  );
}
