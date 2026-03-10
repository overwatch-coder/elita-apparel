import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections | Elita Apparel",
  description:
    "Explore our curated collections of premium African fashion, celebrating culture through elite craftsmanship.",
};

export default async function CollectionsPage() {
  const supabase = await createClient();

  const { data: collections } = await supabase
    .from("collections")
    .select("*, products(id)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-background pt-24 lg:pt-32 pb-16 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-gold tracking-[0.4em] uppercase text-xs mb-4">
            Curated for You
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            Our Collections
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each collection tells a story of African heritage, premium fabrics,
            and skilled craftsmanship.
          </p>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>
      </section>

      {/* Collections grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {collections && collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {collections.map((collection) => {
                const productCount = Array.isArray(collection.products)
                  ? collection.products.length
                  : 0;

                return (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="group relative block rounded-2xl overflow-hidden border border-border/40 hover:border-gold/30 transition-all duration-500 bg-royal-black"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-16/10 sm:aspect-video overflow-hidden">
                      {collection.image_url ? (
                        <Image
                          src={collection.image_url}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
                          {/* Decorative Background Text - Refined for mobile */}
                          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-5">
                            <span className="font-serif text-[12rem] whitespace-nowrap text-gold uppercase leading-none">
                              {collection.name}
                            </span>
                          </div>
                          <span className="font-serif text-4xl text-gold relative z-10">
                            {collection.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-linear-to-t from-royal-black via-royal-black/40 to-transparent z-10" />

                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase">
                          {productCount}{" "}
                          {productCount === 1 ? "Piece" : "Pieces"}
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 relative z-20">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <p className="text-gold tracking-[0.3em] uppercase text-[10px] mb-1 font-bold">
                            Collection
                          </p>
                          <h2 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-gold transition-colors duration-300">
                            {collection.name}
                          </h2>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300 shrink-0">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>

                      {collection.description && (
                        <div
                          className="text-white/60 text-sm line-clamp-2 prose prose-invert prose-sm mb-2"
                          dangerouslySetInnerHTML={{
                            __html: collection.description,
                          }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground">
                Collections coming soon. Stay tuned!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
