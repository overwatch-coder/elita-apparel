"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { BRAND } from "@/lib/constants";

export async function getCampaigns() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching campaigns:", error);
    return { error: error.message };
  }

  return { campaigns: data };
}

export async function getCampaignById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching campaign:", error);
    return { error: error.message };
  }

  return { campaign: data };
}

export async function createCampaign(formData: {
  name: string;
  subject_line: string;
  preview_text?: string;
  content_html: string;
  segment_id?: string;
  status?: string;
  scheduled_at?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      ...formData,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating campaign:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/campaigns");
  return { campaign: data };
}

export async function updateCampaign(id: string, formData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("campaigns")
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating campaign:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/campaigns");
  return { campaign: data };
}

export async function deleteCampaign(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("campaigns").delete().eq("id", id);

  if (error) {
    console.error("Error deleting campaign:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/campaigns");
  return { success: true };
}

export async function sendCampaign(campaignId: string) {
  const supabase = await createClient();

  // 1. Fetch Campaign
  const { data: campaign, error: campError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (campError || !campaign) {
    return { error: campError?.message || "Campaign not found" };
  }

  // 2. Fetch Active Subscribers
  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("email")
    .eq("is_subscribed", true);

  if (subError || !subscribers || subscribers.length === 0) {
    return { error: subError?.message || "No subscribers found to send to" };
  }

  const emails = subscribers.map((s) => s.email);

  try {
    // 3. Send using Resend (Individualized for personalization like unsubscribe link)
    const sendPromises = subscribers.map(async (sub) => {
      // Replace personalization tags
      const personalizedHtml = campaign.content_html.replace(
        /{{EMAIL}}/g,
        encodeURIComponent(sub.email),
      );

      return resend.emails.send({
        from: `${BRAND.name} <${process.env.RESEND_FROM_EMAIL || "marketing@elitaapparel.com"}>`,
        to: sub.email,
        subject: campaign.subject_line,
        html: personalizedHtml,
      });
    });

    const results = await Promise.all(sendPromises);
    const errors = results.filter((r) => r.error);

    if (errors.length > 0) {
      console.warn("Some emails failed to send:", errors);
    }

    // 4. Update Campaign Status
    await supabase
      .from("campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    revalidatePath("/admin/campaigns");
    return { success: true, count: emails.length };
  } catch (error: any) {
    console.error("Error sending campaign:", error);
    return { error: error.message || "Failed to send emails via Resend" };
  }
}
