"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, ShoppingBag, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuickViewModal } from "@/components/store/quick-view-modal";
import { WishlistButton } from "@/components/store/wishlist-button";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscountedPrice } from "@/lib/constants";
import type { Product, ProductImage } from "@/lib/types/database";

interface ProductCardProps {
  product: Product & { product_images: ProductImage[] };
  view?: "grid" | "list";
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const primaryImage = product.product_images.find((img) => img.is_primary);
  const imageUrl =
    primaryImage?.image_url || product.product_images[0]?.image_url;

  const hasDiscount = product.discount_percentage > 0;
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.price, product.discount_percentage)
    : product.price;

  const { items, updateQuantity } = useCart();
  const cartItems = items.filter((i) => i.product_id === product.id);
  const totalInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className={cn(
          "group block",
          view === "list" &&
            "flex flex-col sm:flex-row gap-6 bg-card border border-border/50 rounded-xl overflow-hidden hover:border-gold/30 transition-colors",
        )}
      >
        {/* Image container */}
        <div
          className={cn(
            "relative overflow-hidden bg-cream-dark",
            view === "list"
              ? "w-full sm:w-1/3 aspect-square sm:aspect-3/4 shrink-0"
              : "aspect-3/4 rounded-lg mb-4",
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-dark/50">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
                  <span className="font-serif text-gold text-xl italic">
                    EA
                  </span>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-gold/40">
                  Coming Soon
                </p>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <Badge className="bg-foreground text-background text-[10px] tracking-wider uppercase px-2.5 py-1">
                New
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="bg-gold text-white text-[10px] tracking-wider uppercase px-2.5 py-1">
                {product.discount_percentage}% Off
              </Badge>
            )}
            {product.early_bird_eligible && !hasDiscount && (
              <Badge className="bg-gold/80 text-white text-[10px] tracking-wider uppercase px-2.5 py-1">
                Early Bird
              </Badge>
            )}
          </div>

          {/* Wishlist button */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton productId={product.id} />
          </div>

          {/* Add to Cart / Quantity button - Moved for LIst View */}
          {view === "grid" && (
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {totalInCart > 0 ? (
                <div
                  className="w-full bg-background/95 backdrop-blur-sm rounded-md py-1.5 px-3 flex items-center justify-between shadow-lg border border-border/50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button
                    onClick={() => {
                      const item = cartItems[0];
                      updateQuantity(
                        item.product_id,
                        item.size,
                        item.quantity - 1,
                      );
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-muted text-foreground transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-foreground text-sm">
                    {totalInCart}
                  </span>
                  <button
                    onClick={() => {
                      const item = cartItems[0];
                      updateQuantity(
                        item.product_id,
                        item.size,
                        item.quantity + 1,
                      );
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-muted text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuickViewOpen(true);
                  }}
                  className="w-full bg-background/95 backdrop-blur-sm rounded-md py-2.5 text-center flex items-center justify-center gap-2 hover:bg-background transition-colors text-foreground shadow-lg border border-border/50"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span className="text-xs tracking-widest uppercase font-medium">
                    Add to Cart
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product info */}
        <div
          className={cn(
            "space-y-4",
            view === "list"
              ? "p-6 sm:p-10 flex flex-col justify-center flex-1"
              : "mt-4",
          )}
        >
          <div className="space-y-1.5">
            {product.fabric_type && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold">
                {product.fabric_type}
              </p>
            )}
            <h3 className="font-serif text-lg sm:text-xl text-foreground group-hover:text-gold transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground text-lg">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {view === "list" && product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-4 max-w-xl">
                {product.description}
              </p>
            )}
          </div>

          {view === "list" && (
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {totalInCart > 0 ? (
                <div
                  className="w-40 bg-accent/20 rounded-md py-2 px-4 flex items-center justify-between border border-border/50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button
                    onClick={() => {
                      const item = cartItems[0];
                      updateQuantity(
                        item.product_id,
                        item.size,
                        item.quantity - 1,
                      );
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-accent/40 text-foreground transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-foreground">
                    {totalInCart}
                  </span>
                  <button
                    onClick={() => {
                      const item = cartItems[0];
                      updateQuantity(
                        item.product_id,
                        item.size,
                        item.quantity + 1,
                      );
                    }}
                    className="h-8 w-8 flex items-center justify-center rounded-sm hover:bg-accent/40 text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Button
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuickViewOpen(true);
                  }}
                  className="bg-gold hover:bg-gold-dark text-white px-8"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
              <Button
                variant="outline"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickViewOpen(true);
                }}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </div>
          )}
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </motion.div>
  );
}
