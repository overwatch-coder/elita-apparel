"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, BRAND } from "@/lib/constants";

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
            <Image
              src="/logo.png"
              alt="Elita Apparel"
              width={100}
              height={40}
              className="h-10 w-auto object-contain invert dark:invert-0"
            />
          </div>
        </SheetHeader>

        <div className="flex flex-col px-6 py-8">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="py-4 text-xl font-serif tracking-wide text-foreground/80 hover:text-gold transition-colors duration-300 border-b border-border/30"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>

          <Separator className="my-8" />

          <div className="space-y-4">
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
                  href={`https://wa.me/${BRAND.whatsappNumber.replace(
                    /\+/g,
                    "",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
