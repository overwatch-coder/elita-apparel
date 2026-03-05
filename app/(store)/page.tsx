import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/store/hero-section";
import { BrandStory } from "@/components/store/brand-story";
import { EarlyBirdBanner } from "@/components/store/early-bird-banner";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
import { CollectionsSection } from "@/components/store/collections-section";
import { FeaturedSection } from "@/components/store/featured-section";
import { InstagramSection } from "@/components/store/instagram-section";
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch collections
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch new arrivals
  const { data: newArrivals } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_published", true)
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch Instagram posts
  const { data: instagramPosts } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // Fetch Instagram limit
  const { data: instagramLimitSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "instagram_feed_limit")
    .single();

  const instagramLimit = parseInt(instagramLimitSetting?.value as string) || 6;

  return (
    <>
      <OrganizationJsonLd />
      <HeroSection />

      {/* Collections Section */}
      <CollectionsSection collections={collections || []} />

      {/* Featured Products */}
      <FeaturedSection
        title="Featured Pieces"
        subtitle="Handpicked selections from our finest collections"
        products={featuredProducts || []}
      />

      {/* Early Bird Banner */}
      <EarlyBirdBanner />

      {/* Brand Story */}
      <BrandStory />

      {/* New Arrivals */}
      <FeaturedSection
        title="New Arrivals"
        subtitle="The latest additions to our collection"
        products={newArrivals || []}
        showViewAll
        viewAllHref="/shop?sort=newest"
      />

      {/* Instagram Section */}
      <InstagramSection posts={instagramPosts || []} limit={instagramLimit} />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </>
  );
}
