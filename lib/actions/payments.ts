"use server";

import { createClient } from "@/lib/supabase/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function verifyPaystackPayment(
  reference: string,
  orderId: string,
) {
  if (!PAYSTACK_SECRET_KEY) {
    console.error("PAYSTACK_SECRET_KEY is not set");
    return { success: false, error: "Payment configuration error" };
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      const supabase = await createClient();

      // Update order status in Supabase and get the tracking number
      const { data: orderData, error } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
        })
        .eq("id", orderId)
        .select("tracking_number")
        .single();

      if (error) {
        console.error("Error updating order payment status:", error);
        // Even if DB update fails, the payment was successful on Paystack.
        // The webhook should ideally serve as a fallback.
      }

      return { success: true, trackingNumber: orderData?.tracking_number };
    } else {
      return {
        success: false,
        error: data.message || "Payment verification failed",
      };
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      error: "Internal server error during verification",
    };
  }
}
