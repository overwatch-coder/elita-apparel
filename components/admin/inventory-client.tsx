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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { updateStock, updateBulkStock } from "@/lib/actions/admin";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkQuantity, setBulkQuantity] = useState<number>(0);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

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

  const handleBulkSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (selectedIds.size === 0) return;

    const result = await updateBulkStock(Array.from(selectedIds), bulkQuantity);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Updated stock for ${selectedIds.size} products`);
      setSelectedIds(new Set());
      setBulkQuantity(0);
      setIsBulkOpen(false);
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 bg-white/5 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto p-2 bg-white/5 border border-border/30 rounded-lg">
            <span className="text-sm font-medium px-2">
              {selectedIds.size} selected
            </span>
            <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gold hover:bg-gold-dark text-white"
                >
                  Bulk Edit Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                  <DialogTitle>Set Stock Quantity</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBulkSave} className="space-y-4 pt-4">
                  <div>
                    <Input
                      type="number"
                      min="0"
                      value={bulkQuantity}
                      onChange={(e) => setBulkQuantity(Number(e.target.value))}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-dark text-white"
                  >
                    Apply to {selectedIds.size} items
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    filteredProducts.length > 0 &&
                    selectedIds.size === filteredProducts.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={() => toggleSelect(product.id)}
                    />
                  </TableCell>
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
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">No products found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
