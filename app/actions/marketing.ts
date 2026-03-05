"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function subscribeToNewsletter(
  email: string,
  source: string = "newsletter",
) {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const supabase = await createClient();

  try {
    // Check if subscriber exists
    const { data: existingUser } = await supabase
      .from("subscribers")
      .select("id, is_subscribed")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.is_subscribed) {
        return { success: true, message: "You are already subscribed!" };
      } else {
        // Resubscribe
        const { error: updateError } = await supabase
          .from("subscribers")
          .update({ is_subscribed: true })
          .eq("id", existingUser.id);

        if (updateError) throw updateError;
        return {
          success: true,
          message: "Welcome back! You have been re-subscribed.",
        };
      }
    }

    // Insert new subscriber
    const { error: insertError } = await supabase.from("subscribers").insert({
      email,
      source,
      is_subscribed: true,
    });

    if (insertError) {
      // If it's a conflict error (23505), someone might have just subscribed. Handle it gracefully.
      if (insertError.code === "23505") {
        return { success: true, message: "Thank you for subscribing!" };
      }
      throw insertError;
    }

    revalidatePath("/admin/audience");
    return {
      success: true,
      message: "Thank you for subscribing to Elita Apparel!",
    };
  } catch (error: any) {
    console.error("Newsletter Subscription Error:", error);
    return {
      success: false,
      error: "There was an error trying to subscribe. Please try again.",
    };
  }
}

export async function unsubscribeFromNewsletter(email: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("subscribers")
    .update({ is_subscribed: false, updated_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    console.error("Unsubscribe error:", error);
    return {
      error: "Failed to unsubscribe. Please try again or contact support.",
    };
  }

  return { success: true, message: "You have been successfully unsubscribed." };
}
