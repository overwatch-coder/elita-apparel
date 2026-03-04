import { createClient } from "./server";

export async function uploadImage(
  file: File,
  bucket: string,
  path: string,
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { url: null, error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { url: publicUrl, error: null };
}

export async function deleteImage(
  bucket: string,
  path: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
