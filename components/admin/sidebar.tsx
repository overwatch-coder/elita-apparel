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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Collections", href: "/admin/collections", icon: FolderOpen },
  { label: "Categories", href: "/admin/categories", icon: Tags },
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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card hidden lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Elita Apparel"
              width={100}
              height={40}
              className="h-8 w-auto object-contain invert dark:invert-0"
            />
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase ml-1">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
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
                      ? "bg-gold/10 text-gold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
          >
            <Link href="/" target="_blank">
              View Store →
            </Link>
          </Button>
          <form action={() => logoutAction()}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
