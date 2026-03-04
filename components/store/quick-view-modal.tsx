"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SizeSelector } from "@/components/store/size-selector";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice, calculateDiscountedPrice } from "@/lib/constants";
import type { Product, ProductImage } from "@/lib/types/database";

interface QuickViewModalProps {
  product: Product & { product_images: ProductImage[] };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewModal({
  product,
  open,
  onOpenChange,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem } = useCart();

  const primaryImage = product.product_images.find((img) => img.is_primary);
  const imageUrl =
    primaryImage?.image_url || product.product_images[0]?.image_url;

  const hasDiscount = product.discount_percentage > 0;
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.price, product.discount_percentage)
    : product.price;

  const isInStock = product.stock_quantity > 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount_percentage: product.discount_percentage,
      image_url: imageUrl || "",
      size: selectedSize,
      quantity: 1,
      stock_quantity: product.stock_quantity,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Quick View: {product.name}
        </DialogTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-3/4 bg-cream-dark">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.is_new && (
                <Badge className="bg-royal-black text-cream text-[10px] tracking-wider uppercase px-2.5 py-1">
                  New
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-gold text-white text-[10px] tracking-wider uppercase px-2.5 py-1">
                  {product.discount_percentage}% Off
                </Badge>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            {product.fabric_type && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                {product.fabric_type}
              </p>
            )}

            <h2 className="font-serif text-xl leading-tight">{product.name}</h2>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-gold">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Size selector */}
            <SizeSelector
              availableSizes={product.available_sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />

            {/* Add to cart */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize || !isInStock}
              className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase h-12"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {!isInStock
                ? "Out of Stock"
                : !selectedSize
                  ? "Select a Size"
                  : "Add to Cart"}
            </Button>

            {/* View full details link */}
            <Button asChild variant="ghost" className="w-full" size="sm">
              <Link href={`/shop/${product.slug}`}>View Full Details</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
