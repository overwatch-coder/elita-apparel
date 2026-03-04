"use client";

import { motion } from "motion/react";
import { BRAND_MESSAGES } from "@/lib/constants";

export function BrandStory() {
  return (
    <section className="pt-24 lg:pt-32 pb-16 bg-royal-black text-cream relative overflow-hidden">
      {/* Decorative gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-gold tracking-[0.4em] uppercase text-xs mb-8"
          >
            Our Story
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8"
          >
            Celebrating African Heritage
            <br />
            Through <span className="text-gold">Elite Craftsmanship</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream/60 text-base sm:text-lg leading-relaxed mb-12 max-w-3xl mx-auto"
          >
            Elita Apparel is a premium African fashion house rooted in Accra,
            Ghana. Each garment reflects premium fabrics, skilled tailoring, and
            detailed finishing. We don&apos;t do fast fashion — we create pieces
            that tell stories, honor traditions, and make you feel proud of your
            heritage.
          </motion.p>

          {/* Value propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Premium Fabrics",
                description:
                  "Sourced from the finest textile markets across West Africa",
              },
              {
                title: "Expert Tailoring",
                description:
                  "Every stitch reflects generations of craftsmanship",
              },
              {
                title: "Cultural Roots",
                description:
                  "Each design tells a story of heritage and identity",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-12 h-px bg-gold mx-auto mb-6" />
                <h3 className="font-serif text-lg text-cream mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-cream/50 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Rotating brand messages */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 pt-12 border-t border-cream/10"
          >
            <p className="text-cream/30 tracking-[0.3em] uppercase text-xs">
              {BRAND_MESSAGES[0]}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
