"use client";

import { motion } from "motion/react";
import { CollectionCard } from "@/components/store/collection-card";
import type { Collection } from "@/lib/types/database";

interface CollectionsSectionProps {
  collections: Collection[];
}

export function CollectionsSection({ collections }: CollectionsSectionProps) {
  if (collections.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-cream-dark dark:bg-royal-black/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="text-gold tracking-[0.3em] uppercase text-xs mb-4"
          >
            Curated for You
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl"
          >
            Our Collections
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-16 h-px bg-gold mx-auto mt-6"
          />
        </div>

        {/* Collections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
