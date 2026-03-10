"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Collection } from "@/lib/types/database";

interface CollectionCardProps {
  collection: Collection;
  index: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="h-full"
    >
      <Link
        href={`/shop?collection=${collection.slug}`}
        className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/40 hover:border-gold/30 transition-all duration-500 bg-royal-black"
      >
        {/* Image Area */}
        <div className="relative aspect-4/5 overflow-hidden">
          {collection.image_url ? (
            <Image
              src={collection.image_url}
              alt={collection.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
              {/* Decorative Background Text */}
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-5">
                <span className="font-serif text-[10rem] whitespace-nowrap text-gold uppercase leading-none">
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

          {/* Decorative Corner */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/20 rounded-tl-lg z-20 group-hover:border-gold/40 transition-colors" />
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2 relative z-20 flex flex-col grow">
          <p className="text-gold tracking-[0.3em] uppercase text-[10px] mb-2 font-bold">
            Collection
          </p>
          <h3 className="font-serif text-2xl text-white mb-2 leading-tight group-hover:text-gold transition-colors">
            {collection.name}
          </h3>

          {collection.description && (
            <div
              className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2 prose prose-sm prose-invert"
              dangerouslySetInnerHTML={{ __html: collection.description }}
            />
          )}

          <div className="mt-auto flex items-center gap-2 text-gold group-hover:gap-3 transition-all duration-300">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold">
              Explore Piece
            </span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
