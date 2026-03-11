import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ChevronRight, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function OrderHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get total count for pagination
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get paginated orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + itemsPerPage - 1);

  const totalPages = Math.ceil((totalOrders || 0) / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "processing":
        return "bg-gold/10 text-gold border-gold/20";
      case "cancelled":
      case "failed":
        return "bg-ghana-red/10 text-ghana-red border-ghana-red/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-foreground mb-2">
          Order History
        </h1>
        <p className="text-muted-foreground text-sm">
          Track, return, or repurchase items from your past orders.
        </p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          <div className="rounded-md border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-medium text-xs uppercase tracking-wider">
                    Order ID
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wider text-right">
                    Items
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase tracking-wider text-right">
                    Total
                  </TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-accent/5 transition-colors group"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground/80">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize font-normal text-[10px] tracking-wide ${getStatusColor(order.status)}`}
                      >
                        {order.status?.includes("out_for_delivery")
                          ? order.status.replace(
                              "out_for_delivery",
                              "out for delivery",
                            )
                          : order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {order.order_items.length}{" "}
                      {order.order_items.length === 1 ? "item" : "items"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      GH₵{order.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gold/10 hover:text-gold"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="font-serif text-xs">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="flex items-center cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-muted-foreground cursor-not-allowed">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Re-order</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/account/orders?page=${Math.max(1, currentPage - 1)}`}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href={`/account/orders?page=${i + 1}`}
                        isActive={currentPage === i + 1}
                        className={
                          currentPage === i + 1
                            ? "bg-gold text-white hover:bg-gold-dark hover:text-white border-gold"
                            : "hover:text-gold hover:bg-gold/5"
                        }
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href={`/account/orders?page=${Math.min(totalPages, currentPage + 1)}`}
                      className={
                        currentPage === totalPages
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
      ) : (
        <div className="bg-card border border-border rounded-lg p-10 sm:p-16 text-center shadow-sm">
          <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-serif text-foreground mb-2">
            No completed orders
          </h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            You don't have any orders yet. Discover our latest collections and
            find something that speaks to your elegance.
          </p>
          <Button
            asChild
            className="bg-gold hover:bg-gold-dark text-white tracking-widest uppercase px-8 h-12"
          >
            <Link href="/shop">Explore Collection</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
