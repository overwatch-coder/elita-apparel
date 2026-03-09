"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BsInstagram as Instagram } from "react-icons/bs";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { SOCIALS } from "@/lib/constants";
import { InstagramPost } from "@/lib/types/database";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface InstagramSectionProps {
  posts: InstagramPost[];
  limit?: number;
}

export function InstagramSection({ posts, limit = 6 }: InstagramSectionProps) {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const instagramUrl = SOCIALS.instagram.url;

  // Show only up to the limit
  const displayPosts = posts.slice(0, limit);

  // Sync carousel with selected post index
  useEffect(() => {
    if (!api || !selectedPost) return;

    const index = displayPosts.findIndex((p) => p.id === selectedPost.id);
    if (index !== -1) {
      api.scrollTo(index, true); // true for jump without animation initially
    }
  }, [api, selectedPost, displayPosts]);

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
            <div
              key={post.id}
              className="group relative aspect-square rounded-lg overflow-hidden bg-accent/10 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <Image
                src={post.image_url}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Direct Redirect Icon */}
              <Link
                href={post.post_url || instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border/50 hover:bg-primary hover:text-white"
                title="View on Instagram"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </motion.div>

        {/* Lightbox Dialog */}
        <Dialog
          open={!!selectedPost}
          onOpenChange={(open) => !open && setSelectedPost(null)}
        >
          <DialogContent
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen max-w-none p-0 border-none bg-black/95 shadow-none flex items-center justify-center z-100"
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">
              Instagram Gallery View
            </DialogTitle>

            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full h-full relative flex items-center justify-center"
            >
              <CarouselContent className="h-full ml-0">
                {displayPosts.map((post) => (
                  <CarouselItem
                    key={post.id}
                    className="pl-0 h-full w-screen flex items-center justify-center shrink-0"
                  >
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-20">
                      <div className="relative w-full h-[60vh] sm:h-[75vh] max-w-[90vw] md:max-w-4xl">
                        <Image
                          src={post.image_url}
                          alt="Instagram post preview"
                          fill
                          className="object-contain"
                          quality={100}
                          priority
                        />
                      </div>

                      {/* Action Button - Floating below the image */}
                      <div className="mt-8">
                        <Button
                          asChild
                          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                        >
                          <Link
                            href={post.post_url || instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Instagram className="mr-2 h-4 w-4" />
                            View on Instagram
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Arrows */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-10 z-110 pointer-events-none">
                <CarouselPrevious className="static pointer-events-auto bg-white/10 border-white/10 text-white hover:bg-white/20 h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 translate-y-0 hover:scale-110" />
                <CarouselNext className="static pointer-events-auto bg-white/10 border-white/10 text-white hover:bg-white/20 h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 translate-y-0 hover:scale-110" />
              </div>
            </Carousel>

            {/* Close Button - Fixed relative to the viewport top right */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 z-120 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 hover:rotate-90 shadow-2xl border border-white/10"
              aria-label="Close lightbox"
            >
              <X className="h-7 w-7" />
            </button>
          </DialogContent>
        </Dialog>

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
