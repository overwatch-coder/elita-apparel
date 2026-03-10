import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import type { Metadata } from "next";
import { ProductActions } from "@/components/admin/product-actions";
import { DataPagination } from "@/components/admin/data-pagination";
import { AdminFilters } from "@/components/admin/admin-filters";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Products | Admin" };

const PRODUCT_STATUSES = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    q?: string;
    cat?: string;
    status?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const {
    page = "1",
    pageSize = "10",
    q = "",
    cat = "all",
    status = "all",
  } = await searchParams;

  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();

  // Fetch categories for the filter
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  const filterCategories = (categoriesData || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Build query
  let query = supabase
    .from("products")
    .select("*, category:categories(name), collection:collections(name)", {
      count: "exact",
    });

  // Search Filter
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  // Category Filter
  if (cat && cat !== "all") {
    query = query.eq("category_id", cat);
  }

  // Status Filter
  if (status && status !== "all") {
    query = query.eq("is_published", status === "published");
  }

  const { data: products, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button
          asChild
          className="bg-gold hover:bg-gold-dark text-white shadow-sm"
        >
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <AdminFilters
        statuses={PRODUCT_STATUSES}
        categories={filterCategories}
        placeholder="Search product name..."
        showAmountRange={false}
      />

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-bold py-4">Product</TableHead>
              <TableHead className="font-bold py-4">Category</TableHead>
              <TableHead className="font-bold py-4">Price</TableHead>
              <TableHead className="font-bold py-4">Stock</TableHead>
              <TableHead className="font-bold py-4">Status</TableHead>
              <TableHead className="text-right font-bold py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {product.fabric_type || "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {product.category?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gold">
                        {formatPrice(product.price)}
                      </span>
                      {product.discount_percentage > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-gold/10 text-gold border-gold/20"
                        >
                          -{product.discount_percentage}%
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        product.stock_quantity <= 5 && "text-destructive",
                      )}
                    >
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_published ? "default" : "secondary"}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        product.is_published
                          ? "bg-ghana-green/10 text-ghana-green border-ghana-green/20"
                          : "bg-secondary text-secondary-foreground",
                      )}
                    >
                      {product.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ProductActions product={product} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 bg-muted/5">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground font-medium">
                      No products found matching your filters
                    </p>
                    <p className="text-xs text-muted-foreground/60 italic">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataPagination
        totalCount={count || 0}
        pageSize={size}
        currentPage={currentPage}
      />
    </div>
  );
}
