"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      params.delete("page"); // Reset page on search
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
      params.delete("page"); // Reset page on filter change
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
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

        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="sm:hidden h-11 border-border/50"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
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
                  Category
                </h4>
                <div className="flex flex-col gap-1">
                  <SheetClose asChild>
                    <Button
                      variant={!currentCategory ? "secondary" : "ghost"}
                      className="justify-start h-10"
                      onClick={() => updateFilter("category", "")}
                    >
                      All Categories
                    </Button>
                  </SheetClose>
                  {categories.map((cat) => (
                    <SheetClose asChild key={cat.id}>
                      <Button
                        variant={
                          currentCategory === cat.slug ? "secondary" : "ghost"
                        }
                        className="justify-start h-10"
                        onClick={() => updateFilter("category", cat.slug)}
                      >
                        {cat.name}
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop category pills */}
      <div className="hidden sm:flex items-center gap-2 flex-wrap">
        <Button
          variant={!currentCategory ? "default" : "outline"}
          size="sm"
          className={
            !currentCategory
              ? "bg-gold hover:bg-gold-dark text-white h-8"
              : "h-8 border-border/50 hover:border-gold hover:text-gold"
          }
          onClick={() => updateFilter("category", "")}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={currentCategory === cat.slug ? "default" : "outline"}
            size="sm"
            className={
              currentCategory === cat.slug
                ? "bg-gold hover:bg-gold-dark text-white h-8"
                : "h-8 border-border/50 hover:border-gold hover:text-gold"
            }
            onClick={() => updateFilter("category", cat.slug)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Active filters display */}
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
