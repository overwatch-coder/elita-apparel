import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  FolderOpen,
  Tags,
  Users,
  MessageSquare,
} from "lucide-react";
import { formatPrice } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: productCount },
    { count: orderCount },
    { data: revenueData },
    { count: lowStockCount },
    { count: collectionCount },
    { count: categoryCount },
    { count: userCount },
    { count: unreadMessagesCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount").eq("status", "paid"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .lt("stock_quantity", 5)
      .gt("stock_quantity", 0),
    supabase.from("collections").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const totalRevenue =
    revenueData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Total Products",
      value: productCount || 0,
      icon: Package,
      color: "text-gold",
    },
    {
      label: "Total Orders",
      value: orderCount || 0,
      icon: ShoppingCart,
      color: "text-ghana-green",
    },
    {
      label: "Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-gold",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount || 0,
      icon: AlertTriangle,
      color:
        lowStockCount && lowStockCount > 0
          ? "text-destructive"
          : "text-muted-foreground",
    },
    {
      label: "Collections",
      value: collectionCount || 0,
      icon: FolderOpen,
      color: "text-earth",
    },
    {
      label: "Categories",
      value: categoryCount || 0,
      icon: Tags,
      color: "text-earth",
    },
    {
      label: "Total Customers",
      value: userCount || 0,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Unread Messages",
      value: unreadMessagesCount || 0,
      icon: MessageSquare,
      color:
        unreadMessagesCount && unreadMessagesCount > 0
          ? "text-ghana-red font-bold"
          : "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to Elita Apparel admin
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-GH", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-gold">
                      {formatPrice(order.total_amount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                        order.status === "paid"
                          ? "bg-ghana-green/10 text-ghana-green border-ghana-green/20"
                          : order.status === "pending"
                            ? "bg-gold/10 text-gold border-gold/20"
                            : order.status === "shipped"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : order.status === "delivered"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No orders yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
