import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailWrapper } from "@/components/store/product-detail-wrapper";
import { ProductReviews } from "@/components/store/product-reviews";
import { FeaturedSection } from "@/components/store/featured-section";
import { WhatsAppProductSync } from "@/components/store/whatsapp-button";
import { StickyCartBar } from "@/components/store/sticky-cart-bar";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "name, seo_title, seo_description, description, product_images(image_url, is_primary)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

  const primaryImg = product.product_images?.find(
    (img: { is_primary: boolean }) => img.is_primary,
  );
  const ogImage =
    primaryImg?.image_url || product.product_images?.[0]?.image_url;

  return {
    title: product.seo_title || product.name,
    description:
      product.seo_description ||
      product.description?.slice(0, 160) ||
      `Shop ${product.name} at Elita Apparel. Premium African fashion from Accra, Ghana.`,
    openGraph: {
      title: product.seo_title || product.name,
      description:
        product.seo_description ||
        product.description?.slice(0, 160) ||
        undefined,
      images: ogImage
        ? [{ url: ogImage, width: 800, height: 1067 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo_title || product.name,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch product with images, category, and collection
  const { data: product } = await supabase
    .from("products")
    .select(
      "*, product_images(*), category:categories(*), collection:collections(*)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_published", true)
    .eq("category_id", product.category_id!)
    .neq("id", product.id)
    .limit(4);

  return (
    <>
      <ProductJsonLd
        product={product}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://elitaapparel.com"}/shop/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: product.name, href: `/shop/${slug}` },
        ]}
      />
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/" className="hover:text-gold transition-colors">
                  Home
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/shop" className="hover:text-gold transition-colors">
                  Shop
                </a>
              </li>
              <li>/</li>
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>

          {/* Product layout — gallery + info share color state via wrapper */}
          <ProductDetailWrapper product={product} />

          {/* Reviews */}
          <div className="mt-16">
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <FeaturedSection
          title="You May Also Like"
          subtitle="Similar pieces from our collection"
          products={relatedProducts}
        />
      )}

      <StickyCartBar product={product} />
      <WhatsAppProductSync productName={product.name} />
    </>
  );
}
