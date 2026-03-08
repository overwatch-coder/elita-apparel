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
  const images: ProductImage[] = product.product_images || [];
  const galleryImages =
    selectedColor && selectedColor.image_ids.length > 0
      ? [
          // Show color images first (in their linked order), then the rest
          ...(selectedColor.image_ids
            .map((id) => images.find((img) => img.id === id))
            .filter(Boolean) as ProductImage[]),
          ...images.filter((img) => !selectedColor.image_ids.includes(img.id)),
        ]
      : images;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      <ProductGallery images={galleryImages} productName={product.name} />
      <ProductInfo
        product={product}
        colorVariants={colorVariants}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
    </div>
  );
}
