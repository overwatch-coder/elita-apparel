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
      <section className="bg-royal-black py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-gold tracking-[0.4em] uppercase text-xs mb-4">
            Curated for You
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream mb-6">
            Our Collections
          </h1>
          <p className="text-cream/50 max-w-xl mx-auto">
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
                    className="group relative block rounded-xl overflow-hidden border border-border/50 hover:border-gold/30 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative aspect-16/10 bg-muted">
                      {collection.image_url ? (
                        <Image
                          src={collection.image_url}
                          alt={collection.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-royal-black/80 flex items-center justify-center">
                          <span className="font-serif text-4xl text-gold/20">
                            {collection.name.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-gold/80 tracking-[0.3em] uppercase text-[10px] mb-2">
                          {productCount} piece{productCount !== 1 ? "s" : ""}
                        </p>
                        <h2 className="font-serif text-2xl text-cream mb-1">
                          {collection.name}
                        </h2>
                        {collection.description && (
                          <p className="text-cream/50 text-sm line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-4 text-gold text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                          Explore
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
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
