"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Uploads a file to Supabase storage from a server action.
 * @param bucket - The storage bucket name
 * @param file - The File object from FormData
 * @returns The public URL of the uploaded image
 */
export async function uploadToStorage(bucket: string, file: File) {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
