import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation } from "@/lib/mail";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: Request) {
  try {
    // Read raw body for HMAC verification
    const textBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 } as any);
    }

    // Verify Paystack Signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(textBody)
      .digest("hex");

    if (hash !== signature) {
      console.error("Invalid Paystack Signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 } as any);
    }

    // Parse the verified payload
    const event = JSON.parse(textBody);

    // We only care about successful charges
    if (event.event === "charge.success") {
      const data = event.data;
      const orderId = data.metadata?.order_id || null;
      const reference = data.reference;

      if (!orderId) {
        console.error("Webhook missing order_id in metadata");
        return NextResponse.json({ status: "success", message: "ignored" });
      }

      // We need to bypass RLS to update the order since this is a server-to-server call
      const supabaseAdmin = createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
      );

      // Verify the amount paid matches the order? We could fetch the order first, but for now we trust Paystack.
      const { error } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          payment_verified: true,
          paystack_reference: reference,
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        console.error("Failed to update order in database:", error);
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 } as any,
        );
      }

      // Fetch order and items to send confirmation email
      const { data: fullOrder } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (fullOrder) {
        try {
          await sendOrderConfirmation(fullOrder, fullOrder.order_items);
        } catch (emailError) {
          console.error(
            "Failed to send digital payment confirmation email:",
            emailError,
          );
        }
      }

      console.log(`Successfully verified and updated order ${orderId}`);
    }

    // Respond with 200 OK to acknowledge receipt
    return NextResponse.json({ status: "success" }, { status: 200 } as any);
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 } as any,
    );
  }
}
