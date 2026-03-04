import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, MapPin, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AccountOverviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch latest order
  const { data: latestOrder } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Stats
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-cream mb-2">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Guest"}
        </h1>
        <p className="text-cream/70 text-sm">
          Manage your orders, profile, and addresses from your dashboard.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/account/orders" className="group">
          <div className="bg-white/5 border border-cream/10 rounded-lg p-5 flex flex-col h-full hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <Package className="h-5 w-5" />
              </div>
              <ChevronRight className="h-5 w-5 text-cream/30 group-hover:text-gold transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-cream mb-1">
              Total Orders
            </h3>
            <p className="text-3xl font-serif text-gold">{orderCount || 0}</p>
          </div>
        </Link>

        <Link href="/account/addresses" className="group">
          <div className="bg-white/5 border border-cream/10 rounded-lg p-5 flex flex-col h-full hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <MapPin className="h-5 w-5" />
              </div>
              <ChevronRight className="h-5 w-5 text-cream/30 group-hover:text-gold transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-cream mb-1">Addresses</h3>
            <p className="text-sm text-cream/60">Manage shipping</p>
          </div>
        </Link>

        <Link href="/account/profile" className="group">
          <div className="bg-white/5 border border-cream/10 rounded-lg p-5 flex flex-col h-full hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                <User className="h-5 w-5" />
              </div>
              <ChevronRight className="h-5 w-5 text-cream/30 group-hover:text-gold transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-cream mb-1">Profile</h3>
            <p className="text-sm text-cream/60">Personal details</p>
          </div>
        </Link>
      </div>

      {/* Recent Order */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif text-cream">Recent Order</h2>
          <Button
            asChild
            variant="link"
            className="text-gold hover:text-gold-light p-0"
          >
            <Link href="/account/orders">View All Orders</Link>
          </Button>
        </div>

        {latestOrder ? (
          <div className="bg-white/5 border border-cream/10 rounded-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-cream/10 flex flex-wrap gap-4 justify-between items-center bg-white/2">
              <div>
                <p className="text-xs text-cream/50 uppercase tracking-wider mb-1">
                  Order Placed
                </p>
                <p className="text-sm text-cream">
                  {new Date(latestOrder.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-cream/50 uppercase tracking-wider mb-1">
                  Total
                </p>
                <p className="text-sm text-gold font-medium">
                  GH₵{latestOrder.total_amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-cream/50 uppercase tracking-wider mb-1">
                  Status
                </p>
                <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold capitalize border border-gold/20">
                  {latestOrder.status}
                </span>
              </div>
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-cream/20 text-cream hover:bg-white/5"
                >
                  <Link href={`/account/orders/${latestOrder.id}`}>
                    Track Order
                  </Link>
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6 divide-y divide-cream/10">
              {latestOrder.order_items.map((item: any) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-start gap-4"
                >
                  <div className="flex-1">
                    <h4 className="text-base text-cream">
                      {item.product_name}
                    </h4>
                    <p className="text-sm text-cream/60 mt-1">
                      Size: {item.size}
                    </p>
                    <p className="text-sm text-cream/60">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-cream">
                    GH₵{item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-cream/10 rounded-lg p-10 text-center">
            <Package className="h-10 w-10 text-cream/20 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-cream mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-cream/60 mb-6 max-w-sm mx-auto">
              When you place your first order at Elita Apparel, it will appear
              here for you to track.
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
    </div>
  );
}
