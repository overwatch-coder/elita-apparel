import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { ImageUpload } from "@/components/admin/image-upload";
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
    { data: images },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("collections").select("*").order("name"),
    supabase
      .from("product_images")
      .select("*")
      .eq("product_id", id)
      .order("position"),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Edit Product</h1>
        <p className="text-muted-foreground mt-1">{product.name}</p>
      </div>
      <ImageUpload productId={product.id} images={images || []} />
      <ProductForm
        product={product}
        categories={categories || []}
        collections={collections || []}
      />
    </div>
  );
}
