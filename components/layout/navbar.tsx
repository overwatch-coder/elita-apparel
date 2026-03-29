"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { ModeToggle } from "./mode-toggle";
import { CustomerNotificationWrapper } from "@/components/notifications/customer-notification-wrapper";

export function Navbar() {
  const pathname = usePathname();
  const isAccountPage = pathname.startsWith("/account");
  const isHomePage = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const useHeroOverlay = isHomePage && !isScrolled;
  const overlayTextClass =
    "text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]";
  const overlayLinkClass =
    "text-white hover:text-gold [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]";

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
        useHeroOverlay
          ? "bg-royal-black/45 backdrop-blur-md border-b border-cream/15 shadow-[0_12px_40px_rgba(23,19,17,0.35)]"
          : isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent backdrop-blur-[2px] border-b border-cream/20",
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
          <span
            className={cn(
              "font-serif text-base sm:text-lg tracking-wide transition-colors duration-300",
              useHeroOverlay ? overlayTextClass : "text-foreground",
            )}
          >
            Elita Apparel
          </span>
        </Link>

        {/* Desktop nav links + cart — right side */}
        <div
          className={cn(
            "hidden lg:flex items-center gap-6 transition-colors duration-300",
            useHeroOverlay ? overlayTextClass : "text-foreground",
          )}
        >
          {NAV_LINKS.map((link) => {
            if (link.children) {
              return (
                <NavDropdown
                  key={link.label}
                  link={link}
                  pathname={pathname}
                  useHeroOverlay={useHeroOverlay}
                />
              );
            }
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-widest uppercase transition-colors duration-300",
                  isActive
                    ? "text-gold"
                    : useHeroOverlay
                      ? overlayLinkClass
                      : "text-foreground/80 hover:text-gold",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div
            className={cn(
              "w-px h-5 mx-1 transition-colors duration-300",
              useHeroOverlay ? "bg-cream/20" : "bg-border/60",
            )}
          />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <CustomerNotificationWrapper />
            <CartSheet />
          </div>
        </div>

        {/* Mobile: cart + hamburger — right side */}
        <div
          className={cn(
            "flex items-center gap-2 lg:hidden transition-colors duration-300",
            useHeroOverlay ? overlayTextClass : "text-foreground",
          )}
        >
          <CustomerNotificationWrapper />
          <ModeToggle />
          <CartSheet />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open menu"
            className={cn(useHeroOverlay && "hover:bg-cream/10")}
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

/* ── Desktop dropdown for nav items with children ────────────────── */

function NavDropdown({
  link,
  pathname,
  useHeroOverlay,
}: {
  link: NavLink;
  pathname: string;
  useHeroOverlay: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isActive = link.children?.some((child) => pathname === child.href);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium tracking-widest uppercase transition-colors duration-300",
          isActive
            ? "text-gold"
            : useHeroOverlay
              ? "text-white hover:text-gold [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
              : "text-foreground/80 hover:text-gold",
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {link.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
          <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg py-2 min-w-40">
            {link.children!.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-5 py-2.5 text-sm tracking-wide transition-colors duration-200",
                  pathname === child.href
                    ? "text-gold"
                    : "text-foreground/70 hover:text-gold hover:bg-gold/5",
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
