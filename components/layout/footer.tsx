"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, BRAND, SOCIALS } from "@/lib/constants";
import { subscribeToNewsletter } from "@/app/actions/marketing";
import { toast } from "sonner";
import {
  BsTwitterX as Twitter,
  BsTiktok as Tiktok,
  BsFacebook as Facebook,
  BsWhatsapp as Whatsapp,
  BsInstagram as Instagram,
} from "react-icons/bs";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isAccountPage = pathname.startsWith("/account");
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    const result = await subscribeToNewsletter(email, "newsletter");

    if (result.success) {
      toast.success(result.message);
      setEmail("");
    } else {
      toast.error(result.error);
    }

    setIsSubscribing(false);
  };

  const currentYear = new Date().getFullYear();

  if (isAccountPage) return null;

  return (
    <footer className="bg-background text-foreground selection:bg-gold/30 selection:text-white border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <Link href="/">
                <Image
                  src={"/logo.png"}
                  alt="Elita Apparel"
                  width={140}
                  height={56}
                  className="h-24 w-24 object-contain transition-all"
                />
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Celebrating African heritage through vibrant, modern clothing
                that empowers individuals to embrace their roots.
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
                <Phone className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{SOCIALS.phone}</p>
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
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 w-fit"
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
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubscribing}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground h-11 focus-visible:ring-gold/50"
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-xs h-11"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
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
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 w-fit"
                >
                  Shop All
                </Link>
                <Link
                  href="/track"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 w-fit"
                >
                  Track Order
                </Link>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 w-fit"
                >
                  Contact Us
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 w-fit"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 w-fit"
                >
                  Terms & Conditions
                </Link>
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
              <Link
                href={SOCIALS.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border hidden items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300"
                aria-label="X (Twitter)"
              >
                <Twitter size={14} />
              </Link>
              <Link
                href={SOCIALS.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300"
                aria-label="TikTok"
              >
                <Tiktok size={14} />
              </Link>
              <Link
                href={SOCIALS.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-full border border-border hidden items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            © {currentYear} {BRAND.name}. All rights reserved. {BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
