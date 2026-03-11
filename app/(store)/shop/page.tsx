import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "@/components/store/product-filters";
import { ShopSidebar } from "@/components/store/shop-sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
          {/* Page header */}
          <div className="text-center mb-12">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">
              Premium African Fashion
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-3">
              Shop
            </h1>
            <div className="w-12 h-px bg-gold mx-auto" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar (Desktop only) */}
            <div className="hidden lg:block">
              <Suspense fallback={null}>
                <ShopSidebar categories={categories || []} />
              </Suspense>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Filters */}
              <Suspense fallback={null}>
                <ProductFilters categories={categories || []} />
              </Suspense>

              {/* Results count */}
              <p className="text-sm text-muted-foreground mt-6 mb-8">
                {count || 0} {count === 1 ? "product" : "products"} found
              </p>

              {/* Product grid / list */}
              {products && products.length > 0 ? (
                <div
                  className={
                    view === "list"
                      ? "flex flex-col gap-6"
                      : "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                  }
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={
                        view === "list" ? "max-w-3xl mx-auto w-full" : ""
                      }
                    >
                      {/* Assuming ProductCard handles layout switching or we just restrict its width */}
                      <ProductCard
                        product={product}
                        view={view as "grid" | "list"}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
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
      </div>
    </>
  );
}
