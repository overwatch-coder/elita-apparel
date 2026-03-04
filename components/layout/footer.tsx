import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, BRAND, SOCIALS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-royal-black text-cream/90">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/logo.png"
              alt="Elita Apparel"
              width={140}
              height={56}
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="text-sm text-cream/60 leading-relaxed mb-6">
              Premium African fashion celebrating heritage through elite
              craftsmanship. Each garment reflects premium fabrics, skilled
              tailoring, and detailed finishing.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={SOCIALS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href={SOCIALS.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </Link>
              <Link
                href={`mailto:${SOCIALS.email}`}
                className="h-10 w-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
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
                href={`${SOCIALS.whatsapp.url}?text=Hi, I would like to make an inquiry about your products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cream/60 hover:text-gold transition-colors duration-300"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-serif text-lg text-cream mb-6 tracking-wide">
              Get in Touch
            </h4>
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
              <div className="flex items-start gap-3">
                <Instagram className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <Link
                  href={SOCIALS.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/60 hover:text-gold transition-colors"
                >
                  {SOCIALS.instagram.handle}
                </Link>
              </div>
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
