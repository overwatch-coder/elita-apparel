"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    title: "Back to Store",
    href: "/",
    icon: ChevronLeft,
  },
  {
    title: "Overview",
    href: "/account",
    icon: User,
  },
  {
    title: "Order History",
    href: "/account/orders",
    icon: ShoppingBag,
  },
  {
    title: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    title: "Profile Settings",
    href: "/account/profile",
    icon: User,
  },
];

export function AccountSidebar({
  className,
  user,
}: {
  className?: string;
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex-col h-screen transition-all duration-300 ease-in-out border-r border-border bg-card hidden md:flex group shrink-0",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm z-50 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Header / Brand */}
      <div
        className={cn(
          "flex h-20 items-center overflow-hidden transition-all border-b border-border/50",
          isCollapsed ? "px-2 justify-center" : "px-6",
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Elita Apparel"
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
          {!isCollapsed && (
            <span className="font-serif text-lg tracking-wide text-foreground truncate">
              Elita
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 min-h-0 py-6">
        <ScrollArea className="h-full px-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gold text-white shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    isCollapsed && "justify-center px-0",
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-white" : "text-gold",
                    )}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User / Footer Section */}
        <div className="p-4 mt-auto border-t border-border/50 space-y-4">
          <div
            className={cn("flex items-center gap-2", isCollapsed && "flex-col")}
          >
            <ModeToggle />
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">Appearance</span>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* User Profile Info */}
          <Link
            href="/account/profile"
            className={cn(
              "flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors overflow-hidden",
              isCollapsed && "justify-center px-0",
            )}
          >
            <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-gold" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            )}
          </Link>

          <form action={() => logoutAction("/login")}>
            <button
              type="submit"
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
                isCollapsed && "justify-center px-0",
              )}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
