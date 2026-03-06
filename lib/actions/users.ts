"use server";

import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/lib/types/database";

/**
 * Links past guest orders and addresses to a newly created account
 * Based on matching the email address.
 */
export async function linkGuestAccountData(email: string, userId: string) {
  if (!email || !userId) {
    return { error: "Email and User ID are required" };
  }

  // We must use the service role key to bypass RLS when updating orders/addresses
  // that currently belong to 'guest' (null user_id)
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const supabaseAdmin = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    // 1. Link Orders
    const { data: updatedOrders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .update({ user_id: userId })
      .eq("customer_email", email)
      .is("user_id", null)
      .select();

    if (ordersError) {
      console.error("Error linking guest orders:", ordersError);
    } else {
      console.log(
        `Successfully linked ${updatedOrders?.length || 0} guest orders to user ${userId}`,
      );
    }

    // 2. Link Addresses (if any were saved during guest checkout)
    // Guest checkouts might not save to 'addresses' table currently, but if we do in the future
    // or if they had an old orphaned address, we link it here.
    // We assume addresses might not have an email column directly, so we might need a different strategy
    // However, if we look at address schema, it doesn't have an email column.

    // To link address from orders:
    // Let's get unique addresses from the linked orders and insert them into the `addresses` table
    if (updatedOrders && updatedOrders.length > 0) {
      // Find the most recent order to extract the address
      const recentOrder = updatedOrders[0];

      // Check if user already has addresses
      const { data: existingAddresses } = await supabaseAdmin
        .from("addresses")
        .select("id")
        .eq("user_id", userId);

      if (!existingAddresses || existingAddresses.length === 0) {
        const addressData = {
          user_id: userId,
          full_name: recentOrder.customer_name,
          phone: recentOrder.customer_phone || "",
          address_line_1: recentOrder.shipping_address,
          address_line_2: null,
          city: recentOrder.shipping_city,
          region: recentOrder.shipping_state,
          country: recentOrder.shipping_country || "Ghana",
          is_default: true,
        };

        const { error: addressError } = await supabaseAdmin
          .from("addresses")
          .insert(addressData);

        if (addressError) {
          console.error(
            "Error creating address from guest order:",
            addressError,
          );
        } else {
          console.log("Successfully created default address from guest order.");
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to link guest data:", error);
    return { error: "Internal server error during data linking" };
  }
}
