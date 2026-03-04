"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice, calculateDiscountedPrice } from "@/lib/constants";
import { toast } from "sonner";
import type { Metadata } from "next";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageCircle } from "lucide-react";
import { GuestInfoModal } from "@/components/whatsapp/guest-info-modal";
import { createWhatsAppOrder } from "@/app/actions/whatsapp-orders";
import {
  generateCartMessage,
  encodeWhatsAppUrl,
  generateOrderRef,
} from "@/lib/whatsapp";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    discountCode,
    discountPercentage,
    setDiscount,
  } = useCart();
  const [discountInput, setDiscountInput] = useState("");
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isProcessingWhatsApp, setIsProcessingWhatsApp] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleWhatsAppCheckout = async (
    guestName?: string,
    guestPhone?: string,
    guestEmail?: string,
  ) => {
    setIsProcessingWhatsApp(true);
    try {
      const orderRef = generateOrderRef();
      const cartSnapshot = { items };

      const { success, error } = await createWhatsAppOrder({
        guest_name: guestName || user?.user_metadata?.full_name,
        guest_email: guestEmail || user?.email,
        guest_phone: guestPhone || user?.user_metadata?.phone,
        cart_snapshot: cartSnapshot,
        total_amount: finalTotal,
        order_ref: orderRef,
      });

      if (!success) throw new Error(error);

      const message = generateCartMessage({
        items,
        totalAmount: finalTotal,
        orderRef,
        customerName: guestName || user?.user_metadata?.full_name,
        customerPhone: guestPhone || user?.user_metadata?.phone,
      });

      const url = encodeWhatsAppUrl(message);
      clearCart();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast.error("Failed to process WhatsApp order: " + e.message);
    } finally {
      setIsProcessingWhatsApp(false);
      setIsWhatsAppModalOpen(false);
    }
  };

  const onWhatsAppCheckoutClick = () => {
    if (user) {
      handleWhatsAppCheckout();
    } else {
      setIsWhatsAppModalOpen(true);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setIsApplyingCode(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", discountInput.toUpperCase().trim())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast.error("Invalid or expired discount code");
        setDiscount("", 0);
        return;
      }

      const discount = data;

      // Check expiry
      setDiscount(discount.code, discount.percentage);
      toast.success(`Discount code applied: ${discount.percentage}% off`);
    } catch {
      toast.error("Failed to apply discount code");
    } finally {
      setIsApplyingCode(false);
    }
  };

  const discountAmount = totalPrice * (discountPercentage / 100);
  const finalTotal = totalPrice - discountAmount;

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center py-20">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
            <h1 className="font-serif text-3xl mb-3">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Discover our premium African fashion collection
            </p>
            <Button
              asChild
              className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
              size="lg"
            >
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Your Cart</h1>
          <p className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const discountedPrice = calculateDiscountedPrice(
                item.price,
                item.discount_percentage,
              );

              return (
                <div
                  key={`${item.product_id}-${item.size}`}
                  className="flex gap-4 sm:gap-6 p-4 rounded-lg bg-card border border-border/50"
                >
                  <Link
                    href={`/shop/${item.slug}`}
                    className="relative shrink-0 w-24 h-32 sm:w-32 sm:h-40 rounded-md overflow-hidden bg-cream-dark"
                  >
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-serif text-base sm:text-lg hover:text-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Size: {item.size}
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive ml-2"
                          onClick={() => removeItem(item.product_id, item.size)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <span className="font-semibold text-gold">
                          {formatPrice(discountedPrice * item.quantity)}
                        </span>
                        {item.discount_percentage > 0 && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/shop">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6 p-6 rounded-lg bg-card border border-border/50">
              <h2 className="font-serif text-xl">Order Summary</h2>

              <Separator />

              {/* Discount code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="h-10"
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={isApplyingCode || !discountInput.trim()}
                    variant="outline"
                    className="h-10 border-gold/50 hover:bg-gold/5 text-gold shrink-0"
                  >
                    {isApplyingCode ? "..." : "Apply"}
                  </Button>
                </div>
                {discountPercentage > 0 && (
                  <p className="text-xs text-ghana-green">
                    {discountPercentage}% discount applied
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-ghana-green">Discount</span>
                    <span className="text-ghana-green">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold text-gold">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <Button
                asChild
                className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase h-14 text-base mt-2"
                size="lg"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                onClick={onWhatsAppCheckoutClick}
                disabled={isProcessingWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-medium tracking-wider uppercase h-14 text-base shadow-sm mt-3"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5 fill-current" />
                {isProcessingWhatsApp
                  ? "Processing..."
                  : "Checkout via WhatsApp"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <GuestInfoModal
        isOpen={isWhatsAppModalOpen}
        onOpenChange={setIsWhatsAppModalOpen}
        onSubmit={handleWhatsAppCheckout}
      />
    </div>
  );
}
