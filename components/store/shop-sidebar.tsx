"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/database";

interface ShopSidebarProps {
  categories: Category[];
}

export function ShopSidebar({ categories }: ShopSidebarProps) {
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
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-8">
      <div>
        <h3 className="font-serif text-xl mb-4 text-foreground">Categories</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => updateCategory("")}
            className={cn(
              "text-left px-4 py-2 rounded-md text-sm transition-colors",
              !currentCategory
                ? "bg-gold/10 text-gold font-medium"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateCategory(cat.slug)}
              className={cn(
                "text-left px-4 py-2 rounded-md text-sm transition-colors",
                currentCategory === cat.slug
                  ? "bg-gold/10 text-gold font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Space for future filters like Price Ranges, Colors, Sizes */}
    </aside>
  );
}
