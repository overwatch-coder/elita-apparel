"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, BRAND, SOCIALS } from "@/lib/constants";
import {
  BsTwitterX as Twitter,
  BsTiktok as Tiktok,
  BsFacebook as Facebook,
  BsWhatsapp as Whatsapp,
  BsInstagram as Instagram,
} from "react-icons/bs";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground selection:bg-gold/30 selection:text-white border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Elita Apparel"
                  width={140}
                  height={56}
                  className="h-12 w-auto object-contain dark:invert-0 light:invert transition-all"
                />
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium African fashion celebrating heritage through elite
                craftsmanship.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {BRAND.location}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <Link
                  href={`mailto:${SOCIALS.email}`}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  {SOCIALS.email}
                </Link>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter - Now in the middle slots */}
          <div className="space-y-6">
            <h4 className="font-serif text-lg mb-6 tracking-wide">
              Stay in the Loop
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Subscribe for updates on new collections and exclusive offers.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Email Address"
                className="bg-card border-border text-foreground placeholder:text-muted-foreground h-11"
              />
              <Button className="w-full bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-xs h-11">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Customer service & Socials */}
          <div className="space-y-8">
            <div>
              <h4 className="font-serif text-lg mb-6 tracking-wide">
                Customer Service
              </h4>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/shop"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300"
                >
                  Shop All
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={SOCIALS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </Link>
              <Link
                href={SOCIALS.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Whatsapp size={14} />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            © {currentYear} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/30 tracking-[0.3em] uppercase">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
