import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  FolderOpen,
  Tags,
  Users,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/constants";
import type { Metadata } from "next";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { subDays, format } from "date-fns";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: productCount },
    { count: paidOrderCount },
    { count: pendingOrderCount },
    { data: paidRevenueData },
    { data: pendingRevenueData },
    { count: lowStockCount },
    { count: collectionCount },
    { count: categoryCount },
    { count: userCount },
    { count: unreadMessagesCount },
    { data: recentSalesData },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "pending"),
    supabase.from("orders").select("total_amount").eq("payment_status", "paid"),
    supabase
      .from("orders")
      .select("total_amount")
      .eq("payment_status", "pending"),
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
    supabase
      .from("orders")
      .select("created_at, total_amount")
      .eq("payment_status", "paid")
      .gte("created_at", subDays(new Date(), 30).toISOString())
      .order("created_at", { ascending: true }),
  ]);

  const totalPaidRevenue =
    paidRevenueData?.reduce(
      (sum: number, o: { total_amount: number | string }) =>
        sum + Number(o.total_amount),
      0,
    ) || 0;

  const totalPendingRevenue =
    pendingRevenueData?.reduce(
      (sum: number, o: { total_amount: number | string }) =>
        sum + Number(o.total_amount),
      0,
    ) || 0;

  // Process sales data for charts
  const salesByDay: Record<string, { revenue: number; orders: number }> = {};

  // Initialize last 30 days
  for (let i = 29; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), "MMM dd");
    salesByDay[dateStr] = { revenue: 0, orders: 0 };
  }

  recentSalesData?.forEach(
    (order: { created_at: string; total_amount: number | string }) => {
      const dateStr = format(new Date(order.created_at), "MMM dd");
      if (salesByDay[dateStr]) {
        salesByDay[dateStr].revenue += Number(order.total_amount);
        salesByDay[dateStr].orders += 1;
      }
    },
  );

  const chartData = Object.entries(salesByDay).map(([date, data]) => ({
    date,
    ...data,
  }));

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Actual Revenue (Paid)",
      value: formatPrice(totalPaidRevenue),
      icon: DollarSign,
      color: "text-ghana-green",
    },
    {
      label: "Potential Revenue (Pending)",
      value: formatPrice(totalPendingRevenue),
      icon: DollarSign,
      color: "text-gold",
    },
    {
      label: "Paid Orders",
      value: paidOrderCount || 0,
      icon: ShoppingCart,
      color: "text-ghana-green",
    },
    {
      label: "Pending Orders",
      value: pendingOrderCount || 0,
      icon: ShoppingCart,
      color: "text-gold",
    },
    {
      label: "Total Products",
      value: productCount || 0,
      icon: Package,
      color: "text-primary",
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
  ];

  const secondaryStats = [
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
      label: "Customers",
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview of your store's performance at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gold/5 px-4 py-2 rounded-lg border border-gold/10">
          <TrendingUp className="h-4 w-4 text-gold" />
          <span className="text-xs font-medium text-gold uppercase tracking-wider">
            Real-time analytics active
          </span>
        </div>
      </div>

      {/* Primary Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border/40 shadow-sm overflow-hidden group hover:border-gold/30 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div
                className={cn(
                  "p-2 rounded-lg bg-muted/50 group-hover:bg-gold/10 transition-colors",
                  stat.color,
                )}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-serif font-medium">{stat.value}</p>
            </CardContent>
            <div className="h-1 w-full bg-muted/20">
              <div
                className={cn(
                  "h-full w-1/3 opacity-50",
                  stat.color.replace("text-", "bg-"),
                )}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <DashboardCharts salesData={chartData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent orders */}
        <Card className="lg:col-span-2 border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl font-medium">
                Recent Orders
              </CardTitle>
              <CardDescription className="text-xs">
                Latest transactions across your store
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gold"
              asChild
            >
              <Link href="/admin/orders">View all →</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-1">
                {recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border-b border-border/10 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gold/5 flex items-center justify-center text-gold font-bold text-xs">
                        {order.customer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {order.customer_name}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {format(new Date(order.created_at), "MMM dd, h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="font-medium text-sm text-gold">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span
                        className={cn(
                          "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border",
                          order.status === "paid"
                            ? "bg-ghana-green/5 text-ghana-green border-ghana-green/20"
                            : order.status === "pending"
                              ? "bg-gold/5 text-gold border-gold/20"
                              : order.status === "shipped"
                                ? "bg-blue-500/5 text-blue-500 border-blue-500/20"
                                : order.status === "delivered"
                                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                                  : "bg-red-500/5 text-red-500 border-red-500/20",
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground italic">
                  No orders yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secondary Stats/Quick Actions */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-lg font-medium">
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {secondaryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-lg border border-border/20 bg-muted/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={cn("h-3 w-3", stat.color)} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-xl font-medium">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gold/5 border-gold/20 shadow-none border-dashed">
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-gold/20 flex items-center justify-center mx-auto">
                <Package className="h-6 w-6 text-gold" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-medium">
                  Manage Products
                </h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Update inventory, add new collections, or adjust pricing to
                  boost sales.
                </p>
              </div>
              <Button
                className="w-full bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-[10px] h-10"
                asChild
              >
                <Link href="/admin/products">Go to Catalog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
