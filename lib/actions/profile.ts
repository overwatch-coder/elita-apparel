"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;

  if (!fullName) {
    return { error: "Full name is required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // First verify profile exists, and handle it
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profile) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
      })
      .eq("id", user.id);

    if (updateError) {
      return { error: updateError.message };
    }
  } else {
    // If trigger failed, insert manually
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      full_name: fullName,
      phone: phone || null,
      role: "customer",
    });

    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");

  return { success: "Profile updated successfully" };
}
