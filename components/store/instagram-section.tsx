"use client";

import { motion } from "motion/react";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/constants";

const INSTAGRAM_POSTS = [
  { id: 1, color: "bg-gold/20" },
  { id: 2, color: "bg-earth-brown/20" },
  { id: 3, color: "bg-gold/10" },
  { id: 4, color: "bg-earth-brown/10" },
  { id: 5, color: "bg-gold/15" },
  { id: 6, color: "bg-earth-brown/15" },
];

export function InstagramSection() {
  const instagramUrl = SOCIALS.instagram.url;

  return (
    <section className="py-20 lg:py-28">
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
            Follow Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl"
          >
            {SOCIALS.instagram.handle}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-16 h-px bg-gold mx-auto mt-6"
          />
        </div>

        {/* Instagram grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3"
        >
          {INSTAGRAM_POSTS.map((post, index) => (
            <a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden"
            >
              {/* Placeholder pattern */}
              <div
                className={`absolute inset-0 ${post.color} flex items-center justify-center`}
              >
                <div className="text-center">
                  <Instagram className="h-6 w-6 text-foreground/20 mx-auto mb-1" />
                  <p className="text-[8px] text-foreground/20 tracking-wider uppercase">
                    Post {index + 1}
                  </p>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="tracking-wider uppercase border-gold/30 hover:border-gold text-gold hover:bg-gold/5"
          >
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-4 w-4" />
              Follow on Instagram
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
