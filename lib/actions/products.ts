"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const productData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    cultural_story: (formData.get("cultural_story") as string) || null,
    price: Number(formData.get("price")),
    discount_percentage: Number(formData.get("discount_percentage") || 0),
    category_id: (formData.get("category_id") as string) || null,
    collection_id: (formData.get("collection_id") as string) || null,
    fabric_type: (formData.get("fabric_type") as string) || null,
    available_sizes: formData.getAll("sizes") as string[],
    is_featured: formData.get("is_featured") === "true",
    is_new: formData.get("is_new") === "true",
    early_bird_eligible: formData.get("early_bird_eligible") === "true",
    stock_quantity: Number(formData.get("stock_quantity") || 0),
    is_published: formData.get("is_published") === "true",
    seo_title: (formData.get("seo_title") as string) || null,
    seo_description: (formData.get("seo_description") as string) || null,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { data };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const productData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || null,
    cultural_story: (formData.get("cultural_story") as string) || null,
    price: Number(formData.get("price")),
    discount_percentage: Number(formData.get("discount_percentage") || 0),
    category_id: (formData.get("category_id") as string) || null,
    collection_id: (formData.get("collection_id") as string) || null,
    fabric_type: (formData.get("fabric_type") as string) || null,
    available_sizes: formData.getAll("sizes") as string[],
    is_featured: formData.get("is_featured") === "true",
    is_new: formData.get("is_new") === "true",
    early_bird_eligible: formData.get("early_bird_eligible") === "true",
    stock_quantity: Number(formData.get("stock_quantity") || 0),
    is_published: formData.get("is_published") === "true",
    seo_title: (formData.get("seo_title") as string) || null,
    seo_description: (formData.get("seo_description") as string) || null,
  };

  const { error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}

export async function toggleProductPublished(id: string, isPublished: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: true };
}
