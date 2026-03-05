"use server";

import { createClient } from "@/lib/supabase/server";

export async function validateDiscountCode(code: string, email?: string) {
  const supabase = await createClient();

  const cleanCode = code.trim().toUpperCase();

  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    // Match code directly. In Supabase, if we created it uppercase, this works
    .eq("code", cleanCode)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return { error: "Invalid or inactive discount code" };
  }

  // Check expiry
  if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
    return { error: "This discount code has expired" };
  }

  // Check usage limit
  if (data.max_uses && data.usage_count >= data.max_uses) {
    return { error: "This discount code has reached its usage limit" };
  }

  // Check if this user (email) has already used this code
  if (email) {
    const { count, error: orderError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("customer_email", email.trim().toLowerCase())
      .eq("discount_code", cleanCode);

    if (orderError) {
      console.error("Error checking discount usage in orders:", orderError);
    } else if (count && count > 0) {
      return { error: "You have already used this discount code." };
    }
  }

  return { percentage: data.percentage };
}

export async function getDiscountCodes() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { codes: data };
}

export async function createDiscountCode(formData: {
  code: string;
  percentage: number;
  expiry_date?: string | null;
  max_uses?: number | null;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discount_codes")
    .insert({
      code: formData.code.toUpperCase(),
      percentage: formData.percentage,
      expiry_date: formData.expiry_date,
      max_uses: formData.max_uses,
      is_active: true,
      usage_count: 0,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function toggleDiscountCode(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("discount_codes")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
