import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WishlistPageClient } from "./wishlist-client";

export const metadata = {
  title: "Wishlist | My Account",
};

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch wishlist items with product data
  const { data: wishlistItems } = await supabase
    .from("wishlists")
    .select(
      `
      product_id,
      created_at,
      products:product_id (
        id,
        name,
        slug,
        price,
        discount_percentage,
        stock_quantity,
        available_sizes,
        fabric_type,
        product_images (
          image_url,
          is_primary
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <WishlistPageClient items={wishlistItems || []} />;
}
