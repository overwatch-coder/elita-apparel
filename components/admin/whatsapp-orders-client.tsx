"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  MoreHorizontal,
  FilePlus,
  MessageCircle,
} from "lucide-react";
import {
  updateWhatsAppOrderStatus,
  convertWhatsAppToOrder,
} from "@/app/actions/whatsapp-orders";
import { formatPrice } from "@/lib/constants";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WhatsAppOrder } from "@/lib/types/database";

interface WhatsAppOrdersClientProps {
  initialOrders: WhatsAppOrder[];
}

export function WhatsAppOrdersClient({
  initialOrders,
}: WhatsAppOrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<WhatsAppOrder | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      order.order_ref.toLowerCase().includes(term) ||
      (order.guest_name && order.guest_name.toLowerCase().includes(term)) ||
      (order.guest_phone && order.guest_phone.toLowerCase().includes(term))
    );
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsUpdating(id);
    try {
      const result = await updateWhatsAppOrderStatus(id, newStatus);
      if (result?.success) {
        setOrders(
          orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
        );
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleConvertOrder = async (order: WhatsAppOrder) => {
    if (
      !confirm(
        "This will create a Paid system order for this WhatsApp order. Proceed?",
      )
    )
      return;

    setIsUpdating(order.id);
    try {
      const result = await convertWhatsAppToOrder(order.id);
      if (result?.success) {
        setOrders(
          orders.map((o) =>
            o.id === order.id ? { ...o, status: "converted" } : o,
          ),
        );
        toast.success("Successfully converted to system order");
      } else {
        toast.error(result?.error || "Failed to convert order");
      }
    } catch {
      toast.error("An error occurred during conversion");
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initiated":
        return "bg-secondary text-secondary-foreground";
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "converted":
        return "bg-ghana-green/10 text-ghana-green border-ghana-green/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const openDetails = (order: WhatsAppOrder) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const respondOnWhatsApp = (phone: string | null) => {
    if (!phone) {
      toast.error("No phone number provided");
      return;
    }
    // Remove any non-numeric characters (except maybe '+')
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border border-border/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ref, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Order Ref</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No WhatsApp orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.order_ref}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.guest_name || "Unknown Guest"}</span>
                      {order.guest_phone && (
                        <span className="text-xs text-muted-foreground">
                          {order.guest_phone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(order.total_amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusColor(order.status)}`}
                    >
                      {isUpdating === order.id ? "Updating..." : order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {order.guest_phone && (
                          <DropdownMenuItem
                            onClick={() => respondOnWhatsApp(order.guest_phone)}
                          >
                            <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
                            Respond on WhatsApp
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleConvertOrder(order)}
                          disabled={
                            order.status === "converted" ||
                            order.status === "cancelled"
                          }
                          className="font-medium text-ghana-green focus:text-ghana-green"
                        >
                          <FilePlus className="mr-2 h-4 w-4" />
                          Convert to Paid Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order.id, "initiated")
                          }
                          disabled={order.status === "initiated"}
                        >
                          Mark as Initiated
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order.id, "confirmed")
                          }
                          disabled={order.status === "confirmed"}
                        >
                          Mark as Confirmed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order.id, "converted")
                          }
                          disabled={order.status === "converted"}
                        >
                          Mark as Converted
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusUpdate(order.id, "cancelled")
                          }
                          disabled={order.status === "cancelled"}
                          className="text-destructive focus:text-destructive"
                        >
                          Mark as Cancelled
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Order Details - {selectedOrder?.order_ref}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">
                    {selectedOrder.guest_name || "Unknown"}
                  </p>
                  {selectedOrder.guest_email && (
                    <p className="text-sm">{selectedOrder.guest_email}</p>
                  )}
                  <p className="text-sm flex items-center gap-2">
                    {selectedOrder.guest_phone || "No phone"}
                    {selectedOrder.guest_phone && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#25D366] hover:text-[#1DA851] hover:bg-[#25D366]/10"
                        onClick={() =>
                          respondOnWhatsApp(selectedOrder.guest_phone)
                        }
                        title="Respond on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4 fill-current" />
                      </Button>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(
                      selectedOrder.status,
                    )} mt-1`}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 border-b pb-2">Cart Items</h3>
                <div className="space-y-4">
                  {(selectedOrder.cart_snapshot as any)?.items?.map(
                    (item: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="flex justify-between border-t pt-4">
                <span className="font-semibold text-lg">Total Amount</span>
                <span className="font-bold text-xl text-gold">
                  {formatPrice(selectedOrder.total_amount)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
