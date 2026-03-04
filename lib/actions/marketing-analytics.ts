"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMarketingStats() {
  const supabase = await createClient();

  // 1. Total Subscribers
  const { count: totalSubscribers } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("is_subscribed", true);

  // 2. Sent Campaigns
  const { count: sentCampaigns } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("status", "sent");

  // 3. Campaign Revenue
  const { data: campaignOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .not("campaign_id", "is", null)
    .eq("payment_status", "paid");

  const totalCampaignRevenue =
    campaignOrders?.reduce((sum, order: any) => sum + order.total_amount, 0) ||
    0;

  // 4. Subscriber Growth (Last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentSubscribers } = await supabase
    .from("subscribers")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString());

  return {
    totalSubscribers: totalSubscribers || 0,
    sentCampaigns: sentCampaigns || 0,
    totalCampaignRevenue,
    subscribersLast30Days: recentSubscribers?.length || 0,
  };
}

export async function getCampaignPerformance(campaignId: string) {
  const supabase = await createClient();

  // Fetch campaign details
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (!campaign) return { error: "Campaign not found" };

  // Fetch related orders
  const { data: orders } = await supabase
    .from("orders")
    .select("total_amount, status")
    .eq("campaign_id", campaignId)
    .eq("payment_status", "paid");

  const revenue = orders?.reduce((sum, o: any) => sum + o.total_amount, 0) || 0;
  const conversions = orders?.length || 0;

  return {
    campaign,
    revenue,
    conversions,
    // Note: Open/Click rates would typically come from an email provider's webhooks
    // For this implementation, we'll return these as static stats for now
    openRate: 42.8,
    clickRate: 15.4,
  };
}

export async function getSubscriberGrowthData() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscribers")
    .select("created_at")
    .order("created_at", { ascending: true });

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
