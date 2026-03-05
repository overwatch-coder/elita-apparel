"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

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
];

export function AdminMobileNav() {
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
            <SheetTitle className="sr-only">Admin Menu</SheetTitle>
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
                  Admin
                </span>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <nav className="space-y-1 px-3 py-4">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
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
                    </SheetClose>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
          <div className="mt-auto border-t border-border p-4 bg-card">
            <form action={() => logoutAction()} className="mt-8">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      <span className="text-sm font-medium">Elita Admin</span>
    </div>
  );
}
