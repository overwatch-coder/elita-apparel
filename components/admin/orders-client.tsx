"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/constants";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Button } from "@/components/ui/button";
import { Eye, Search, X } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface OrdersClientProps {
  initialOrders: any[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const filteredOrders = useMemo(() => {
    if (!debouncedSearch) return initialOrders;

    const query = debouncedSearch.toLowerCase();
    return initialOrders.filter((order) => {
      const idStr = order.id.slice(0, 8).toLowerCase();
      const nameMatch = order.customer_name.toLowerCase().includes(query);
      const emailMatch = order.customer_email.toLowerCase().includes(query);
      const idMatch = idStr.includes(query);

      return nameMatch || emailMatch || idMatch;
    });
  }, [debouncedSearch, initialOrders]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.order_items?.length || 0} items
                  </TableCell>
                  <TableCell className="font-medium text-sm text-gold">
                    {formatPrice(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-GH", {
                      dateStyle: "medium",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-gold hover:text-gold-dark"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "No orders match your search"
                      : "No orders yet"}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
