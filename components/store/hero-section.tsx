"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";

const VALUE_PROPS = [
  { icon: Sparkles, label: "Handcrafted Quality" },
  { icon: Shield, label: "Authentic Fabrics" },
  { icon: Truck, label: "Worldwide Delivery" },
] as const;

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-royal-black">
      {/* Subtle geometric pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C6A75E' fill-opacity='1'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill-opacity='0.3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative gold accents */}
      <div className="absolute top-0 left-0 w-24 h-24 sm:w-40 sm:h-40 border-t-2 border-l-2 border-gold/20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 border-b-2 border-r-2 border-gold/20" />

      {/* Floating gold line — left side accent */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 w-px h-48 bg-linear-to-b from-transparent via-gold/40 to-transparent origin-top"
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-32 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content — left side */}
          <div className="lg:pl-8">
            {/* Overline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-10 h-px bg-gold" />
              <p className="text-gold tracking-[0.4em] uppercase text-xs">
                Premium African Fashion
              </p>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream leading-[1.05] mb-8"
            >
              Wrapped in
              <br />
              Culture.
              <br />
              <span className="text-gold-shimmer">Wrapped in Elita.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-cream/55 text-base sm:text-lg max-w-md mb-10 leading-relaxed"
            >
              Where culture meets craftsmanship. Discover premium pieces that
              celebrate heritage through elite design and authentic artistry
              from {BRAND.location}.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase px-10 h-14 text-base"
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-cream/25 text-cream hover:bg-cream/5 hover:border-cream/40 font-medium tracking-wider uppercase px-10 h-14 text-base"
              >
                <Link href="/collections">Explore Collections</Link>
              </Button>
            </motion.div>

            {/* Value propositions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="flex flex-wrap gap-8"
            >
              {VALUE_PROPS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-gold/70" />
                  <span className="text-cream/40 text-xs tracking-widest uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side — editorial atmosphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Large decorative gold ring */}
            <div className="relative w-[420px] h-[420px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-gold/15" />
              {/* Inner ring */}
              <div className="absolute inset-8 rounded-full border border-gold/10" />

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gold/60 tracking-[0.5em] uppercase text-[10px] mb-3">
                    Est. 2024
                  </p>
                  <p className="font-serif text-cream/20 text-5xl leading-none mb-3">
                    EA
                  </p>
                  <p className="text-cream/20 tracking-[0.3em] uppercase text-[9px]">
                    {BRAND.tagline}
                  </p>
                </div>
              </div>

              {/* Animated rotating accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-4 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0%, transparent 85%, rgba(198, 167, 94, 0.15) 95%, transparent 100%)",
                }}
              />
            </div>

            {/* Floating gold dots */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-16 right-16 w-2 h-2 rounded-full bg-gold/30"
            />
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-24 left-8 w-1.5 h-1.5 rounded-full bg-gold/20"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-linear-to-b from-gold/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
