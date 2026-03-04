"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SizeSelector } from "@/components/store/size-selector";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice, calculateDiscountedPrice, BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProductWithImages } from "@/lib/types/database";
import {
  generateSingleProductMessage,
  encodeWhatsAppUrl,
  generateOrderRef,
} from "@/lib/whatsapp";

interface StickyCartBarProps {
  product: ProductWithImages;
}

export function StickyCartBar({ product }: StickyCartBarProps) {
  const [visible, setVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizes, setShowSizes] = useState(false);
  const { addItem } = useCart();

  const hasDiscount = product.discount_percentage > 0;
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.price, product.discount_percentage)
    : product.price;

  const primaryImage = product.product_images.find((img) => img.is_primary);
  const imageUrl =
    primaryImage?.image_url || product.product_images[0]?.image_url || "";

  const isInStock = product.stock_quantity > 0;

  // Show the bar when user scrolls past the main add-to-cart button
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizes(true);
      return;
    }

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount_percentage: product.discount_percentage,
      image_url: imageUrl,
      size: selectedSize,
      quantity: 1,
      stock_quantity: product.stock_quantity,
    });

    setShowSizes(false);
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      setShowSizes(true);
      return;
    }

    const message = generateSingleProductMessage({
      productName: product.name,
      price: discountedPrice,
      size: selectedSize,
      url: `${BRAND.siteUrl}/product/${product.slug}`,
      orderRef: generateOrderRef(),
    });

    const url = encodeWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    setShowSizes(false);
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      {/* Size selector dropdown */}
      {showSizes && (
        <div className="bg-background border-t border-border px-4 py-3">
          <SizeSelector
            availableSizes={product.available_sizes}
            selectedSize={selectedSize}
            onSelect={(size) => {
              setSelectedSize(size);
              setShowSizes(false);
            }}
          />
        </div>
      )}

      {/* Main bar */}
      <div className="bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gold">
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleWhatsAppOrder}
            disabled={!isInStock}
            size="icon"
            className="bg-[#25D366] hover:bg-[#1DA851] text-white shrink-0 shadow-sm"
          >
            <MessageCircle className="h-5 w-5 fill-current" />
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className="bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase shrink-0"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {!isInStock
              ? "Sold Out"
              : selectedSize
                ? "Add to Cart"
                : "Select Size"}
          </Button>
        </div>
      </div>
    </div>
  );
}
