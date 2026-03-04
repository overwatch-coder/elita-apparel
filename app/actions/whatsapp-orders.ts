"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createWhatsAppOrder(data: {
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  cart_snapshot: any;
  total_amount: number;
  order_ref: string;
}) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  const { error } = await supabase.from("whatsapp_orders").insert({
    user_id: userId || null,
    guest_name: data.guest_name || null,
    guest_email: data.guest_email || null,
    guest_phone: data.guest_phone || null,
    cart_snapshot: data.cart_snapshot,
    total_amount: data.total_amount,
    order_ref: data.order_ref,
    status: "initiated",
  });

  if (error) {
    console.error("Error creating whatsapp order:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateWhatsAppOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("whatsapp_orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/whatsapp-orders");
  return { success: true };
}

export async function convertWhatsAppToOrder(id: string) {
  const supabase = await createClient();

  // 1. Fetch WhatsApp order
  const { data: whatsappOrder, error } = await supabase
    .from("whatsapp_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !whatsappOrder) {
    return { success: false, error: "Order not found" };
  }

  // 2. Insert into orders table
  const orderData = {
    customer_name: whatsappOrder.guest_name || "WhatsApp Customer",
    customer_email: whatsappOrder.guest_email || "whatsapp@elitaapparel.com",
    customer_phone: whatsappOrder.guest_phone || null,
    shipping_address: "TBD via WhatsApp",
    shipping_city: "Accra",
    shipping_country: "Ghana",
    total_amount: whatsappOrder.total_amount,
    status: "paid" as const,
    payment_status: "paid" as const,
    payment_method: "momo" as const,
    user_id: whatsappOrder.user_id,
    notes: `Converted from WhatsApp Order: ${whatsappOrder.order_ref}`,
    payment_verified: true,
  };

  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError || !newOrder) {
    return {
      success: false,
      error: orderError?.message || "Failed to create order",
    };
  }

  // 3. Insert into order_items
  const items = (whatsappOrder.cart_snapshot as any)?.items || [];
  const orderItemsData = items.map((item: any) => ({
    order_id: newOrder.id,
    product_id: item.product_id,
    product_name: item.name,
    quantity: item.quantity,
    size: item.size,
    price: item.price,
  }));

  if (orderItemsData.length > 0) {
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Failed to insert order items:", itemsError);
    }
  }

  // 4. Update WhatsApp order status
  await supabase
    .from("whatsapp_orders")
    .update({ status: "converted" })
    .eq("id", id);

  revalidatePath("/admin/whatsapp-orders");
  revalidatePath("/admin/orders");
  return { success: true };
}
