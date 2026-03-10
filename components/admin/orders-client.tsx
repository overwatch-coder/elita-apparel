"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/constants";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { AdminFilters } from "./admin-filters";
import { DataPagination } from "./data-pagination";

interface OrdersClientProps {
  initialOrders: any[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export function OrdersClient({
  initialOrders,
  totalCount,
  pageSize,
  currentPage,
}: OrdersClientProps) {
  return (
    <div className="space-y-6">
      <AdminFilters placeholder="Search by name, email or ID..." />

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-bold py-4">Order ID</TableHead>
              <TableHead className="font-bold py-4">Customer</TableHead>
              <TableHead className="font-bold py-4">Items</TableHead>
              <TableHead className="font-bold py-4">Total</TableHead>
              <TableHead className="font-bold py-4">Status</TableHead>
              <TableHead className="font-bold py-4">Date</TableHead>
              <TableHead className="text-right font-bold py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialOrders.length > 0 ? (
              initialOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">
                        {order.customer_name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {order.customer_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.order_items?.length || 0}{" "}
                    {order.order_items?.length === 1 ? "item" : "items"}
                  </TableCell>
                  <TableCell className="font-bold text-sm text-gold">
                    {formatPrice(order.total_amount)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-medium">
                    {new Date(order.created_at).toLocaleDateString("en-GH", {
                      dateStyle: "medium",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 bg-muted/5">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground font-medium">
                      No orders found matching your criteria
                    </p>
                    <p className="text-xs text-muted-foreground/60 italic">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataPagination
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  );
}
