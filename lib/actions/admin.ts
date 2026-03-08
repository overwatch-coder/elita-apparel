"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { uploadToStorage } from "./storage";

export async function createCollection(formData: FormData) {
  const supabase = await createClient();

  try {
    let imageUrl = (formData.get("image_url_url") as string) || null;
    const imageFile = formData.get("image_url") as File;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToStorage("product-images", imageFile);
    }

    const { error } = await supabase.from("collections").insert({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: (formData.get("description") as string) || null,
      cultural_story: (formData.get("cultural_story") as string) || null,
      image_url: imageUrl,
      is_published: formData.get("is_published") === "true",
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/collections");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to upload image" };
  }
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient();

  try {
    let imageUrl = (formData.get("image_url_url") as string) || null;
    const imageFile = formData.get("image_url") as File;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToStorage("product-images", imageFile);
    }

    const { error } = await supabase
      .from("collections")
      .update({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: (formData.get("description") as string) || null,
        cultural_story: (formData.get("cultural_story") as string) || null,
        image_url: imageUrl,
        is_published: formData.get("is_published") === "true",
      })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/collections");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to upload image" };
  }
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: true };
}

export async function toggleCollectionPublish(
  id: string,
  isPublished: boolean,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("collections")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/");
  return { success: true };
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  try {
    let imageUrl = (formData.get("image_url_url") as string) || null;
    const imageFile = formData.get("image_url") as File;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToStorage("product-images", imageFile);
    }

    const { error } = await supabase.from("categories").insert({
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      image_url: imageUrl,
    });

    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to upload image" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();

  try {
    let imageUrl = (formData.get("image_url_url") as string) || null;
    const imageFile = formData.get("image_url") as File;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToStorage("product-images", imageFile);
    }

    const { error } = await supabase
      .from("categories")
      .update({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        image_url: imageUrl,
      })
      .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to upload image" };
  }
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

  // Fetch current order to validate payment rules
  const { data: order } = await supabase
    .from("orders")
    .select("status, payment_method, payment_status")
    .eq("id", id)
    .single();

  if (order) {
    const isDigitalPayment =
      order.payment_method === "card" || order.payment_method === "momo";
    const isAdvancing = [
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ].includes(status);

    const isPaid = order.payment_status === "paid" || order.status === "paid";

    if (isDigitalPayment && isAdvancing && !isPaid) {
      return {
        error: "Digital orders (Card/MoMo) cannot be processed until paid.",
      };
    }
  }

  // Supabase enum expects out_for_delivery format
  const dbStatus = status === "out for delivery" ? "out_for_delivery" : status;

  const { error } = await supabase
    .from("orders")
    .update({
      status: dbStatus as
        | "pending"
        | "paid"
        | "processing"
        | "shipped"
        | "out_for_delivery"
        | "delivered"
        | "cancelled",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updatePaymentStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: status as "pending" | "paid" | "failed" | "refunded",
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateTrackingNote(id: string, tracking_note: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ tracking_note })
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

export async function updateContactStatus(id: string, is_read: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function deleteContactMessage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function updateBulkStock(ids: string[], quantity: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ stock_quantity: quantity })
    .in("id", ids);

  if (error) return { error: error.message };

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function markCODCollected(orderId: string, collected: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ delivery_payment_collected: collected })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating COD collected status:", error);
    return { error: "Failed to update collected status" };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return { success: true };
}
