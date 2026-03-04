"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, MapPin, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";

const navItems = [
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
    title: "Profile Settings",
    href: "/account/profile",
    icon: User,
  },
];

export function AccountSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1 w-full md:w-64 shrink-0", className)}>
      <div className="hidden md:block mb-8 px-4">
        <h2 className="text-xl font-serif text-cream">My Account</h2>
      </div>

      <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar px-4 md:px-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-gold text-white shadow-sm"
                  : "text-cream/70 hover:bg-white/5 hover:text-cream",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 px-4 border-t border-cream/10 pt-4 hidden md:block">
        <form action={() => logoutAction("/login")}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  );
}
