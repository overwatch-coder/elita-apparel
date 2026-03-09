"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
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
    >
      <Link
        href={`/shop?collection=${collection.slug}`}
        className="group block relative overflow-hidden rounded-lg aspect-4/5 bg-muted"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/20 z-10" />

        {/* Decorative border */}
        <div className="absolute inset-3 border border-gold/20 rounded-md z-20 group-hover:border-gold/40 transition-colors duration-500" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <p className="text-gold tracking-[0.3em] uppercase text-[10px] mb-3">
            Collection
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl text-foreground mb-3 leading-tight">
            {collection.name}
          </h3>
          {collection.description && (
            <div
              className="text-foreground/50 text-sm leading-relaxed mb-4 line-clamp-2 prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: collection.description }}
            />
          )}
          <div className="flex items-center gap-2 text-gold group-hover:gap-3 transition-all duration-300">
            <span className="text-xs tracking-widest uppercase font-medium">
              Explore
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
