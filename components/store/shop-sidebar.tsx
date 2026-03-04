"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Filter } from "lucide-react";
import type { Category } from "@/lib/types/database";

interface ShopSidebarProps {
  categories: Category[];
}

export function ShopSidebar({ categories }: ShopSidebarProps) {
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
        isCollapsed ? "w-12" : "w-full lg:w-64",
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

        <div>
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Categories
          </h4>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => updateCategory("")}
              className={cn(
                "text-left px-4 py-2.5 rounded-md text-sm transition-all",
                !currentCategory
                  ? "bg-gold text-white font-medium shadow-md"
                  : "text-muted-foreground hover:bg-gold/5 hover:text-gold",
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateCategory(cat.slug)}
                className={cn(
                  "text-left px-4 py-2.5 rounded-md text-sm transition-all",
                  currentCategory === cat.slug
                    ? "bg-gold text-white font-medium shadow-md"
                    : "text-muted-foreground hover:bg-gold/5 hover:text-gold",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border/50">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Availability
          </h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm cursor-pointer group">
              <div className="w-4 h-4 rounded-sm border border-border group-hover:border-gold transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground">
                In Stock
              </span>
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer group">
              <div className="w-4 h-4 rounded-sm border border-border group-hover:border-gold transition-colors" />
              <span className="text-muted-foreground group-hover:text-foreground">
                On Sale
              </span>
            </label>
          </div>
        </div>
      </div>

      {isCollapsed && (
        <div className="flex flex-col items-center gap-6 pt-4">
          <Filter className="h-5 w-5 text-gold" />
        </div>
      )}
    </aside>
  );
}
