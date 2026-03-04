import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SizeGuidesClient } from "./size-guides-client";

export const metadata = {
  title: "Size Guides | Admin",
};

export default async function AdminSizeGuidesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!admin) redirect("/");

  const { data: guides } = await supabase
    .from("size_guides")
    .select("*")
    .order("title");

  return <SizeGuidesClient guides={guides || []} />;
}
