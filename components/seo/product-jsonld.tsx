import type { Product, ProductImage } from "@/lib/types/database";

interface ProductJsonLdProps {
  product: Product & { product_images: ProductImage[] };
  url: string;
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const primaryImage = product.product_images.find((img) => img.is_primary);
  const imageUrl =
    primaryImage?.image_url || product.product_images[0]?.image_url;

  const hasDiscount = product.discount_percentage > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: imageUrl || undefined,
    url,
    brand: {
      "@type": "Brand",
      name: "Elita Apparel",
    },
    offers: {
      "@type": "Offer",
      price: discountedPrice.toFixed(2),
      priceCurrency: "GHS",
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
      seller: {
        "@type": "Organization",
        name: "Elita Apparel",
      },
    },
    category: product.fabric_type || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
