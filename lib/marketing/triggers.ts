import { createClient } from "@/lib/supabase/server";
import { transporter } from "@/lib/mail";
import { BRAND } from "@/lib/constants";

export type TriggerEvent = "signup" | "order_placed" | "abandoned_cart";

interface TriggerData {
  email: string;
  name?: string;
  order_id?: string;
  cart_id?: string;
}

/**
 * Triggers a marketing automation flow based on an event.
 * Coordinates immediate dispatch and queues delayed emails.
 */
export async function triggerMarketingAutomation(
  event: TriggerEvent,
  data: TriggerData,
) {
  const supabase = await createClient();

  // 1. Fetch active automation for this event
  const { data: automation, error: autoError } = await supabase
    .from("automations")
    .select("*, automation_emails(*)")
    .eq("trigger_event", event)
    .eq("active", true)
    .single();

  if (autoError || !automation) {
    if (autoError && autoError.code !== "PGRST116") {
      console.error(`Error fetching automation for ${event}:`, autoError);
    }
    return { success: false, message: "No active automation for this event" };
  }

  const emails = automation.automation_emails || [];
  if (emails.length === 0)
    return { success: false, message: "No emails in flow" };

  try {
    for (const emailFlow of emails) {
      if (emailFlow.delay_minutes === 0) {
        // Immediate Send
        console.log(
          `[Automation] Triggering immediate send for ${data.email} in flow ${automation.name}`,
        );

        // Personalize content
        let html = emailFlow.content_html;
        html = html.replace(/{{NAME}}/g, data.name || "there");
        html = html.replace(/{{EMAIL}}/g, encodeURIComponent(data.email));
        if (data.order_id) html = html.replace(/{{ORDER_ID}}/g, data.order_id);

        try {
          await transporter.sendMail({
            from:
              process.env.SMTP_FROM ||
              `"${BRAND.name}" <${process.env.SMTP_USER}>`,
            to: data.email,
            subject: emailFlow.subject_line,
            html: html,
          });

          // Log success
          await supabase.from("automation_logs").insert({
            automation_id: automation.id,
            email_id: emailFlow.id,
            subscriber_email: data.email,
            status: "sent",
            sent_at: new Date().toISOString(),
            scheduled_at: new Date().toISOString(),
          });
        } catch (sendError) {
          console.error(
            `[Automation] Failed to send immediate email to ${data.email}:`,
            sendError,
          );
          // Log failure
          await supabase.from("automation_logs").insert({
            automation_id: automation.id,
            email_id: emailFlow.id,
            subscriber_email: data.email,
            status: "failed",
            scheduled_at: new Date().toISOString(),
          });
        }
      } else {
        // Queue for delayed sending
        console.log(
          `[Automation] Queuing delayed email (${emailFlow.delay_minutes}min) for ${data.email}`,
        );

        const scheduledAt = new Date(
          Date.now() + emailFlow.delay_minutes * 60000,
        ).toISOString();

        await supabase.from("automation_logs").insert({
          automation_id: automation.id,
          email_id: emailFlow.id,
          subscriber_email: data.email,
          status: "pending",
          scheduled_at: scheduledAt,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error(`[Automation] Error processing trigger for ${event}:`, error);
    return { success: false, error };
  }
}

/**
 * Utility to process any pending automated emails whose scheduled_at time has passed.
 * Designed for production use via cron jobs or edge function triggers.
 */
export async function processPendingAutomations() {
  const supabase = await createClient();

  // Find all pending logs that are due
  const { data: pendingLogs, error: logError } = await supabase
    .from("automation_logs")
    .select("*, automation_emails(*)")
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString());

  if (logError || !pendingLogs || pendingLogs.length === 0) {
    return { count: 0 };
  }

  let sentCount = 0;
  for (const log of pendingLogs) {
    if (!log.automation_emails) continue;

    try {
      // Personalize content
      let html = log.automation_emails.content_html;
      html = html.replace(
        /{{EMAIL}}/g,
        encodeURIComponent(log.subscriber_email),
      );

      try {
        await transporter.sendMail({
          from:
            process.env.SMTP_FROM ||
            `"${BRAND.name}" <${process.env.SMTP_USER}>`,
          to: log.subscriber_email,
          subject: log.automation_emails.subject_line,
          html: html,
        });

        await supabase
          .from("automation_logs")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("id", log.id);
        sentCount++;
      } catch (sendError) {
        console.error(
          `[Automation] Delayed send failed for ${log.id}:`,
          sendError,
        );
        await supabase
          .from("automation_logs")
          .update({
            status: "failed",
          })
          .eq("id", log.id);
      }
    } catch (e) {
      console.error(`Error processing pending log ${log.id}:`, e);
    }
  }

  return { count: sentCount };
}
