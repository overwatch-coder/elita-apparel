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
  ChevronDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  label: string;
  href: string;
  icon: any;
};

type NavGroup = {
  label: string;
  icon: any;
  items: NavItem[];
};

const NAV_GROUPS: (NavGroup | NavItem)[] = [
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
              {NAV_GROUPS.map((item, index) => {
                if ("href" in item) {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
                }

                // It's a group
                const isGroupActive = item.items.some(
                  (subItem) =>
                    pathname === subItem.href ||
                    pathname.startsWith(subItem.href),
                );

                return (
                  <NavSection
                    key={index}
                    item={item}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    isGroupActive={isGroupActive}
                  />
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

function NavSection({
  item,
  pathname,
  isCollapsed,
  isGroupActive,
}: {
  item: NavGroup;
  pathname: string;
  isCollapsed: boolean;
  isGroupActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isGroupActive);

  if (isCollapsed) {
    return (
      <Collapsible open={false}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
              isGroupActive
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            title={item.label}
          >
            <item.icon className="h-4 w-4 shrink-0" />
          </div>
        </CollapsibleTrigger>
      </Collapsible>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground",
            isGroupActive ? "text-gold" : "text-muted-foreground",
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-0" : "-rotate-90",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {item.items.map((subItem) => {
          const isSubActive = pathname === subItem.href;

          return (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={cn(
                "flex items-center gap-3 rounded-md pl-10 pr-3 py-1.5 text-sm transition-colors",
                isSubActive
                  ? "text-gold font-medium"
                  : "text-muted-foreground/70 hover:text-foreground hover:bg-accent/50",
              )}
            >
              <subItem.icon className="h-3.5 w-3.5 shrink-0 opacity-50" />
              <span className="truncate">{subItem.label}</span>
            </Link>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}
