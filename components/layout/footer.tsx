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
    <footer className="bg-royal-black text-cream/90">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          {/* Brand & Contact column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4">
              <Image
                src="/logo.png"
                alt="Elita Apparel"
                width={140}
                height={56}
                className="h-14 w-auto object-contain mb-4"
              />
              <p className="text-sm text-cream/60 leading-relaxed">
                Premium African fashion celebrating heritage through elite
                craftsmanship.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <p className="text-sm text-cream/60">{BRAND.location}</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <Link
                  href={`mailto:${SOCIALS.email}`}
                  className="text-sm text-cream/60 hover:text-gold transition-colors"
                >
                  {SOCIALS.email}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={SOCIALS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </Link>
              <Link
                href={SOCIALS.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="TikTok"
              >
                <Tiktok size={16} />
              </Link>
              <Link
                href={SOCIALS.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="X (Twitter)"
              >
                <Twitter size={14} />
              </Link>
              <Link
                href={SOCIALS.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </Link>
              <Link
                href={SOCIALS.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Whatsapp size={16} />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif text-lg text-cream mb-6 tracking-wide">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cream/60 hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-serif text-lg text-cream mb-6 tracking-wide">
              Customer Service
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-sm text-cream/60 hover:text-gold transition-colors duration-300"
              >
                Shop All
              </Link>
              <Link
                href="/cart"
                className="text-sm text-cream/60 hover:text-gold transition-colors duration-300"
              >
                My Cart
              </Link>
              <Link
                href="/contact"
                className="text-sm text-cream/60 hover:text-gold transition-colors duration-300"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact info/Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-serif text-lg text-cream mb-6 tracking-wide">
              Stay in the Look
            </h4>
            <div className="space-y-6">
              <p className="text-sm text-cream/60 leading-relaxed">
                Subscribe for updates on new collections and exclusive offers.
              </p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="bg-white/5 border-cream/10 text-cream placeholder:text-cream/30 focus-visible:ring-gold/50 h-11"
                />
                <Button className="w-full bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-xs h-11">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        <Separator className="bg-cream/10" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">
            © {currentYear} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-cream/30 tracking-[0.3em] uppercase">
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
