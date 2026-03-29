"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section
      className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden -mt-6 lg:mt-0"
    >
      {/* Background image — fixed to viewport so it doesn't scroll */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-temp.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Main inscription — large & prominent */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.1] mb-6 max-w-5xl"
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
          className="text-white/80 text-base sm:text-lg md:text-xl tracking-wide mb-10 max-w-lg"
        >
          Browse our latest products
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-white/60 bg-transparent text-white hover:bg-white/10 hover:border-white font-medium tracking-wider uppercase px-12 h-14 text-base rounded-md backdrop-blur-sm transition-all"
          >
            Shop all
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
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
