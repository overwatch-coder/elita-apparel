"use client";

import { useState, useMemo } from "react";
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
import { cn } from "@/lib/utils";
import type { ColorVariant } from "./product-detail-wrapper";

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
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const { addItem } = useCart();

  const colorVariants: ColorVariant[] = Array.isArray(product.color_variants)
    ? (product.color_variants as unknown as ColorVariant[])
    : [];

  const images: ProductImage[] = product.product_images || [];

  // Determine the display image based on selected color
  const imageUrl = useMemo(() => {
    if (selectedColor && selectedColor.image_ids.length > 0) {
      const colorImg = images.find(
        (img) => img.id === selectedColor.image_ids[0],
      );
      if (colorImg) return colorImg.image_url;
    }
    const primaryImage = images.find((img) => img.is_primary);
    return primaryImage?.image_url || images[0]?.image_url;
  }, [selectedColor, images]);

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
      color: selectedColor
        ? `${selectedColor.name} (${selectedColor.hex})`
        : undefined,
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
              <div
                className="text-sm text-muted-foreground line-clamp-3 leading-relaxed prose prose-sm dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Color variants */}
            {colorVariants.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-muted-foreground">Color</span>
                  {selectedColor && (
                    <span className="text-gold">{selectedColor.name}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((color) => {
                    const isSelected = selectedColor?.id === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() =>
                          setSelectedColor(isSelected ? null : color)
                        }
                        className={cn(
                          "h-7 w-7 rounded-full border transition-all p-0.5",
                          isSelected
                            ? "border-gold ring-1 ring-gold/40"
                            : "border-border hover:border-gold/50",
                        )}
                        title={color.name}
                      >
                        <div
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
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
