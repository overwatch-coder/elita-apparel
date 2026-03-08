import { NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const NEXT_PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Payment gateway configuration error" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { email, amount, orderId, name, paymentMethod } = body;

    if (!email || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Dynamically get the site URL from headers to handle local ports (3000/3001) correctly
    const origin = req.headers.get("origin") || NEXT_PUBLIC_SITE_URL;

    // Determine channels based on payment method
    let channels = ["card", "bank", "ussd", "qr", "mobile_money"]; // default
    if (paymentMethod === "card") channels = ["card"];
    if (paymentMethod === "momo") channels = ["mobile_money"];

    // Paystack expects amount in pesewas / smallest currency unit
    const amountInPesewas = Math.round(amount * 100);

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amountInPesewas,
          currency: "GHS",
          channels,
          callback_url: `${origin}/checkout/verify?order_id=${orderId}`,
          metadata: {
            order_id: orderId,
            customer_name: name,
            custom_fields: [
              {
                display_name: "Order ID",
                variable_name: "order_id",
                value: orderId,
              },
            ],
          },
        }),
      },
    );

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack API Error:", data.message);
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment" },
        { status: 400 },
      );
    }

    // Return the response data to the client
    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      access_code: data.data.access_code,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
