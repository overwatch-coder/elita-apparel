"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET = "product-images";

export async function uploadProductImage(
  productId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Invalid file type. Use JPEG, PNG, WebP, or AVIF." };
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File too large. Maximum 5MB." };
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  // Get the current highest position
  const { data: existing } = await supabase
    .from("product_images")
    .select("position")
    .eq("product_id", productId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  // Check if this is the first image (make it primary)
  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  const isPrimary = (count ?? 0) === 0;

  const { error: dbError } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: publicUrl,
    position: nextPosition,
    is_primary: isPrimary,
  });

  if (dbError) {
    // Clean up uploaded file on DB error
    await supabase.storage.from(BUCKET).remove([fileName]);
    return { error: dbError.message };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, url: publicUrl };
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = await createClient();

  // Get the image URL to extract the storage path
  const { data: image } = await supabase
    .from("product_images")
    .select("image_url, is_primary")
    .eq("id", imageId)
    .single();

  if (!image) {
    return { error: "Image not found" };
  }

  // Extract storage path from public URL
  const url = new URL(image.image_url);
  const pathParts = url.pathname.split(`/object/public/${BUCKET}/`);
  if (pathParts.length > 1) {
    await supabase.storage.from(BUCKET).remove([pathParts[1]]);
  }

  // Delete from DB
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  // If we deleted the primary image, make the next one primary
  if (image.is_primary) {
    const { data: remaining } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .order("position")
      .limit(1);

    if (remaining && remaining.length > 0) {
      await supabase
        .from("product_images")
        .update({ is_primary: true })
        .eq("id", remaining[0].id);
    }
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function setPrimaryImage(imageId: string, productId: string) {
  const supabase = await createClient();

  // Unset all primary for this product
  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  // Set the new primary
  const { error } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}
