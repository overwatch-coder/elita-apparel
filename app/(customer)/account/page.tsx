import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Package,
  MapPin,
  User,
  ChevronRight,
  Eye,
  CreditCard,
  Clock,
  TrendingUp,
  ShoppingBag,
  Award,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerDashboardCharts } from "@/components/account/dashboard-charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Fetch ALL orders for analytics
  const { data: allOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id);

  // Fetch recent orders (latest 5)
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch saved addresses count
  const { count: addressCount } = await supabase
    .from("addresses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Stats calculation
  const totalOrders = allOrders?.length || 0;
  const totalSpent =
    allOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
  const activeOrders =
    allOrders?.filter(
      (o) => !["delivered", "cancelled"].includes(o.status.toLowerCase()),
    ).length || 0;

  // Account level based on spend (Example logic)
  let accountLevel = "Standard";
  let levelColor = "text-muted-foreground";
  if (totalSpent > 5000) {
    accountLevel = "Elite";
    levelColor = "text-gold font-bold";
  } else if (totalSpent > 2000) {
    accountLevel = "Gold";
    levelColor = "text-yellow-600 font-bold";
  } else if (totalSpent > 1000) {
    accountLevel = "Silver";
    levelColor = "text-gray-400 font-bold";
  }

  // Fetch orders for the last 30 days for the chart
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: monthlyOrders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("user_id", user.id)
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  // Process data for charts
  const orderData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const spent =
      monthlyOrders
        ?.filter(
          (o) =>
            new Date(o.created_at).toLocaleDateString() ===
            d.toLocaleDateString(),
        )
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

    return { date: dateStr, spent };
  });

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
    <div className="space-y-10">
      {/* Header with Luxury feel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif text-foreground mb-3 leading-tight">
            Bonjour, {profile?.full_name?.split(" ")[0] || "Guest"}
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide max-w-md">
            Welcome to your exclusive Elita Apparel dashboard. Monitor your
            elegance and manage your sartorial journey.
          </p>
        </div>
        <div className="bg-muted/30 px-4 py-2 rounded-full border border-border/50 flex items-center gap-3">
          <Award className={`h-4 w-4 ${levelColor}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
            Status: <span className={levelColor}>{accountLevel} Member</span>
          </span>
        </div>
      </div>

      {/* Analytics Cards - Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/40 shadow-sm bg-card overflow-hidden group hover:border-gold/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all">
                <CreditCard className="h-5 w-5" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500/50" />
            </div>
            <p className="text-[10px] sub-heading font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Total Lifetime Spend
            </p>
            <h3 className="text-2xl font-serif text-foreground">
              GH₵{totalSpent.toFixed(2)}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card overflow-hidden group hover:border-gold/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[10px] sub-heading font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Total Orders
            </p>
            <h3 className="text-2xl font-serif text-foreground">
              {totalOrders}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card overflow-hidden group hover:border-gold/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[10px] sub-heading font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Active Deliveries
            </p>
            <h3 className="text-2xl font-serif text-foreground">
              {activeOrders}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card overflow-hidden group hover:border-gold/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <p className="text-[10px] sub-heading font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Saved Addresses
            </p>
            <h3 className="text-2xl font-serif text-foreground">
              {addressCount || 0} Locations
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area: Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border/40 rounded-xl p-4 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-serif text-foreground mb-1">
                  Spending Overview
                </h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  Last 30 Days Activity
                </p>
              </div>
            </div>
            <CustomerDashboardCharts orderData={orderData} />
          </div>

          {/* Recent Orders Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-serif text-foreground">
                Recent Acquisitions
              </h2>
              <Button
                asChild
                variant="link"
                className="text-gold hover:text-gold-light p-0 text-[10px] uppercase tracking-[0.2em] font-bold"
              >
                <Link href="/account/orders">Portfolio View</Link>
              </Button>
            </div>

            {recentOrders && recentOrders.length > 0 ? (
              <div className="rounded-xl border border-border/40 bg-card overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">
                        Article Date
                      </TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4">
                        Status
                      </TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-right">
                        Value
                      </TableHead>
                      <TableHead className="w-[60px] text-[10px] uppercase tracking-widest py-4">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-accent/5 transition-colors border-border/30"
                      >
                        <TableCell className="text-sm font-medium py-5">
                          {new Date(order.created_at).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`capitalize font-bold text-[9px] tracking-widest px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-serif text-foreground py-5">
                          GH₵{order.total_amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right py-5">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-gold hover:bg-gold/5"
                          >
                            <Link href={`/account/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-card border border-border/40 rounded-xl p-16 text-center shadow-sm border-dashed">
                <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-6" />
                <h3 className="text-lg font-serif text-foreground mb-3 uppercase tracking-widest">
                  A Blank Canvas
                </h3>
                <p className="text-xs text-muted-foreground mb-8 max-w-[280px] mx-auto leading-relaxed italic">
                  "Style is a way to say who you are without having to speak." -
                  Rachel Zoe
                </p>
                <Button
                  asChild
                  className="bg-gold hover:bg-gold-dark text-white tracking-[0.2em] uppercase text-[10px] font-bold h-12 px-10 rounded-none shadow-lg shadow-gold/20"
                >
                  <Link href="/shop">Curate Your Style</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Column */}
        <div className="space-y-6">
          <div className="bg-background border border-border/80 rounded-xl p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-all duration-500">
              <ShieldCheck className="h-20 w-20 text-foreground" />
            </div>
            <div className="flex items-center gap-2 mb-3 text-gold">
              <ShieldCheck className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Security Overview
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
              Your account security is our priority. Ensure your password is
              robust and your recovery details are up to date.
            </p>
            <div className="space-y-2 mb-6 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span>Account Status</span>
                <span className="text-green-500">Protected</span>
              </div>
              {/* <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span>2FA Status</span>
                <span className="text-ghana-red">Disabled</span>
              </div> */}
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full border-border hover:bg-gold/5 hover:text-gold hover:border-gold/30 text-[10px] font-bold uppercase tracking-widest h-10 transition-all"
            >
              <Link href="/account/profile">Manage Security</Link>
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-1">
              Navigation Shortcuts
            </h4>

            <Link
              href="/account/addresses"
              className="block p-4 bg-card border border-border/40 rounded-lg hover:border-gold/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-gold/10 group-hover:text-gold transition-all">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5">
                    Shipping
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Manage your global destinations.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-all" />
              </div>
            </Link>

            <Link
              href="/account/profile"
              className="block p-4 bg-card border border-border/40 rounded-lg hover:border-gold/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-gold/10 group-hover:text-gold transition-all">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5">
                    Sartorial Identity
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Secure your profile and measurements.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
