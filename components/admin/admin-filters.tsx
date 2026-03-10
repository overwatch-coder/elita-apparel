"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  Calendar as CalendarIcon,
  Filter,
  ArrowDownWideNarrow,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { ORDER_STATUSES } from "@/lib/constants";

interface AdminFiltersProps {
  statuses?: { value: string; label: string }[];
  categories?: { value: string; label: string }[];
  placeholder?: string;
  showAmountRange?: boolean;
}

export function AdminFilters({
  statuses = Array.from(ORDER_STATUSES),
  categories = [],
  placeholder = "Search...",
  showAmountRange = true,
}: AdminFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(search, 500);

  // Status
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  // Category
  const [category, setCategory] = useState(searchParams.get("cat") || "all");

  // Dates
  const [startDate, setStartDate] = useState(searchParams.get("start") || "");
  const [endDate, setEndDate] = useState(searchParams.get("end") || "");

  // Amount
  const [minAmount, setMinAmount] = useState(searchParams.get("min") || "");
  const [maxAmount, setMaxAmount] = useState(searchParams.get("max") || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanged = false;

    const syncParam = (
      key: string,
      value: string,
      defaultValue: string = "all",
    ) => {
      const currentValue = searchParams.get(key) || defaultValue;
      if (value !== currentValue) {
        if (value && value !== defaultValue) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        hasChanged = true;
      }
    };

    syncParam("q", debouncedSearch, "");
    syncParam("status", status, "all");
    syncParam("cat", category, "all");
    syncParam("start", startDate, "");
    syncParam("end", endDate, "");
    syncParam("min", minAmount, "");
    syncParam("max", maxAmount, "");

    if (hasChanged) {
      params.set("page", "1");
      const query = params.toString();
      const currentPath = window.location.pathname;
      router.push(query ? `${currentPath}?${query}` : currentPath);
    }
  }, [
    debouncedSearch,
    status,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    router,
    searchParams,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    router.push(window.location.pathname);
  };

  const hasActiveFilters =
    !!search ||
    (status && status !== "all") ||
    (category && category !== "all") ||
    !!startDate ||
    !!endDate ||
    !!minAmount ||
    !!maxAmount;

  return (
    <div className="space-y-4 bg-card p-4 rounded-xl border border-border/50 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9 h-10 border-border/50 focus-visible:ring-gold/30"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-[160px]">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 border-border/50 focus:ring-gold/30 w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="w-full md:w-[160px]">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 border-border/50 focus:ring-gold/30 w-full">
                <div className="flex items-center gap-2">
                  <ArrowDownWideNarrow className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear Button (Mobile) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="md:hidden text-muted-foreground hover:text-destructive transition-colors shrink-0"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
        {/* Date range */}
        <div className="flex flex-1 items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Start Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 pl-9 border-border/50 focus-visible:ring-gold/30 text-xs"
              />
            </div>
          </div>
          <div className="hidden md:block mb-3 text-muted-foreground">-</div>
          <div className="flex-1 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              End Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 pl-9 border-border/50 focus-visible:ring-gold/30 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Amount range */}
        {showAmountRange && (
          <div className="flex flex-1 items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  GH₵
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="h-10 pl-11 border-border/50 focus-visible:ring-gold/30 text-xs"
                />
              </div>
            </div>
            <div className="hidden md:block mb-3 text-muted-foreground">-</div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  GH₵
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="h-10 pl-11 border-border/50 focus-visible:ring-gold/30 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Clear Button (Desktop) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="hidden md:flex text-muted-foreground hover:text-destructive transition-colors h-10 px-4"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
