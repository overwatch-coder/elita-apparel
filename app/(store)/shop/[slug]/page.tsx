import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductInfo } from "@/components/store/product-info";
import { FeaturedSection } from "@/components/store/featured-section";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
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
    .select("name, seo_title, seo_description, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!product) {
    return { title: "Product Not Found" };
  }

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

          {/* Product layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Gallery */}
            <ProductGallery
              images={product.product_images}
              productName={product.name}
            />

            {/* Info */}
            <ProductInfo product={product} />
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

      <WhatsAppButton />
    </>
  );
}
