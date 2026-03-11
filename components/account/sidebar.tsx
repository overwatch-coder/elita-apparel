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
  LayoutDashboard,
  Users,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const menuGroups = [
  {
    label: "Main Menu",
    items: [
      {
        title: "Overview",
        href: "/account",
        icon: LayoutDashboard,
      },
      {
        title: "Order History",
        href: "/account/orders",
        icon: ShoppingBag,
      },
      {
        title: "Notifications",
        href: "/account/notifications",
        icon: Bell,
      },
    ],
  },
  {
    label: "Account Settings",
    items: [
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
        title: "Profile & Security",
        href: "/account/profile",
        icon: User,
      },
    ],
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
          "flex h-20 items-center overflow-hidden transition-all border-b border-border/50 shrink-0",
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
              Elita Apparel
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Area - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-6 py-6 px-3">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors mb-4",
                isCollapsed && "justify-center px-0",
              )}
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Back to Store</span>}
            </Link>

            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                {!isCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                    {group.label}
                  </p>
                )}
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/account" &&
                        pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all group",
                          isActive
                            ? "bg-gold text-white shadow-md shadow-gold/20"
                            : "text-muted-foreground hover:bg-gold/10 hover:text-gold",
                          isCollapsed && "justify-center px-0",
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-white"
                              : "text-gold/80 group-hover:text-gold transition-colors",
                          )}
                        />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="border-t border-border/50 p-4 space-y-4 bg-muted/5 shrink-0">
        {/* User Profile Info */}
        <Link
          href="/account/profile"
          className={cn(
            "flex items-center gap-3 p-2 rounded-md hover:bg-gold/5 transition-colors overflow-hidden border border-transparent hover:border-gold/20",
            isCollapsed && "justify-center px-0",
          )}
        >
          <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
            <Users className="h-4 w-4 text-gold" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                {user.role}
              </span>
            </div>
          )}
        </Link>

        {/* View Store & Logout Group */}
        <div className="space-y-1">
          <form action={() => logoutAction("/login")} className="w-full">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                isCollapsed && "justify-center px-0",
              )}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0 text-ghana-red" />
              {!isCollapsed && (
                <span className="ml-2 text-[10px] uppercase tracking-widest font-bold text-ghana-red">
                  Sign Out
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
