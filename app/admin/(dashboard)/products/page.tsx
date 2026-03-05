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

export const metadata: Metadata = { title: "Products | Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { page = "1", pageSize = "10" } = await searchParams;
  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();

  const [{ data: products, count }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(name), collection:collections(name)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase.from("categories").select("id, name"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button asChild className="bg-gold hover:bg-gold-dark text-white">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.fabric_type || "—"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {product.category?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {formatPrice(product.price)}
                    </span>
                    {product.discount_percentage > 0 && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        -{product.discount_percentage}%
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm ${
                        product.stock_quantity <= 5
                          ? "text-destructive font-medium"
                          : ""
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_published ? "default" : "secondary"}
                      className={
                        product.is_published
                          ? "bg-ghana-green/10 text-ghana-green border-0"
                          : ""
                      }
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
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">No products yet</p>
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
