"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, BRAND, SOCIALS } from "@/lib/constants";
import { ChevronDown, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BsWhatsapp as Whatsapp } from "react-icons/bs";
import { ThemeToggle } from "@/components/theme-toggle";
import { CustomerNotificationWrapper } from "@/components/notifications/customer-notification-wrapper";
import { createClient } from "@/lib/supabase/client";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-sm p-0">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Elita Apparel"
                width={100}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span
                className={cn(
                  "font-serif text-lg tracking-wide transition-colors duration-300 text-foreground")}
              >
                Elita Apparel
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CustomerNotificationWrapper />
              <ThemeToggle />
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col px-6 py-8">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <MobileBrandGroup key={link.label} link={link} />
              ) : (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="py-4 text-xl font-serif tracking-wide text-foreground/80 hover:text-gold transition-colors duration-300 border-b border-border/30"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ),
            )}
          </nav>

          <Separator className="my-8" />

          <div className="space-y-4">
            <MobileAccountLink />

            <SheetClose asChild>
              <Button
                asChild
                className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase"
                size="lg"
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button
                asChild
                variant="outline"
                className="w-full border-gold/30 hover:border-gold hover:bg-gold/5 font-medium tracking-wider uppercase"
                size="lg"
              >
                <Link
                  href={SOCIALS.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Whatsapp className="h-5 w-5" />
                  WhatsApp Us
                </Link>
              </Button>
            </SheetClose>
          </div>

          <div className="mt-auto pt-8">
            <p className="text-xs text-muted-foreground text-center tracking-widest uppercase">
              {BRAND.tagline}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ── Auth-aware account link for mobile ───────────────────────────── */

function MobileAccountLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <SheetClose asChild>
      <Button
        asChild
        variant="outline"
        className="w-full border-border hover:border-gold hover:bg-gold/5 font-medium tracking-wider uppercase"
        size="lg"
      >
        <Link href={isLoggedIn ? "/account" : "/login"} className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {isLoggedIn ? "My Account" : "Sign In"}
        </Link>
      </Button>
    </SheetClose>
  );
}

/* ── Expandable brand group for mobile nav ───────────────────────── */

function MobileBrandGroup({ link }: { link: (typeof NAV_LINKS)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-4 text-xl font-serif tracking-wide text-foreground/80 hover:text-gold transition-colors duration-300"
        aria-expanded={expanded}
      >
        {link.label}
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>
      {expanded && link.children && (
        <div className="pb-3 pl-4 flex flex-col gap-1">
          {link.children.map((child) => (
            <SheetClose asChild key={child.href}>
              <Link
                href={child.href}
                className="py-2.5 text-lg text-foreground/60 hover:text-gold transition-colors duration-300"
              >
                {child.label}
              </Link>
            </SheetClose>
          ))}
        </div>
      )}
    </div>
  );
}
