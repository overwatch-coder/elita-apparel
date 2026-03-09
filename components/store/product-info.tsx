"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SizeSelector } from "@/components/store/size-selector";
import { SizeGuideModal } from "@/components/store/size-guide-modal";
import { WishlistButton } from "@/components/store/wishlist-button";
import { useCart } from "@/components/cart/cart-provider";
import {
  formatPrice,
  calculateDiscountedPrice,
  SOCIALS,
  BRAND,
} from "@/lib/constants";
import type { ProductWithImages } from "@/lib/types/database";
import {
  generateSingleProductMessage,
  encodeWhatsAppUrl,
  generateOrderRef,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { ColorVariant } from "./product-detail-wrapper";

interface ProductInfoProps {
  product: ProductWithImages;
  colorVariants?: ColorVariant[];
  selectedColor?: ColorVariant | null;
  onColorSelect?: (color: ColorVariant | null) => void;
}

export function ProductInfo({
  product,
  colorVariants = [],
  selectedColor = null,
  onColorSelect,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const hasDiscount = product.discount_percentage > 0;
  const discountedPrice = hasDiscount
    ? calculateDiscountedPrice(product.price, product.discount_percentage)
    : product.price;

  const primaryImage = product.product_images.find((img) => img.is_primary);
  const imageUrl =
    primaryImage?.image_url || product.product_images[0]?.image_url || "";

  // If a color is selected and has linked images, use the first of those as the cart image
  const cartImageUrl =
    selectedColor && selectedColor.image_ids.length > 0
      ? (product.product_images.find(
          (img) => img.id === selectedColor.image_ids[0],
        )?.image_url ?? imageUrl)
      : imageUrl;

  const isInStock = product.stock_quantity > 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  // Parse features
  const features: { id: string; text: string }[] = Array.isArray(
    product.features,
  )
    ? (product.features as any[]).map((f: any) =>
        typeof f === "string" ? { id: f, text: f } : f,
      )
    : [];

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discount_percentage: product.discount_percentage,
      image_url: cartImageUrl,
      size: selectedSize,
      color: selectedColor
        ? `${selectedColor.name} (${selectedColor.hex})`
        : undefined,
      quantity,
      stock_quantity: product.stock_quantity,
    });
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize) return;

    const colorNote = selectedColor ? ` | Color: ${selectedColor.name}` : "";
    const message = generateSingleProductMessage({
      productName: product.name + colorNote,
      price: discountedPrice,
      size: selectedSize,
      url: `${BRAND.siteUrl}/product/${product.slug}`,
      orderRef: generateOrderRef(),
    });

    const url = encodeWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const whatsappUrl = `${SOCIALS.whatsapp.url}?text=${encodeURIComponent(
    `Hi! I'm interested in the ${product.name}. Can you provide more details?`,
  )}`;

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.is_new && (
          <Badge className="bg-foreground text-background text-[10px] tracking-wider uppercase">
            New Arrival
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-primary text-primary-foreground text-[10px] tracking-wider uppercase">
            {product.discount_percentage}% Off
          </Badge>
        )}
        {product.early_bird_eligible && (
          <Badge className="bg-primary/80 text-primary-foreground text-[10px] tracking-wider uppercase">
            Early Bird
          </Badge>
        )}
      </div>

      {/* Category & fabric */}
      <div>
        {product.fabric_type && (
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">
            {product.fabric_type}
            {product.category && ` · ${product.category.name}`}
          </p>
        )}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight">
          {product.name}
        </h1>
        <WishlistButton
          productId={product.id}
          variant="full"
          className="mt-2"
        />
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-gold">
          {formatPrice(discountedPrice)}
        </span>
        {hasDiscount && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div
          className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      {/* Features list */}
      {features.length > 0 && (
        <ul className="space-y-1.5">
          {features.map((feat) => (
            <li
              key={feat.id}
              className="flex items-start gap-2 text-sm text-foreground/80"
            >
              <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>{feat.text}</span>
            </li>
          ))}
        </ul>
      )}

      <Separator />

      {/* Color swatches */}
      {colorVariants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Color</span>
            {selectedColor && (
              <span className="text-sm text-muted-foreground">
                — {selectedColor.name}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((color) => {
              const isSelected = selectedColor?.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.name}
                  onClick={() => onColorSelect?.(isSelected ? null : color)}
                  className={cn(
                    "h-9 w-9 rounded-full border-2 transition-all shadow-sm hover:scale-110 focus:outline-none",
                    isSelected
                      ? "border-gold ring-2 ring-gold/40 scale-110"
                      : "border-border/50 hover:border-gold/50",
                  )}
                  style={{ backgroundColor: color.hex }}
                  aria-pressed={isSelected}
                  aria-label={color.name}
                />
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

      {/* Size guide link */}
      {(product as any).size_guide_id && (
        <SizeGuideModal sizeGuideId={(product as any).size_guide_id} />
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() =>
              setQuantity(Math.min(product.stock_quantity, quantity + 1))
            }
            disabled={quantity >= product.stock_quantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stock status */}
      <div>
        {isLowStock ? (
          <p className="text-sm text-destructive">
            Only {product.stock_quantity} left in stock
          </p>
        ) : isInStock ? (
          <p className="text-sm text-ghana-green">In stock</p>
        ) : (
          <p className="text-sm text-destructive">Out of stock</p>
        )}
      </div>

      {/* Add to cart / Order via WhatsApp buttons */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedSize || !isInStock}
            className="flex-1 bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase h-14 text-base"
            size="lg"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {!selectedSize ? "Select a Size" : "Add to Cart"}
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-gold/30 hover:border-gold hover:bg-gold/5 h-14"
          >
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Inquire
            </Link>
          </Button>
        </div>

        <Button
          onClick={handleWhatsAppOrder}
          disabled={!selectedSize || !isInStock}
          className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-medium tracking-wider uppercase h-14 text-base shadow-sm"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5 fill-current" />
          {!selectedSize ? "Select a Size" : "Order via WhatsApp"}
        </Button>
      </div>

      {/* Shipping info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Truck className="h-4 w-4" />
        <span>Shipping calculated at checkout</span>
      </div>

      {/* Cultural story */}
      {product.cultural_story && (
        <div className="mt-8 p-6 rounded-lg bg-cream-dark dark:bg-royal-black/50 border border-gold/10">
          <h3 className="font-serif text-lg mb-3 text-gold">
            Cultural Inspiration
          </h3>
          <div
            className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.cultural_story }}
          />
        </div>
      )}

      {/* Value proposition */}
      <div className="p-6 rounded-lg bg-secondary/50 border border-border/50">
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          &ldquo;Each garment reflects premium fabrics, expert tailoring, and
          detailed finishing.&rdquo;
        </p>
      </div>
    </div>
  );
}
