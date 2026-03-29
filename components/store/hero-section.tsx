"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [20, 108]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  return (
    <section
      ref={sectionRef}
      className="relative h-svh min-h-150 max-h-225 overflow-hidden -mt-6 lg:mt-0"
    >
      {/* Fixed image with a stronger drift and slight zoom-out as the section scrolls away */}
      <motion.div
        className="absolute inset-x-0 -top-[7%] h-[120%] will-change-transform"
        style={{
          y: shouldReduceMotion ? 0 : backgroundY,
          scale: shouldReduceMotion ? 1 : backgroundScale,
          backgroundImage: "url('/apparel-1.jpeg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 43%",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/62 via-black/38 to-black/58 md:bg-black/40" />
      </motion.div>

      {/* Content overlay */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-5 pt-24 pb-12 text-center sm:px-6 md:px-4 md:pt-0 md:pb-0"
        style={{
          y: shouldReduceMotion ? 0 : contentY,
          opacity: shouldReduceMotion ? 1 : contentOpacity,
        }}
      >
        <div className="relative w-full max-w-sm px-5 py-8 md:max-w-none md:px-0 md:py-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 inset-y-4 rounded-[2.25rem] bg-black/12 opacity-90 blur-2xl md:hidden"
          />
          {/* Main inscription — large & prominent */}
            <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
              className="relative mx-auto max-w-[11ch] font-serif text-[2.55rem] leading-[0.96] text-white [text-shadow:0_12px_36px_rgba(0,0,0,0.55)] sm:text-5xl md:max-w-5xl md:text-6xl md:leading-[1.1] md:text-shadow-none lg:text-7xl xl:text-8xl"
          >
            Wrapped In Culture.
            <br />
            <span className="text-gold-shimmer">Wrapped In Elita.</span>
          </motion.h1>

          {/* Supporting line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mt-4 max-w-[24ch] text-sm leading-6 text-white/88 [text-shadow:0_8px_24px_rgba(0,0,0,0.45)] sm:text-base md:mt-6 md:max-w-lg md:text-xl md:tracking-wide md:text-shadow-none"
          >
            Browse our latest products
          </motion.p>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="relative mt-8 md:mt-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 -inset-y-2 rounded-full bg-white/12 opacity-90 blur-xl md:hidden"
            />
            <Link
              href="/shop"
              className="relative inline-flex h-13 items-center justify-center rounded-full border border-white/65 bg-white/10 px-9 text-sm font-medium uppercase tracking-[0.26em] text-white backdrop-blur-md transition-all hover:border-white hover:bg-white/16 md:h-14 md:rounded-md md:bg-transparent md:px-12 md:text-base md:tracking-wider md:backdrop-blur-sm"
            >
              Shop all
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-linear-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
