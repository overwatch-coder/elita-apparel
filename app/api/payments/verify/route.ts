import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: Request) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment configuration error" },
        { status: 500 },
      );
    }

    const { reference, orderId } = await req.json();
    console.log(
      `Verifying payment for Order: ${orderId}, Reference: ${reference}`,
    );

    if (!reference || !orderId) {
      return NextResponse.json(
        { error: "Missing reference or orderId" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      // Use service role to bypass RLS for this specific server-verified action
      const supabaseAdmin = createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
      );

      // Map Paystack channel to our payment method label
      const paystackChannel = data.data.channel as string; // e.g. "card", "mobile_money", "bank"
      const paymentMethodMap: Record<string, string> = {
        card: "card",
        mobile_money: "momo",
        bank: "bank",
        ussd: "ussd",
        qr: "qr",
      };
      const resolvedPaymentMethod =
        paymentMethodMap[paystackChannel] ?? paystackChannel;

      // Update order status
      const { data: orderData, error } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "paid",
          payment_verified: true,
          paystack_reference: reference,
          paid_at: new Date().toISOString(),
          payment_method: resolvedPaymentMethod,
        })
        .eq("id", orderId)
        .select("tracking_number")
        .single();

      if (error) {
        console.error(
          `Error updating order status for Order ${orderId}:`,
          error,
        );
        return NextResponse.json(
          { error: "Failed to update order status", details: error },
          { status: 500 },
        );
      }

      console.log(`Order ${orderId} successfully updated to paid status.`);

      return NextResponse.json({
        success: true,
        trackingNumber: orderData.tracking_number,
      });
    } else {
      return NextResponse.json(
        { error: data.message || "Payment verification failed" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
