import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://elitaapparel.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic product pages
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_published", true);

  const productPages: MetadataRoute.Sitemap = (products || []).map(
    (product) => ({
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  // Dynamic collection pages
  const { data: collections } = await supabase
    .from("collections")
    .select("slug, updated_at")
    .eq("is_published", true);

  const collectionPages: MetadataRoute.Sitemap = (collections || []).map(
    (col) => ({
      url: `${SITE_URL}/collections/${col.slug}`,
      lastModified: new Date(col.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  return [...staticPages, ...productPages, ...collectionPages];
}
