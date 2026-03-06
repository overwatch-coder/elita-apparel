"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAddressAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const addressData = {
    user_id: user.id,
    full_name: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    address_line_1: formData.get("addressLine1") as string,
    address_line_2: (formData.get("addressLine2") as string) || null,
    city: formData.get("city") as string,
    region: (formData.get("region") as string) || null,
    country: formData.get("country") as string,
    is_default: formData.get("isDefault") === "on",
  };

  const { error } = await supabase.from("addresses").insert(addressData);

  if (error) return { error: error.message };

  revalidatePath("/account/addresses");
  return { success: "Address added successfully" };
}

export async function deleteAddressAction(addressId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id); // extra safety

  if (error) return { error: error.message };

  revalidatePath("/account/addresses");
  return { success: "Address deleted successfully" };
}

export async function setDefaultAddressAction(addressId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/account/addresses");
  return { success: "Default address updated" };
}

export async function updateAddressAction(
  addressId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const addressData = {
    full_name: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    address_line_1: formData.get("addressLine1") as string,
    address_line_2: (formData.get("addressLine2") as string) || null,
    city: formData.get("city") as string,
    region: (formData.get("region") as string) || null,
    country: formData.get("country") as string,
    is_default: formData.get("isDefault") === "on",
  };

  const { error } = await supabase
    .from("addresses")
    .update(addressData)
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/account/addresses");
  return { success: "Address updated successfully" };
}
