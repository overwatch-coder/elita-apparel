"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Tags,
  ShoppingCart,
  Percent,
  BarChart3,
  LogOut,
  MessageCircle,
  Star,
  Ruler,
  Users,
  Megaphone,
  Zap,
  MousePointer2,
  PieChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Collections", href: "/admin/collections", icon: FolderOpen },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Fabric Types", href: "/admin/fabric-types", icon: Ruler },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  {
    label: "WhatsApp Orders",
    href: "/admin/whatsapp-orders",
    icon: MessageCircle,
  },
  { label: "Discounts", href: "/admin/discounts", icon: Percent },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Size Guides", href: "/admin/size-guides", icon: Ruler },
  { label: "Inventory", href: "/admin/inventory", icon: BarChart3 },
  { label: "Audience", href: "/admin/audience", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Automations", href: "/admin/automations", icon: Zap },
  { label: "Popups", href: "/admin/marketing/popups", icon: MousePointer2 },
  {
    label: "Marketing Stats",
    href: "/admin/marketing/analytics",
    icon: PieChart,
  },
];

export function AdminSidebar({
  isCollapsed,
  onToggle,
  user,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  user: { name: string; role: string } | null;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative z-40 h-full transition-all duration-300 ease-in-out border-r border-border bg-card hidden lg:flex flex-col group shrink-0",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-sm z-50 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onToggle}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className="flex h-full flex-col">
        {/* Logo */}
        <div
          className={cn(
            "flex h-20 items-center border-b border-border/50 overflow-hidden transition-all",
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
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-wide text-foreground leading-none">
                  Elita
                </span>
                <span className="text-[10px] font-medium text-gold tracking-widest uppercase mt-0.5">
                  Admin
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <nav className="space-y-1 px-3 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gold/10 text-gold shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      isCollapsed && "justify-center px-0",
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-gold" : "text-muted-foreground",
                      )}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 p-4 space-y-4">
          <div
            className={cn(
              "flex items-center gap-2 px-2",
              isCollapsed && "flex-col",
            )}
          >
            <ModeToggle />
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">Appearance</span>
            )}
          </div>

          <Separator className="bg-border/50" />

          {/* User Profile Info */}
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors overflow-hidden cursor-pointer",
              isCollapsed && "justify-center px-0",
            )}
          >
            <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 text-gold" />
            </div>
            {!isCollapsed && user && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            )}
          </div>

          {/* View Store Group */}
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-muted-foreground hover:bg-accent hover:text-foreground",
                isCollapsed && "justify-center px-0",
              )}
            >
              <Link
                href="/"
                target="_blank"
                title={isCollapsed ? "View Store" : undefined}
              >
                {!isCollapsed ? (
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    View Store
                  </span>
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Link>
            </Button>
            <form action={() => logoutAction()}>
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
                <LogOut className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="ml-2">Sign Out</span>}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
