import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import type { Metadata } from "next";
import type { Product, ProductImage } from "@/lib/types/database";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

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
      <section className="relative min-h-[50vh] flex items-center pt-24 pb-16 overflow-hidden bg-royal-black">
        {/* Background Decorative Text - Large serif title for premium feel */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-5">
          <span className="font-serif text-[20vw] whitespace-nowrap text-gold uppercase leading-none">
            {collection.name}
          </span>
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold tracking-[0.4em] uppercase text-xs mb-6 font-bold">
              Collection
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-8xl text-cream mb-8 leading-tight">
              {collection.name}
            </h1>

            {collection.description && (
              <div
                className="text-cream/70 leading-relaxed prose prose-invert mx-auto max-w-2xl text-sm sm:text-base mb-10 px-4"
                dangerouslySetInnerHTML={{ __html: collection.description }}
              />
            )}

            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gold/30" />
              <div className="w-2 h-2 rounded-full bg-gold" />
              <div className="h-px w-12 bg-gold/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cultural story - Improved layout */}
      {collection.cultural_story && (
        <section className="py-16 sm:py-24 bg-cream-dark dark:bg-royal-black/20 border-y border-border/10">
          <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gold/10 p-3 rounded-full mb-6">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <p className="text-gold tracking-[0.3em] uppercase text-[10px] font-bold mb-4">
                The Heritage
              </p>
              <div
                className="text-foreground/80 leading-relaxed italic font-serif text-lg sm:text-2xl prose mx-auto dark:prose-invert px-4 sm:px-0"
                dangerouslySetInnerHTML={{ __html: collection.cultural_story }}
              />
            </div>
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
