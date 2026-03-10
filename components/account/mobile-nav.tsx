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
  ShoppingCart,
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

const menuGroups = [
  {
    label: "Main Menu",
    items: [
      { title: "Overview", href: "/account", icon: LayoutDashboard },
      { title: "Order History", href: "/account/orders", icon: ShoppingBag },
    ],
  },
  {
    label: "Account Settings",
    items: [
      { title: "Addresses", href: "/account/addresses", icon: MapPin },
      { title: "Wishlist", href: "/account/wishlist", icon: Heart },
      { title: "Profile & Security", href: "/account/profile", icon: User },
    ],
  },
];

export function AccountMobileNav({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] p-0 flex flex-col h-full border-r border-border/50"
        >
          <SheetHeader className="p-6 border-b border-border/50 text-left">
            <SheetTitle className="sr-only">Account Menu</SheetTitle>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Elita Apparel"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
              />
              <div className="flex flex-col text-left">
                <span className="font-serif text-xl tracking-wide text-foreground leading-none">
                  Elita
                </span>
                <span className="text-[10px] font-bold text-gold tracking-widest uppercase mt-1">
                  Customer Account
                </span>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-6">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors mb-4"
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  <span>Back to Store</span>
                </Link>
              </SheetClose>

              {menuGroups.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                    {group.label}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                              isActive
                                ? "bg-gold text-white shadow-lg shadow-gold/20"
                                : "text-muted-foreground hover:bg-gold/10 hover:text-gold",
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4",
                                isActive
                                  ? "text-white"
                                  : "text-gold/80 group-hover:text-gold",
                              )}
                            />
                            {item.title}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-border/50 p-6 space-y-4 bg-muted/5">
            <div className="flex items-center gap-3 px-2">
              <ModeToggle />
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Appearance
              </span>
            </div>

            <Separator className="bg-border/30" />

            {/* User Profile Info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gold/5 border border-gold/10 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                <Users className="h-5 w-5 text-gold" />
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

            <div className="space-y-1">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:bg-gold/5 hover:text-gold h-10"
              >
                <Link href="/" className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-gold/80" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    View Store
                  </span>
                </Link>
              </Button>
              <form action={() => logoutAction("/login")} className="w-full">
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10"
                >
                  <LogOut className="h-4 w-4 text-ghana-red" />
                  <span className="ml-3 text-[10px] uppercase tracking-widest font-bold text-ghana-red">
                    Sign Out
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col">
        <span className="font-serif text-base tracking-wide text-foreground leading-none">
          Elita
        </span>
        <span className="text-[8px] font-bold text-gold tracking-widest uppercase">
          My Account
        </span>
      </div>
    </div>
  );
}
