"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmation } from "@/lib/mail";
import { calculateDiscountedPrice } from "@/lib/constants";
import { triggerMarketingAutomation } from "@/lib/marketing/triggers";

export async function createOrder(
  formData: any,
  items: any[],
  userId: string | null,
  paymentMethod: string,
) {
  const supabase = await createClient();

  // Generate an 8-character alphanumeric tracking number
  const trackingNumber = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();

  // 1. Create the order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      tracking_number: trackingNumber,
      user_id: userId,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone || null,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_state: formData.state || null,
      shipping_zip: formData.zip || null,
      shipping_country: formData.country,
      total_amount: formData.totalAmount,
      discount_amount: formData.discountAmount || 0,
      discount_code: formData.discountCode || null,
      status: "pending" as const,
      payment_status: "pending" as const,
      payment_method: paymentMethod as any,
      notes: formData.notes || null,
    })
    .select("*")
    .single();

  if (orderError || !orderData) {
    console.error("Order creation error:", orderError);
    return { error: orderError?.message || "Failed to create order" };
  }

  // 2. Create order items
  const orderItems = items.map((item) => ({
    order_id: orderData.id,
    product_id: item.product_id,
    product_name: item.name,
    quantity: item.quantity,
    size: item.size,
    color: item.color || null,
    price: calculateDiscountedPrice(item.price, item.discount_percentage),
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Order items error:", itemsError);
    // Rollback the order
    await supabase.from("orders").delete().eq("id", orderData.id);
    return { error: itemsError.message };
  }

  // 3. Increment discount usage count if a code was used
  if (formData.discountCode) {
    const cleanCode = formData.discountCode.trim().toUpperCase();
    await supabase.rpc("increment_discount_usage", {
      code_to_increment: cleanCode,
    });
    // Fallback if RPC doesn't exist (though RPC is safer for concurrency)
    /*
    const { data: codeData } = await supabase
      .from("discount_codes")
      .select("usage_count")
      .eq("code", cleanCode)
      .single();
    
    if (codeData) {
      await supabase
        .from("discount_codes")
        .update({ usage_count: codeData.usage_count + 1 })
        .eq("code", cleanCode);
    }
    */
  }

  // 4. Send confirmation email immediately for all orders
  try {
    await sendOrderConfirmation(orderData, orderItems);
  } catch (emailError) {
    console.error("Failed to send order confirmation email:", emailError);
    // We don't fail the order just because the email failed
  }

  // 4. Trigger Marketing Automation (Post-Purchase Flow)
  try {
    await triggerMarketingAutomation("order_placed", {
      email: formData.email,
      name: formData.name,
      order_id: orderData.id,
    });
  } catch (triggerErr) {
    console.error("Order automation trigger error:", triggerErr);
  }

  revalidatePath("/admin/orders");
  if (userId) revalidatePath("/account/orders");

  return { success: true, orderId: orderData.id, trackingNumber };
}

export async function getOrderTrackingDetails(
  trackingNumber: string,
  email: string,
) {
  const supabase = await createClient();

  const cleanId = trackingNumber.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  // Validate the inputs exist
  if (!cleanId || !cleanEmail) {
    return { error: "Both tracking number and email are required." };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      payment_status,
      total_amount,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
      tracking_number,
      discount_amount,
      discount_code,
      order_items (
        id,
        product_name,
        quantity,
        size,
        price
      )
    `,
    )
    .eq("tracking_number", cleanId)
    .eq("customer_email", cleanEmail)
    .single();

  if (orderError || !order) {
    return {
      error:
        "Order not found. Please verify your tracking number and email address.",
    };
  }

  return { order };
}
export async function updateOrderPaymentProof(
  orderId: string,
  proofUrl: string,
) {
  try {
    // Determine admin client bypassing RLS since guest users cannot update records
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_proof_url: proofUrl,
        payment_method: "manual_momo" as any,
        payment_status: "pending", // Still pending verification
      })
      .eq("id", orderId);

    if (error) throw error;

    // Send notification to admin (TODO: implement email)
    console.log(`Proof uploaded for order ${orderId}: ${proofUrl}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error updating order proof:", error);
    return { error: error.message };
  }
}
