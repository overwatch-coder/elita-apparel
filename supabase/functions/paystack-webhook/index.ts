/// <reference lib="deno.ns" />
import { serve } from "std/http/server";
import { createClient } from "supabase";
import { SmtpClient } from "smtp";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// SMTP Settings
const SMTP_HOST = Deno.env.get("SMTP_HOST") || "";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";
const SMTP_FROM = Deno.env.get("SMTP_FROM") || `"Elita Apparel" <${SMTP_USER}>`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();

    // 1. Verify Signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(PAYSTACK_SECRET_KEY),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"],
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body),
    );
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      console.error("Invalid Paystack Signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const data = event.data;
      const orderId = data.metadata?.order_id;
      const reference = data.reference;

      if (!orderId) {
        return new Response(
          JSON.stringify({ status: "ignored", message: "No order_id" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const supabaseAdmin = createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
      );

      // 2. Update Order
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          payment_verified: true,
          paystack_reference: reference,
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // 3. Fetch Order for Email
      const { data: order, error: fetchError } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (fetchError) throw fetchError;

      // 4. Send Email via SMTP (Nodemailer equivalent in Deno)
      if (order && SMTP_USER && SMTP_PASS) {
        try {
          const client = new SmtpClient();
          await client.connectTLS({
            hostname: SMTP_HOST,
            port: SMTP_PORT,
            username: SMTP_USER,
            password: SMTP_PASS,
          });

          const trackingNumber =
            order.tracking_number || order.id.slice(0, 8).toUpperCase();
          const formatPriceFunc = (amount: number) => `GH₵${amount.toFixed(2)}`;

          const emailHtml = `
            <!DOCTYPE html>
            <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family: serif; color: #1a1a1a;">
                <div style="max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #e5e5e5;">
                  <h1 style="text-align: center; color: #cab083;">ELITA APPAREL</h1>
                  <h2>Thank You for Your Order!</h2>
                  <p>Order #${trackingNumber} has been successfully verified.</p>
                  <p>Your payment has been received and we are now preparing your items for delivery.</p>
                  <hr style="border: 1px solid #f1f1f1; margin: 30px 0;">
                  <h3>Order Summary</h3>
                  ${order.order_items
                    .map(
                      (item: {
                        product_name: string;
                        quantity: number;
                        price: number;
                      }) => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                      <div>${item.product_name} (x${item.quantity})</div>
                      <div style="font-weight: bold;">${formatPriceFunc(item.price * item.quantity)}</div>
                    </div>
                  `,
                    )
                    .join("")}
                  <div style="text-align: right; font-size: 18px; margin-top: 20px; color: #cab083; font-weight: bold;">
                    Total: ${formatPriceFunc(order.total_amount)}
                  </div>
                  <div style="margin-top: 40px; background: #fdfaf5; padding: 20px;">
                    <strong>Shipping to:</strong><br>
                    ${order.customer_name}<br>
                    ${order.shipping_address}<br>
                    ${order.shipping_city}, ${order.shipping_country}
                  </div>
                  <p style="text-align: center; margin-top: 40px; font-size: 12px; color: #999999;">
                    &copy; ${new Date().getFullYear()} Elita Apparel. Accra, Ghana.
                  </p>
                </div>
              </body>
            </html>
          `;

          await client.send({
            from: SMTP_FROM,
            to: order.customer_email,
            subject: `Order Confirmation #${trackingNumber} - Elita Apparel`,
            content: emailHtml,
            html: emailHtml,
          });

          await client.close();
          console.log("Email sent for order:", orderId);
        } catch (e) {
          console.error(
            "SMTP error:",
            e instanceof Error ? e.message : String(e),
          );
        }
      }

      console.log(`Successfully processed order ${orderId}`);
    }

    return new Response(JSON.stringify({ status: "success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(
      "Function error:",
      err instanceof Error ? err.message : String(err),
    );
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
