"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCollection(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("collections").insert({
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    cultural_story: (formData.get("cultural_story") as string) || null,
    is_published: formData.get("is_published") === "true",
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: true };
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("collections")
    .update({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      cultural_story: (formData.get("cultural_story") as string) || null,
      is_published: formData.get("is_published") === "true",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: true };
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").insert({
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status: status as
        | "pending"
        | "paid"
        | "shipped"
        | "delivered"
        | "cancelled",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function createDiscount(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("discount_codes").insert({
    code: (formData.get("code") as string).toUpperCase(),
    percentage: Number(formData.get("percentage")),
    expiry_date: (formData.get("expiry_date") as string) || null,
    is_active: formData.get("is_active") === "true",
    max_uses: formData.get("max_uses")
      ? Number(formData.get("max_uses"))
      : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/discounts");
  return { success: true };
}

export async function deleteDiscount(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("discount_codes").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/discounts");
  return { success: true };
}

export async function toggleDiscount(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("discount_codes")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/discounts");
  return { success: true };
}

export async function updateStock(id: string, quantity: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ stock_quantity: quantity })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { success: true };
}
