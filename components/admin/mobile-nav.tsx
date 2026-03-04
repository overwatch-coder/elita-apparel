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
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Collections", href: "/admin/collections", icon: FolderOpen },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Discounts", href: "/admin/discounts", icon: Percent },
  { label: "Inventory", href: "/admin/inventory", icon: BarChart3 },
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
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="sr-only">Admin Menu</SheetTitle>
            <Image
              src="/logo.png"
              alt="Elita Apparel"
              width={100}
              height={40}
              className="h-8 w-auto object-contain invert dark:invert-0"
            />
          </SheetHeader>
          <nav className="space-y-1 p-3">
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
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
            <form action={logoutAction}>
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
