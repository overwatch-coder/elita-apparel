"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "All required fields must be filled out." };
  }

  const { error } = await supabase.from("contact_messages").insert({
    full_name: name,
    email,
    phone: phone || null,
    subject,
    message,
    is_read: false,
  });

  if (error) {
    console.error("Contact form error:", error);
    return { error: "Failed to send message. Please try again later." };
  }

  return { success: true };
}
