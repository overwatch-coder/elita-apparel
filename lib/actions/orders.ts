"use server";

import { createClient } from "@/lib/supabase/server";
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

  // 1. Create the order
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
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
      discount_amount: 0,
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
    price: calculateDiscountedPrice(item.price, item.discount_percentage),
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Order items error:", itemsError);
    // Ideally we would roll back the order here, but for simplicity:
    return { error: itemsError.message };
  }

  // 3. If COD, send confirmation email immediately
  if (paymentMethod === "cod") {
    try {
      await sendOrderConfirmation(orderData, orderItems);
    } catch (emailError) {
      console.error("Failed to send COD confirmation email:", emailError);
      // We don't fail the order just because the email failed
    }
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

  return { success: true, orderId: orderData.id };
}
