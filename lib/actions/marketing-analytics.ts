"use server";

import { createClient } from "@/lib/supabase/server";

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "all";

function getStartDate(period: AnalyticsPeriod) {
  if (period === "all") return null;
  const date = new Date();
  if (period === "7d") date.setDate(date.getDate() - 7);
  else if (period === "30d") date.setDate(date.getDate() - 30);
  else if (period === "90d") date.setDate(date.getDate() - 90);
  return date.toISOString();
}

export async function getMarketingStats(period: AnalyticsPeriod = "30d") {
  const supabase = await createClient();
  const startDate = getStartDate(period);

  // 1. Total Subscribers
  const { count: totalSubscribers } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("is_subscribed", true);

  // 2. Sent Campaigns
  let campaignsQuery = supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("status", "sent");

  if (startDate) {
    campaignsQuery = campaignsQuery.gte("sent_at", startDate);
  }
  const { count: sentCampaigns } = await campaignsQuery;

  // 3. Campaign Revenue
  let revenueQuery = supabase
    .from("orders")
    .select("total_amount")
    .not("campaign_id", "is", null)
    .eq("payment_status", "paid");

  if (startDate) {
    revenueQuery = revenueQuery.gte("created_at", startDate);
  }
  const { data: campaignOrders } = await revenueQuery;

  const totalCampaignRevenue =
    campaignOrders?.reduce((sum, order: any) => sum + order.total_amount, 0) ||
    0;

  // 4. Subscriber Growth
  let growthQuery = supabase
    .from("subscribers")
    .select("id", { count: "exact", head: true })
    .eq("is_subscribed", true);

  if (startDate) {
    growthQuery = growthQuery.gte("created_at", startDate);
  }
  const { count: recentSubscribers } = await growthQuery;

  return {
    totalSubscribers: totalSubscribers || 0,
    sentCampaigns: sentCampaigns || 0,
    totalCampaignRevenue,
    subscribersInPeriod: recentSubscribers || 0,
  };
}

export async function getTopCampaigns(period: AnalyticsPeriod = "30d") {
  const supabase = await createClient();
  const startDate = getStartDate(period);

  let query = supabase
    .from("campaigns")
    .select(
      `
      id,
      name,
      status,
      sent_at,
      orders!inner (
        total_amount,
        payment_status
      )
    `,
    )
    .eq("status", "sent")
    .eq("orders.payment_status", "paid");

  if (startDate) {
    query = query.gte("sent_at", startDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching top campaigns:", error);
    return [];
  }

  const campaigns = data.map((campaign: any) => {
    const revenue = campaign.orders.reduce(
      (sum: number, o: any) => sum + o.total_amount,
      0,
    );
    // Dummy CTR for now as we don't track clicks yet
    const engagement = Math.floor(Math.random() * 15) + 5;
    return {
      id: campaign.id,
      name: campaign.name,
      revenue,
      rate: `${engagement}%`,
    };
  });

  return campaigns.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}

export async function getSubscriberGrowthData(period: AnalyticsPeriod = "30d") {
  const supabase = await createClient();
  const startDate = getStartDate(period);

  let query = supabase
    .from("subscribers")
    .select("created_at")
    .order("created_at", { ascending: true });

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  const { data, error } = await query;

  if (error) return { error: error.message };

  // Group by date
  const growth = data.reduce((acc: Record<string, number>, sub) => {
    const date = new Date(sub.created_at).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to cumulative growth for the chart
  let cumulative = 0;
  const chartData = Object.entries(growth).map(([date, count]) => {
    cumulative += count;
    return { date, count: cumulative };
  });

  return { data: chartData };
}
