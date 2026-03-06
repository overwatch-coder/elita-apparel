"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  User,
  ChevronLeft,
  Users,
} from "lucide-react";
import { ModeToggle } from "../layout/mode-toggle";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const NAV_ITEMS = [
  { label: "Back to Store", href: "/", icon: ChevronLeft },
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Order History", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Profile Settings", href: "/account/profile", icon: User },
];

export function AccountMobileNav({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-card px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col h-full">
          <SheetHeader className="p-4 border-b border-border/50 text-left">
            <SheetTitle className="sr-only">Account Menu</SheetTitle>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Elita Apparel"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <div className="flex flex-col text-left">
                <span className="font-serif text-lg tracking-wide text-foreground leading-none">
                  Elita
                </span>
                <span className="text-[10px] font-medium text-gold tracking-widest uppercase mt-0.5">
                  Account
                </span>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <nav className="space-y-1 px-3 py-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-gold/10 text-gold shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
          <div className="mt-auto border-t border-border p-4 bg-muted/5 space-y-4">
            <div className="flex items-center gap-2 px-2">
              <ModeToggle />
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Appearance
              </span>
            </div>

            <Separator className="bg-border/30" />

            {/* User Profile Info */}
            <div className="flex items-center gap-3 p-2 rounded-md bg-gold/5 border border-gold/10 transition-colors overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                <Users className="h-4 w-4 text-gold" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  {user.role}
                </span>
              </div>
            </div>

            <form action={() => logoutAction("/login")} className="w-full">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 shrink-0 text-ghana-red" />
                <span className="ml-2 text-[10px] uppercase tracking-widest font-bold text-ghana-red">
                  Sign Out
                </span>
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      <span className="text-sm font-medium">My Account</span>
    </div>
  );
}
