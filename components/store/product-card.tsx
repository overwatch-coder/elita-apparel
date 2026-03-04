"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { QuickViewModal } from "@/components/store/quick-view-modal";
import { WishlistButton } from "@/components/store/wishlist-button";
import { formatPrice, calculateDiscountedPrice } from "@/lib/constants";
import type { Product, ProductImage } from "@/lib/types/database";

interface ProductCardProps {
  product: Product & { product_images: ProductImage[] };
}

export function ProductCard({ product }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const primaryImage = product.product_images.find((img) => img.is_primary);
  const imageUrl =
    primaryImage?.image_url || product.product_images[0]?.image_url;

  const hasDiscount = product.discount_percentage > 0;
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.price, product.discount_percentage)
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block">
        {/* Image container */}
        <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-cream-dark mb-4">
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
          <div className="absolute inset-0 bg-royal-black/0 group-hover:bg-royal-black/20 transition-all duration-500" />

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

          {/* Quick view button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="w-full bg-white/95 backdrop-blur-sm rounded-md py-2.5 text-center flex items-center justify-center gap-2 hover:bg-white transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-royal-black" />
              <span className="text-xs tracking-widest uppercase text-royal-black font-medium">
                Quick View
              </span>
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-1.5">
          {product.fabric_type && (
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {product.fabric_type}
            </p>
          )}
          <h3 className="font-serif text-base sm:text-lg text-foreground group-hover:text-gold transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gold">
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
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
