import {
  getMarketingStats,
  getSubscriberGrowthData,
} from "@/lib/actions/marketing-analytics";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Megaphone,
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function MarketingAnalyticsPage() {
  const stats = await getMarketingStats();
  const growthData = await getSubscriberGrowthData();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif">Marketing Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your campaign performance and audience growth.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/20 px-3 py-1.5 rounded-full border border-border">
          <Calendar className="h-4 w-4" />
          <span>Last 30 Days</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscribers
            </CardTitle>
            <Users className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSubscribers}</div>
            <div className="flex items-center gap-1 mt-2">
              <Badge
                variant="secondary"
                className="bg-ghana-green/10 text-ghana-green hover:bg-ghana-green/20 border-none text-[10px] h-5"
              >
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                {stats.subscribersLast30Days} new
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                this month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Email Campaigns
            </CardTitle>
            <Megaphone className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.sentCampaigns}</div>
            <p className="text-[10px] text-muted-foreground mt-2.5">
              Total campaigns delivered
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Marketing Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatPrice(stats.totalCampaignRevenue)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2.5">
              Revenue from email attribution
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagement Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.4%</div>
            <p className="text-[10px] text-muted-foreground mt-2.5">
              Average click-through rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscriber Growth Chart Section */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-xl font-medium">
                Subscriber Growth
              </CardTitle>
              <CardDescription className="text-xs">
                Audience evolution over the analyzed period
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded font-bold uppercase tracking-widest">
              <TrendingUp className="h-3 w-3" />
              <span>Up 12%</span>
            </div>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts 
              growthData={(growthData.data || []).map(d => ({
                period: d.date,
                subscribers: d.count
              }))} 
            />
          </CardContent>
        </Card>

        {/* Top Campaigns Table */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Top Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {[
                {
                  name: "Summer Collection Launch",
                  revenue: 4500,
                  rate: "18%",
                },
                { name: "Early Bird Exclusive", revenue: 2800, rate: "22%" },
                { name: "Kente Heritage Series", revenue: 1950, rate: "14%" },
                { name: "Weekend Flash Sale", revenue: 1200, rate: "25%" },
              ].map((campaign) => (
                <div
                  key={campaign.name}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium truncate max-w-[150px]">
                      {campaign.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {campaign.rate} CTR
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gold">
                    {formatPrice(campaign.revenue)}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 mt-4">
              <Button
                variant="ghost"
                className="w-full text-xs text-gold hover:text-gold-dark hover:bg-gold/5"
                asChild
              >
                <a href="/admin/campaigns">View all campaigns →</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
