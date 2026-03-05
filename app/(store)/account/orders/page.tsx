import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrderHistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-lg overflow-hidden transition-colors hover:border-gold/30"
            >
              <div className="p-4 sm:p-6 border-b border-border flex flex-wrap gap-4 justify-between items-center bg-accent/5">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Order Placed
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Total
                  </p>
                  <p className="text-sm font-bold text-gold">
                    GH₵{order.total_amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold capitalize border border-gold/20">
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Order ID
                  </p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-end">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-gold hover:text-gold-light hover:bg-gold/10 px-3"
                  >
                    <Link href={`/account/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="p-4 sm:p-6 divide-y divide-border">
                {order.order_items.map((item: any) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 space-y-1">
                      <h4 className="text-base font-medium text-foreground">
                        {item.product_name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Size: {item.size}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground sm:text-right">
                      GH₵{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-10 sm:p-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-foreground mb-2">
            No completed orders
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            You don't have any orders yet. Discover our latest collections and
            find something extraordinary.
          </p>
          <Button
            asChild
            className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
          >
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
