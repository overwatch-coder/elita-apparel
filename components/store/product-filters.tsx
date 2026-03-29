"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { CURRENCY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types/database";
import { ShopSidebar } from "./shop-sidebar";

interface ProductFiltersProps {
  categories: Category[];
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
] as const;

const viewOptions = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
] as const;

const priceOptions = [
  { value: "all", label: "All Prices" },
  { value: "under-250", label: `Under ${CURRENCY.symbol}250` },
  { value: "250-499", label: `${CURRENCY.symbol}250 - ${CURRENCY.symbol}499` },
  { value: "500-749", label: `${CURRENCY.symbol}500 - ${CURRENCY.symbol}749` },
  { value: "750-plus", label: `${CURRENCY.symbol}750+` },
] as const;

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentPrice = searchParams.get("price") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("q") || "";
  const currentView = searchParams.get("view") || "grid";

  const [searchValue, setSearchValue] = useState(currentSearch);

  // Debounced search
  useEffect(() => {
    // If searchValue cleared, update URL immediately instead of waiting for debounce
    if (searchValue === "" && currentSearch !== "") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page");
      router.push(`/shop?${params.toString()}`);
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue === currentSearch) return;

      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
      }
      params.delete("page");

      router.push(`/shop?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, router, searchParams, currentSearch]);

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

  const hasActiveFilters = Boolean(
    currentCategory || currentSearch || currentPrice !== "all" || currentSort !== "newest",
  );
  const activeRefinementCount = [
    Boolean(currentCategory),
    Boolean(currentSearch),
    currentPrice !== "all",
    currentSort !== "newest",
  ].filter(Boolean).length;
  const currentCategoryLabel =
    categories.find((category) => category.slug === currentCategory)?.name ||
    "All Pieces";
  const currentPriceLabel =
    priceOptions.find((option) => option.value === currentPrice)?.label ||
    "All Prices";
  const currentSortLabel =
    sortOptions.find((option) => option.value === currentSort)?.label ||
    "Newest First";
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Sleek Command bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-border/80 bg-background/95 pb-4 pt-1 mb-8 sticky top-18.25 z-30 backdrop-blur-md">
        {/* Search input */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Search the collection..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 h-11 bg-transparent border-0 ring-0 shadow-none focus-visible:ring-0 md:text-base font-serif italic text-foreground tracking-wide"
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
          <div className="flex items-center rounded-full border border-border/50 bg-muted/40 p-1 shrink-0">
            {viewOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter("view", option.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors sm:px-3.5",
                  currentView === option.value
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title={option.label}
              >
                {option.value === "grid" ? (
                  <LayoutGrid className="size-4" />
                ) : (
                  <List className="size-4" />
                )}
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 shrink-0 rounded-full border-border/60 px-4 transition-colors",
                    currentSort !== "newest"
                      ? "border-gold/40 bg-gold/5 text-gold hover:bg-gold/10"
                      : "hover:border-gold/40 hover:text-gold",
                  )}
                >
                  Sort
                  <span className="max-w-32 truncate text-muted-foreground">{currentSortLabel}</span>
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl"
              >
                <DropdownMenuLabel className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                  Sorting
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={currentSort}
                  onValueChange={(value) => updateFilter("sort", value)}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className="rounded-lg py-2 pr-3 data-[state=checked]:bg-gold/10 data-[state=checked]:text-gold"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 shrink-0 rounded-full border-border/60 px-4 transition-colors",
                    currentPrice !== "all"
                      ? "border-gold/40 bg-gold/5 text-gold hover:bg-gold/10"
                      : "hover:border-gold/40 hover:text-gold",
                  )}
                >
                  Price
                  <span className="max-w-32 truncate text-muted-foreground">{currentPriceLabel}</span>
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl"
              >
                <DropdownMenuLabel className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                  Pricing
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={currentPrice}
                  onValueChange={(value) =>
                    updateFilter("price", value === "all" ? "" : value)
                  }
                >
                  {priceOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className="rounded-lg py-2 pr-3 data-[state=checked]:bg-gold/10 data-[state=checked]:text-gold"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 shrink-0 rounded-full border-border/60 px-4 transition-colors",
                    currentCategory
                      ? "border-gold/40 bg-gold/5 text-gold hover:bg-gold/10"
                      : "hover:border-gold/40 hover:text-gold",
                  )}
                >
                  Category
                  <span className="max-w-32 truncate text-muted-foreground">{currentCategoryLabel}</span>
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl"
              >
                <DropdownMenuLabel className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                  Categories
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={currentCategory || "all"}
                  onValueChange={(value) =>
                    updateFilter("category", value === "all" ? "" : value)
                  }
                >
                  <DropdownMenuRadioItem
                    value="all"
                    className="rounded-lg py-2 pr-3 data-[state=checked]:bg-gold/10 data-[state=checked]:text-gold"
                  >
                    All Pieces
                  </DropdownMenuRadioItem>
                  {categories.map((category) => (
                    <DropdownMenuRadioItem
                      key={category.id}
                      value={category.slug}
                      className="rounded-lg py-2 pr-3 data-[state=checked]:bg-gold/10 data-[state=checked]:text-gold"
                    >
                      {category.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 shrink-0 rounded-full border-border/60 px-4 transition-colors md:hidden",
                  hasActiveFilters
                    ? "border-gold/40 text-gold bg-gold/5 hover:bg-gold/10"
                    : "hover:border-gold/40 hover:text-gold",
                )}
              >
                <SlidersHorizontal data-icon="inline-start" />
                Filters
                {activeRefinementCount > 0 && (
                  <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-medium tracking-[0.12em] text-white">
                    {activeRefinementCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full overflow-y-auto p-5 sm:max-w-sm">
              <SheetHeader className="mb-6">
                <SheetTitle className="font-serif text-xl">Filters</SheetTitle>
              </SheetHeader>
              <div className="mb-6 rounded-2xl border border-border/60 bg-muted/20 p-3">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Sort by
                </p>
                <div className="flex flex-col gap-1">
                  {sortOptions.map((option) => (
                    <SheetClose asChild key={option.value}>
                      <button
                        onClick={() => updateFilter("sort", option.value)}
                        className={cn(
                          "text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                          currentSort === option.value
                            ? "bg-gold/10 text-gold font-medium"
                            : "text-foreground/80 hover:bg-muted/60",
                        )}
                      >
                        {option.label}
                      </button>
                    </SheetClose>
                  ))}
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-border/60 bg-muted/20 p-3">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Pricing
                </p>
                <div className="flex flex-col gap-1">
                  {priceOptions.map((option) => (
                    <SheetClose asChild key={option.value}>
                      <button
                        onClick={() =>
                          updateFilter(
                            "price",
                            option.value === "all" ? "" : option.value,
                          )
                        }
                        className={cn(
                          "text-left rounded-lg px-3 py-2.5 text-sm transition-colors",
                          currentPrice === option.value
                            ? "bg-gold/10 text-gold font-medium"
                            : "text-foreground/80 hover:bg-muted/60",
                        )}
                      >
                        {option.label}
                      </button>
                    </SheetClose>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 pb-10">
                <ShopSidebar
                  categories={categories}
                  onCategorySelect={() => setSheetOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
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
          {currentPrice !== "all" && (
            <Badge
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive/10"
              onClick={() => updateFilter("price", "")}
            >
              {currentPriceLabel}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {currentSort !== "newest" && (
            <Badge
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive/10"
              onClick={() => updateFilter("sort", "")}
            >
              {currentSortLabel}
              <X className="ml-1 h-3 w-3" />
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
