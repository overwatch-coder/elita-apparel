"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateStock } from "@/lib/actions/admin";
import { formatPrice } from "@/lib/constants";
import { toast } from "sonner";
import type { Product } from "@/lib/types/database";

interface InventoryClientProps {
  products: Product[];
}

export function InventoryClient({ products }: InventoryClientProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setQuantity(product.stock_quantity);
  };

  const handleSave = async (id: string) => {
    const result = await updateStock(id, quantity);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Stock updated");
      setEditingId(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Manage product stock levels
        </p>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.fabric_type || "—"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    {editingId === product.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-20 h-8"
                      />
                    ) : (
                      <span
                        className={`text-sm ${
                          product.stock_quantity <= 5
                            ? "text-destructive font-medium"
                            : ""
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.stock_quantity === 0 ? (
                      <Badge variant="destructive" className="text-[10px]">
                        Out of Stock
                      </Badge>
                    ) : product.stock_quantity <= 5 ? (
                      <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px]">
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge className="bg-ghana-green/10 text-ghana-green border-0 text-[10px]">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === product.id ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleSave(product.id)}
                          className="bg-gold hover:bg-gold-dark text-white h-8"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <p className="text-muted-foreground">No products yet</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
