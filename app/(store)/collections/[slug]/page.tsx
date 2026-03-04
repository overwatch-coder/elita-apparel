import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import type { Metadata } from "next";
import type { Product, ProductImage } from "@/lib/types/database";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!collection) return { title: "Collection Not Found" };

  return {
    title: `${collection.name} | Elita Apparel`,
    description:
      collection.description || `Explore the ${collection.name} collection.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!collection) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("collection_id", collection.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const typedProducts = (products || []) as (Product & {
    product_images: ProductImage[];
  })[];

  return (
    <div className="min-h-screen">
      {/* Collection header */}
      <section className="bg-royal-black pt-24 lg:pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <p className="text-gold tracking-[0.4em] uppercase text-xs mb-4">
            Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream mb-6">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-cream/50 leading-relaxed">
              {collection.description}
            </p>
          )}
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>
      </section>

      {/* Cultural story */}
      {collection.cultural_story && (
        <section className="py-12 bg-cream-dark dark:bg-royal-black/30">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">
              The Story
            </p>
            <p className="text-foreground/70 leading-relaxed italic font-serif text-lg">
              &ldquo;{collection.cultural_story}&rdquo;
            </p>
          </div>
        </section>
      )}

      {/* Products grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {typedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {typedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground">
                No products in this collection yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
