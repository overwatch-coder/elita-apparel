"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import { CustomerNotificationWrapper } from "@/components/notifications/customer-notification-wrapper";

export function Navbar() {
  const pathname = usePathname();
  const isAccountPage = pathname.startsWith("/account");

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAccountPage) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-background/20 backdrop-blur-[2px] border-b border-foreground/5",
      )}
    >
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo + Brand — far left */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative h-11 w-11">
            <Image
              src="/logo.png"
              alt="Elita Apparel"
              width={44}
              height={44}
              className="h-11 w-auto object-contain"
            />
          </div>
          <span className="hidden sm:inline font-serif text-lg tracking-wide text-foreground">
            Elita Apparel
          </span>
        </Link>

        {/* Desktop nav links + cart — right side */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-widest uppercase transition-colors duration-300",
                  isActive ? "text-gold" : "text-foreground/80 hover:text-gold",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="w-px h-5 bg-border/60 mx-1" />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <CustomerNotificationWrapper />
            <CartSheet />
          </div>
        </div>

        {/* Mobile: cart + hamburger — right side */}
        <div className="flex items-center gap-2 lg:hidden">
          <CustomerNotificationWrapper />
          <ModeToggle />
          <CartSheet />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Nav Sheet */}
      <MobileNav open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen} />
    </header>
  );
}
