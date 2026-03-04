"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/lib/types/database";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("q") || "";
  const currentView = searchParams.get("view") || "grid";

  const [searchValue, setSearchValue] = useState(currentSearch);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
      }
      params.delete("page");
      // preserve view when searching
      if (currentView !== "grid") {
        params.set("view", currentView);
      }
      router.push(`/shop?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "view") {
        params.delete("page");
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearAll = useCallback(() => {
    setSearchValue("");
    router.push("/shop");
  }, [router]);

  const hasActiveFilters = currentCategory || currentSearch;

  return (
    <div className="space-y-4">
      {/* Search and controls bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-border/50 bg-card p-3 rounded-xl shadow-sm">
        {/* Search input */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 h-11 bg-background border-border/50 focus-visible:ring-gold/50"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchValue("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          {/* Sort select */}
          <Select
            value={currentSort}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-11 border-border/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden sm:flex items-center bg-muted/50 rounded-lg p-1 border border-border/50 shrink-0">
            <button
              onClick={() => updateFilter("view", "grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                currentView === "grid"
                  ? "bg-background shadow-xs text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateFilter("view", "list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                currentView === "list"
                  ? "bg-background shadow-xs text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="h-11 border-border/50 shrink-0 px-4"
              >
                <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Categories</span>
                {hasActiveFilters && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-gold text-white text-[10px] flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-serif text-xl">Filters</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3 tracking-wider uppercase text-muted-foreground">
                    Filters coming soon
                  </h4>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground">
                      Additional filters will appear here.
                    </p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>
          {currentSearch && (
            <Badge
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive/10"
              onClick={() => setSearchValue("")}
            >
              Search: &quot;{currentSearch}&quot;
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {currentCategory && (
            <Badge
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive/10"
              onClick={() => updateFilter("category", "")}
            >
              {categories.find((c) => c.slug === currentCategory)?.name}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-6 text-muted-foreground hover:text-destructive"
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
