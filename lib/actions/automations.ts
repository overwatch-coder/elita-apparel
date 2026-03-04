"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAutomations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("automations")
    .select("*, automation_emails(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching automations:", error);
    return { error: error.message };
  }

  // Seed default automations if none exist
  if (data.length === 0) {
    const { data: seeded, error: seedError } = await supabase
      .from("automations")
      .insert([
        { name: "Welcome Series", trigger_event: "signup", active: true },
        {
          name: "Post-Purchase Flow",
          trigger_event: "order_placed",
          active: true,
        },
        {
          name: "Abandoned Cart Reminder",
          trigger_event: "abandoned_cart",
          active: false,
        },
      ])
      .select();

    if (!seedError && seeded) {
      const signupFlow = seeded.find((a) => a.trigger_event === "signup");

      if (signupFlow) {
        // Add default emails for Welcome Series
        await supabase.from("automation_emails").insert([
          {
            automation_id: signupFlow.id,
            delay_minutes: 0,
            subject_line: "Welcome to Elita Apparel!",
            content_html:
              "<h1>Welcome!</h1><p>Thank you for joining Elita Apparel. Use code WELCOME10 for 10% off your first order.</p>",
          },
          {
            automation_id: signupFlow.id,
            delay_minutes: 1440, // 1 day
            subject_line: "Discover our Story",
            content_html:
              "<h1>Our Roots</h1><p>Elita Apparel is inspired by Ghanaian culture and modern elegance...</p>",
          },
        ]);
      }

      // Re-fetch after seeding
      const { data: refetched } = await supabase
        .from("automations")
        .select("*, automation_emails(*)")
        .order("created_at", { ascending: false });
      return { automations: refetched };
    }
  }

  return { automations: data };
}

export async function toggleAutomation(id: string, active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("automations")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error toggling automation:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/automations");
  return { success: true };
}

export async function updateAutomationFlow(id: string, emails: any[]) {
  const supabase = await createClient();

  try {
    for (const email of emails) {
      if (email.id) {
        const { error } = await supabase
          .from("automation_emails")
          .update({
            subject_line: email.subject_line,
            content_html: email.content_html,
            delay_minutes: email.delay_minutes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", email.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("automation_emails").insert({
          automation_id: id,
          ...email,
        });
        if (error) throw error;
      }
    }

    revalidatePath("/admin/automations");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating automation flow:", err);
    return { success: false, error: err.message };
  }
}
