import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "@/components/store/product-filters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse our premium African fashion collection. Authentic prints, expert tailoring, and cultural craftsmanship from Accra, Ghana.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    price?: string;
    sort?: string;
    q?: string;
    page?: string;
    view?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Build product query
  let query = supabase
    .from("products")
    .select("*, product_images(*)", { count: "exact" })
    .eq("is_published", true);

  // Apply category filter
  if (params.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  // Apply collection filter
  if (params.collection) {
    const { data: col } = await supabase
      .from("collections")
      .select("id")
      .eq("slug", params.collection)
      .single();
    if (col) {
      query = query.eq("collection_id", col.id);
    }
  }

  // Apply price filter
  switch (params.price) {
    case "under-250":
      query = query.lt("price", 250);
      break;
    case "250-499":
      query = query.gte("price", 250).lt("price", 500);
      break;
    case "500-749":
      query = query.gte("price", 500).lt("price", 750);
      break;
    case "750-plus":
      query = query.gte("price", 750);
      break;
    default:
      break;
  }

  // Apply search
  if (params.q) {
    query = query.or(
      `name.ilike.%${params.q}%,description.ilike.%${params.q}%,cultural_story.ilike.%${params.q}%,fabric_type.ilike.%${params.q}%`,
    );
  }

  // Apply sorting
  switch (params.sort) {
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const page = Number(params.page) || 1;
  const perPage = 12;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  query = query.range(from, to);

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  const view = params.view || "grid";

  return (
    <>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Compact shop header — product-first */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
                Shop All Products
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {count || 0} {count === 1 ? "piece" : "pieces"} available
              </p>
            </div>

          </div>

          {/* Full-width product area */}
          <div>
              {/* Filters */}
              <Suspense fallback={null}>
                <ProductFilters categories={categories || []} />
              </Suspense>

              {/* Product grid / list */}
              {products && products.length > 0 ? (
                <div
                  className={cn(
                    "mt-8",
                    view === "list"
                      ? "flex flex-col gap-6"
                      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8",
                  )}
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={
                        view === "list" ? "max-w-3xl mx-auto w-full" : ""
                      }
                    >
                      <ProductCard
                        product={product}
                        view={view as "grid" | "list"}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 mt-8">
                  <p className="font-serif text-xl text-muted-foreground mb-2">
                    No products found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or search query.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={
                            page > 1
                              ? `/shop?${(() => {
                                  const p = new URLSearchParams();
                                  if (params.category)
                                    p.set("category", params.category);
                                  if (params.collection)
                                    p.set("collection", params.collection);
                                  if (params.price)
                                    p.set("price", params.price);
                                  if (params.sort) p.set("sort", params.sort);
                                  if (params.q) p.set("q", params.q);
                                  if (params.view && params.view !== "grid")
                                    p.set("view", params.view);
                                  if (page - 1 > 1)
                                    p.set("page", String(page - 1));
                                  return p.toString();
                                })()}`
                              : "#"
                          }
                          className={
                            page <= 1 ? "pointer-events-none opacity-50" : ""
                          }
                        />
                      </PaginationItem>

                      {/* Pagination logic with ellipsis */}
                      {(() => {
                        const items = [];
                        const maxVisible = 5;

                        if (totalPages <= maxVisible) {
                          for (let i = 1; i <= totalPages; i++) items.push(i);
                        } else {
                          // Always show first and last
                          // show 1, ..., page-1, page, page+1, ..., totalPages
                          if (page <= 3) {
                            items.push(1, 2, 3, 4, "ellipsis", totalPages);
                          } else if (page >= totalPages - 2) {
                            items.push(
                              1,
                              "ellipsis",
                              totalPages - 3,
                              totalPages - 2,
                              totalPages - 1,
                              totalPages,
                            );
                          } else {
                            items.push(
                              1,
                              "ellipsis",
                              page - 1,
                              page,
                              page + 1,
                              "ellipsis",
                              totalPages,
                            );
                          }
                        }

                        return items.map((item, idx) => {
                          if (item === "ellipsis") {
                            return (
                              <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          const pageNum = item as number;
                          const p = new URLSearchParams();
                          if (params.category)
                            p.set("category", params.category);
                          if (params.collection)
                            p.set("collection", params.collection);
                          if (params.price) p.set("price", params.price);
                          if (params.sort) p.set("sort", params.sort);
                          if (params.q) p.set("q", params.q);
                          if (params.view && params.view !== "grid")
                            p.set("view", params.view);
                          if (pageNum > 1) p.set("page", String(pageNum));

                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href={`/shop?${p.toString()}`}
                                isActive={pageNum === page}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        });
                      })()}

                      <PaginationItem>
                        <PaginationNext
                          href={
                            page < totalPages
                              ? `/shop?${(() => {
                                  const p = new URLSearchParams();
                                  if (params.category)
                                    p.set("category", params.category);
                                  if (params.collection)
                                    p.set("collection", params.collection);
                                  if (params.price)
                                    p.set("price", params.price);
                                  if (params.sort) p.set("sort", params.sort);
                                  if (params.q) p.set("q", params.q);
                                  if (params.view && params.view !== "grid")
                                    p.set("view", params.view);
                                  p.set("page", String(page + 1));
                                  return p.toString();
                                })()}`
                              : "#"
                          }
                          className={
                            page >= totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
