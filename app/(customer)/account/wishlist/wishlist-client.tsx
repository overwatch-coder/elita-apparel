"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice, calculateDiscountedPrice } from "@/lib/constants";
import { toast } from "sonner";

interface WishlistItem {
  product_id: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_percentage: number;
    stock_quantity: number;
    available_sizes: string[];
    fabric_type: string | null;
    product_images: { image_url: string; is_primary: boolean }[];
  } | null;
}

export function WishlistPageClient({ items }: { items: WishlistItem[] }) {
  const { toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleRemove = async (productId: string) => {
    await toggleWishlist(productId);
    toast.success("Removed from wishlist");
  };

  const handleMoveToCart = (item: WishlistItem) => {
    if (!item.products) return;
    const product = item.products;
    const primaryImage = product.product_images.find((img) => img.is_primary);
    const imageUrl =
      primaryImage?.image_url || product.product_images[0]?.image_url || "";
    const firstSize = product.available_sizes?.[0] || "OS";

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount_percentage: product.discount_percentage,
      image_url: imageUrl,
      size: firstSize,
      quantity: 1,
      stock_quantity: product.stock_quantity,
    });

    toast.success(`${product.name} added to cart (size: ${firstSize})`);
  };

  if (items.length === 0 || items.every((i) => !i.products)) {
    return (
      <div className="text-center py-20">
        <Heart className="h-16 w-16 text-muted-foreground/10 mx-auto mb-6" />
        <h1 className="font-serif text-2xl mb-3 text-foreground">
          Your elegance awaits.
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Save items you love to your wishlist and find them here when
          you&apos;re ready.
        </p>
        <Button
          asChild
          className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
        >
          <Link href="/collections">Explore Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-foreground">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.filter((i) => i.products).length} saved items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          if (!item.products) return null;
          const product = item.products;
          const primaryImage = product.product_images.find(
            (img) => img.is_primary,
          );
          const imageUrl =
            primaryImage?.image_url ||
            product.product_images[0]?.image_url ||
            "";

          const hasDiscount = product.discount_percentage > 0;
          const discountedPrice = hasDiscount
            ? calculateDiscountedPrice(
                product.price,
                product.discount_percentage,
              )
            : product.price;

          return (
            <div
              key={item.product_id}
              className="group bg-card border border-border rounded-lg overflow-hidden"
            >
              <Link
                href={`/shop/${product.slug}`}
                className="block relative aspect-3/4 overflow-hidden"
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </Link>

              <div className="p-4 space-y-3">
                <div>
                  {product.fabric_type && (
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">
                      {product.fabric_type}
                    </p>
                  )}
                  <Link
                    href={`/shop/${product.slug}`}
                    className="font-serif text-base text-foreground hover:text-gold transition-colors leading-tight block"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium text-gold">
                      {formatPrice(discountedPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground/40 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleMoveToCart(item)}
                    disabled={product.stock_quantity === 0}
                    size="sm"
                    className="flex-1 bg-gold hover:bg-gold-dark text-white text-xs tracking-wider uppercase"
                  >
                    <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                    {product.stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
                  </Button>
                  <Button
                    onClick={() => handleRemove(item.product_id)}
                    variant="outline"
                    size="sm"
                    className="border-border text-muted-foreground/50 hover:text-red-400 hover:border-red-400/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
