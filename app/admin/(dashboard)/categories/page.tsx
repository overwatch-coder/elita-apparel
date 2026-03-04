import { createClient } from "@/lib/supabase/server";
import { CategoriesClient } from "@/components/admin/categories-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories | Admin" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return <CategoriesClient categories={categories || []} />;
}
