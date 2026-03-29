"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/database";

interface ShopSidebarProps {
  categories: Category[];
  className?: string;
  onCategorySelect?: () => void;
}

export function ShopSidebar({
  categories,
  className,
  onCategorySelect,
}: ShopSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const updateCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
    onCategorySelect?.();
  };

  return (
    <aside className={cn("w-full", className)}>
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
                ? "bg-gold/10 text-gold font-medium border border-gold/20"
                : "text-muted-foreground border border-transparent hover:bg-accent/30 hover:text-foreground",
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
                  ? "bg-gold/10 text-gold font-medium border border-gold/20"
                  : "text-muted-foreground border border-transparent hover:bg-accent/30 hover:text-foreground",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
