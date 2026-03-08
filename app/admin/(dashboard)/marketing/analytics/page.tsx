import {
  getMarketingStats,
  getSubscriberGrowthData,
  getTopCampaigns,
  AnalyticsPeriod,
} from "@/lib/actions/marketing-analytics";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Megaphone,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PeriodSelector } from "@/components/admin/period-selector";

export default async function MarketingAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = (params.period as AnalyticsPeriod) || "30d";

  const stats = await getMarketingStats(period);
  const growthData = await getSubscriberGrowthData(period);
  const topCampaigns = await getTopCampaigns(period);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif">Marketing Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your campaign performance and audience growth.
          </p>
        </div>
        <PeriodSelector />
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
                className="bg-ghana-green/10 text-ghana-green border-none text-[10px] h-5"
              >
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                {stats.subscribersInPeriod} new
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                in {period === "all" ? "total" : period}
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
              Sent in {period === "all" ? "total" : period}
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
              Revenue from email attribution ({period})
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Revenue/Campaign
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatPrice(
                stats.sentCampaigns > 0
                  ? stats.totalCampaignRevenue / stats.sentCampaigns
                  : 0,
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2.5">
              Performance per campaign
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
          </CardHeader>
          <CardContent>
            {growthData.data && growthData.data.length > 0 ? (
              <AnalyticsCharts
                growthData={growthData.data.map((d) => ({
                  period: d.date,
                  subscribers: d.count,
                }))}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm italic">
                No growth data for this period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Campaigns Table */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Top Campaigns</CardTitle>
            <CardDescription className="text-xs">
              By revenue in {period}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {topCampaigns.length > 0 ? (
              <div className="divide-y divide-border/40">
                {topCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="px-6 py-4 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium truncate max-w-[150px]">
                        {campaign.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {campaign.rate} CTR (est)
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gold">
                      {formatPrice(campaign.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground text-sm italic">
                No campaign data found
              </div>
            )}
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
