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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Phone,
  Calendar,
  MoreHorizontal,
  Eye,
  FilePlus,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { AdminFilters } from "./admin-filters";
import { DataPagination } from "./data-pagination";
import { cn } from "@/lib/utils";

interface WhatsAppOrdersClientProps {
  initialOrders: any[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

const WHATSAPP_STATUSES = [
  { value: "initiated", label: "Initiated" },
  { value: "confirmed", label: "Confirmed" },
  { value: "converted", label: "Converted" },
  { value: "cancelled", label: "Cancelled" },
];

export function WhatsAppOrdersClient({
  initialOrders,
  totalCount,
  pageSize,
  currentPage,
}: WhatsAppOrdersClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initiated":
        return "bg-secondary text-secondary-foreground";
      case "confirmed":
        return "bg-gold/10 text-gold border-gold/20";
      case "converted":
        return "bg-ghana-green/10 text-ghana-green border-ghana-green/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from("whatsapp_orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminFilters
        statuses={WHATSAPP_STATUSES}
        placeholder="Search name, phone or ID..."
      />

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-bold py-4">Customer</TableHead>
              <TableHead className="font-bold py-4">Status</TableHead>
              <TableHead className="font-bold py-4">Total Amount</TableHead>
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
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-sm">
                        {order.customer_name || order.guest_name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gold" />
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {order.customer_phone || order.guest_phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-7 rounded-full border px-3 text-[10px] font-bold uppercase tracking-wider transition-all",
                            getStatusColor(order.status),
                            updatingId === order.id &&
                              "opacity-50 pointer-events-none",
                          )}
                        >
                          {order.status}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-40">
                        {WHATSAPP_STATUSES.map((s) => (
                          <DropdownMenuItem
                            key={s.value}
                            onClick={() =>
                              handleUpdateStatus(order.id, s.value)
                            }
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-gold"
                          >
                            {s.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="font-bold text-sm text-gold">
                    {formatPrice(order.total_amount || 0)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 hover:bg-gold/10 hover:text-gold transition-colors"
                    >
                      <a
                        href={`https://wa.me/${(order.customer_phone || order.guest_phone || "").replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 bg-muted/5">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground font-medium">
                      No WhatsApp orders found matching your criteria
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
