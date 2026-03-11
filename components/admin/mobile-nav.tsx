'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  FolderOpen,
  Tags,
  Ruler,
  Package,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  Percent,
  PieChart,
  Megaphone,
  Zap,
  MousePointer2,
  Users,
  Star,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
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
import { ThemeToggle } from "../theme-toggle";
import { NotificationDropdown } from "../notifications/notification-dropdown";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_GROUPS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Catalog",
    icon: FolderOpen,
    items: [
      { label: "Collections", href: "/admin/collections", icon: FolderOpen },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Fabric Types", href: "/admin/fabric-types", icon: Ruler },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Size Guides", href: "/admin/size-guides", icon: Ruler },
    ],
  },
  {
    label: "Sales",
    icon: ShoppingCart,
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      {
        label: "WhatsApp Orders",
        href: "/admin/whatsapp-orders",
        icon: MessageCircle,
      },
      { label: "Inventory", href: "/admin/inventory", icon: BarChart3 },
      { label: "Discounts", href: "/admin/discounts", icon: Percent },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    items: [
      {
        label: "Marketing Stats",
        href: "/admin/marketing/analytics",
        icon: PieChart,
      },
      { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
      { label: "Automations", href: "/admin/automations", icon: Zap },
      { label: "Popups", href: "/admin/marketing/popups", icon: MousePointer2 },
      {
        label: "Instagram Feed",
        href: "/admin/marketing/instagram",
        icon: Megaphone,
      },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    items: [
      { label: "Audience", href: "/admin/audience", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    getUser();
  }, []);

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md px-4 lg:hidden">
      <div className="flex items-center gap-4">
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
            <SheetTitle className="sr-only">Admin Menu</SheetTitle>
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
                  Admin Panel
                </span>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-6">
              {NAV_GROUPS.map((group, idx) => (
                <div key={idx} className="space-y-2">
                  {"href" in group ? (
                    <SheetClose asChild>
                      <Link
                        href={group?.href || ""}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                          pathname === group.href
                            ? "bg-gold text-white shadow-lg shadow-gold/20"
                            : "text-muted-foreground hover:bg-gold/10 hover:text-gold",
                        )}
                      >
                        <group.icon
                          className={cn(
                            "h-4 w-4",
                            pathname === group.href
                              ? "text-white"
                              : "text-gold/80",
                          )}
                        />
                        {group.label}
                      </Link>
                    </SheetClose>
                  ) : (
                    <>
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
                                {item.label}
                              </Link>
                            </SheetClose>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-auto border-t border-border/50 p-6 space-y-4 bg-muted/5">
            <div className="space-y-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:bg-gold/5 hover:text-gold h-10"
              >
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-3"
                >
                  <ShoppingCart className="h-4 w-4 text-gold/80" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    View Store
                  </span>
                </Link>
              </Button>
              <form action={() => logoutAction()} className="w-full">
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
          Admin
        </span>
      </div>
      </div>

      <div className="flex items-center gap-2">
        {userId && <NotificationDropdown isAdminView={true} userId={userId} />}
        <ThemeToggle />
      </div>
    </div>
  );
}
