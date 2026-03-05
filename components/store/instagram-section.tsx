"use client";

import { motion } from "motion/react";
import { BsInstagram as Instagram } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/constants";
import { InstagramPost } from "@/lib/types/database";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface InstagramSectionProps {
  posts: InstagramPost[];
  limit?: number;
}

export function InstagramSection({ posts, limit = 6 }: InstagramSectionProps) {
  const instagramUrl = SOCIALS.instagram.url;

  // Show only up to the limit
  const displayPosts = posts.slice(0, limit);

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
          className={cn(
            "grid gap-2 sm:gap-3",
            displayPosts.length <= 3
              ? "grid-cols-2 md:grid-cols-3"
              : "grid-cols-3 md:grid-cols-6",
          )}
        >
          {displayPosts.map((post, index) => (
            <a
              key={post.id}
              href={post.post_url || instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-accent/10"
            >
              <Image
                src={post.image_url}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

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
