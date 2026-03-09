"use client";

import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { ProductInfo } from "./product-info";
import type { ProductImage } from "@/lib/types/database";

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image_ids: string[];
}

export interface ProductDetailWrapperProps {
  product: any; // full product with images
}

export function ProductDetailWrapper({ product }: ProductDetailWrapperProps) {
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);

  const colorVariants: ColorVariant[] = Array.isArray(product.color_variants)
    ? (product.color_variants as ColorVariant[])
    : [];

  // Build filtered/sorted images for the gallery based on selected color
  const baseImages: ProductImage[] = [...(product.product_images || [])].sort(
    (a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return a.position - b.position;
    },
  );

  const activeImageId =
    selectedColor && selectedColor.image_ids.length > 0
      ? selectedColor.image_ids[0]
      : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <ProductGallery
        images={baseImages}
        productName={product.name}
        activeImageId={activeImageId}
      />
      <ProductInfo
        product={product}
        colorVariants={colorVariants}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
    </div>
  );
}
