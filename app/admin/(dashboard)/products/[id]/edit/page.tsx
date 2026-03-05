import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductWizard } from "@/components/admin/product-wizard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product | Admin" };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: product },
    { data: categories },
    { data: collections },
    { data: fabricTypes },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("collections").select("*").order("name"),
    supabase.from("fabric_types").select("*").order("name"),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductWizard
        product={product as any}
        categories={categories || []}
        collections={collections || []}
        fabricTypes={fabricTypes || []}
      />
    </div>
  );
}
