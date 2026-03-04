"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { BRAND } from "@/lib/constants";
import nodemailer from "nodemailer";

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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // 3. Send using Nodemailer (Individualized for personalization like unsubscribe link)
    // We process in small batches to avoid timeouts if many subscribers
    const batchSize = 10;
    let sentCount = 0;
    let failureCount = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const sendPromises = batch.map(async (sub) => {
        const personalizedHtml = campaign.content_html.replace(
          /{{EMAIL}}/g,
          encodeURIComponent(sub.email),
        );

        try {
          await transporter.sendMail({
            from:
              process.env.SMTP_FROM ||
              `"${BRAND.name}" <${process.env.SMTP_USER}>`,
            to: sub.email,
            subject: campaign.subject_line,
            html: personalizedHtml,
          });
          return { success: true };
        } catch (err) {
          console.error(`Failed to send email to ${sub.email}:`, err);
          return { success: false, error: err };
        }
      });

      const results = await Promise.all(sendPromises);
      sentCount += results.filter((r) => r.success).length;
      failureCount += results.filter((r) => !r.success).length;
    }

    if (failureCount > 0) {
      console.warn(`Campaign sent with ${failureCount} failures.`);
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
    return { success: true, count: sentCount, failures: failureCount };
  } catch (error: any) {
    console.error("Error sending campaign:", error);
    return { error: error.message || "Failed to send emails via Nodemailer" };
  }
}
