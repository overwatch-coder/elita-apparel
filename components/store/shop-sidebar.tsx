"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Filter } from "lucide-react";
import type { Category } from "@/lib/types/database";

interface ShopSidebarProps {
  categories: Category[];
}

export function ShopSidebar({
  categories,
  className,
}: ShopSidebarProps & { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <aside
      className={cn(
        "shrink-0 transition-all duration-300 relative",
        isCollapsed ? "w-12" : "w-full lg:w-72",
        className,
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-0 z-10 hidden lg:flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-gold shadow-sm hover:bg-gold hover:text-white transition-all duration-300"
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            !isCollapsed && "rotate-180",
          )}
        />
      </button>

      <div className={cn("space-y-8", isCollapsed && "hidden")}>
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-gold" />
          <h3 className="font-serif text-xl text-foreground">Filters</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60">
              Categories
            </h4>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => updateCategory("")}
                className={cn(
                  "text-left px-4 py-2 rounded-md text-sm transition-all duration-200",
                  !currentCategory
                    ? "bg-gold text-white font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-gold",
                )}
              >
                All Pieces
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateCategory(cat.slug)}
                  className={cn(
                    "text-left px-4 py-2 rounded-md text-sm transition-all duration-200",
                    currentCategory === cat.slug
                      ? "bg-gold text-white font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-gold",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 space-y-4">
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/60">
              Status
            </h4>
            <div className="space-y-3">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-4 w-4 border border-border rounded-sm peer-checked:bg-gold peer-checked:border-gold transition-all duration-200" />
                  <ChevronRight className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5" />
                </div>
                <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  In Stock
                </span>
              </label>
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-4 w-4 border border-border rounded-sm peer-checked:bg-gold peer-checked:border-gold transition-all duration-200" />
                  <ChevronRight className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5" />
                </div>
                <span className="ml-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Early Access
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {isCollapsed && (
        <div className="flex flex-col items-center gap-6 pt-4">
          <Filter className="h-5 w-5 text-gold/40" />
        </div>
      )}
    </aside>
  );
}
