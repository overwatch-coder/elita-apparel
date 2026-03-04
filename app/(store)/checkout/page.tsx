"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-provider";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, calculateDiscountedPrice } from "@/lib/constants";
import {
  PaymentMethodSelector,
  type PaymentMethod,
} from "@/components/checkout/payment-method-selector";
import { PaymentProcessingModal } from "@/components/checkout/payment-processing-modal";
import { TrustBadges } from "@/components/checkout/trust-badges";
import { GuestAccountPrompt } from "@/components/checkout/guest-account-prompt";
import { createOrder } from "@/lib/actions/orders";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import type { Address } from "@/lib/types/database";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, discountCode, discountPercentage, clearCart } =
    useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const [user, setUser] = useState<User | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Ghana",
    notes: "",
  });

  const discountAmount = totalPrice * (discountPercentage / 100);
  const finalTotal = totalPrice - discountAmount;

  // Load user data and pre-fill default address
  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Fetch default address
        const { data: addressData } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .single();

        setForm((prev) => ({
          ...prev,
          email: user.email || "",
          name: addressData?.full_name || prev.name,
          phone: addressData?.phone || prev.phone,
          address: addressData
            ? `${addressData.address_line_1} ${addressData.address_line_2 || ""}`.trim()
            : prev.address,
          city: addressData?.city || prev.city,
          state: addressData?.region || prev.state,
        }));
      }
      setIsDataLoaded(true);
    }

    loadUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setProcessingStatus("processing");

    try {
      const result = await createOrder(
        {
          ...form,
          totalAmount: finalTotal,
          discountAmount,
          discountCode,
        },
        items,
        user?.id || null,
        paymentMethod,
      );

      if (result.error) {
        throw new Error(result.error);
      }

      setOrderId(result.orderId!);

      if (paymentMethod === "cod") {
        setProcessingStatus("success");
        clearCart();

        // Allow animation to play before transitioning
        setTimeout(() => {
          setIsComplete(true);
          setProcessingStatus("idle");
          setIsSubmitting(false);
        }, 2500);
      } else {
        // Handle Card or MoMo via Paystack
        const response = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            amount: finalTotal,
            orderId: result.orderId,
            name: form.name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Payment initialization failed");
        }

        // Redirect to Paystack
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
      setProcessingStatus("error");
      setIsSubmitting(false);
    }
  };

  if (!isDataLoaded && items.length > 0 && !isComplete) {
    return (
      <div className="pt-28 pb-20 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (isComplete && orderId) {
    return (
      <div className="pt-28 pb-20 min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div className="text-center py-16 bg-card border border-border rounded-xl p-8 shadow-sm">
            <CheckCircle className="h-20 w-20 text-ghana-green mx-auto mb-6" />
            <h1 className="font-serif text-3xl sm:text-4xl mb-4 text-foreground">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order. We'll be in touch shortly via
              WhatsApp/Email to coordinate delivery and payment.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order ID:{" "}
              <span className="font-mono text-gold font-medium">
                {orderId.slice(0, 8).toUpperCase()}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              {user && (
                <Button
                  asChild
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent tracking-wider uppercase"
                >
                  <Link href={`/account/orders/${orderId}`}>Track Order</Link>
                </Button>
              )}
            </div>

            {/* Guest account prompt */}
            {!user && (
              <GuestAccountPrompt email={form.email} name={form.name} />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isComplete) {
    return (
      <div className="pt-28 pb-20 min-h-[60vh] flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
          <h1 className="font-serif text-3xl mb-4 text-foreground">
            No Items to Checkout
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart first.
          </p>
          <Button
            asChild
            className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
          >
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-background text-foreground min-h-screen relative">
      <PaymentProcessingModal
        isOpen={processingStatus !== "idle"}
        status={processingStatus}
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Checkout</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Shipping form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card p-6 sm:p-8 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl">Shipping Information</h2>
                  {!user && (
                    <Link
                      href="/login"
                      className="text-sm text-gold hover:text-gold-light transition-colors"
                    >
                      Have an account? Log in
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name" className="text-muted-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                      placeholder="Kwame Mensah"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-muted-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                      placeholder="kwame@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-muted-foreground">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address" className="text-muted-foreground">
                      Street Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                      placeholder="12 Independence Avenue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-muted-foreground">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                      placeholder="Accra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-muted-foreground">
                      Region/State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                      placeholder="Greater Accra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-muted-foreground">
                      Postal Code
                    </Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                      placeholder="GA-XXX-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-muted-foreground">
                      Country *
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 h-12"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes" className="text-muted-foreground">
                      Order Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="mt-1.5 bg-background border-border text-foreground focus-visible:ring-gold/50 min-h-[100px]"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-card p-6 sm:p-8 rounded-xl border border-border">
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6 p-6 sm:p-8 rounded-xl bg-card border border-border">
                <h2 className="font-serif text-xl">Order Summary</h2>

                <Separator className="bg-border/20" />

                <div className="space-y-4">
                  {items.map((item) => {
                    const discountedPrice = calculateDiscountedPrice(
                      item.price,
                      item.discount_percentage,
                    );
                    return (
                      <div
                        key={`${item.product_id}-${item.size}`}
                        className="flex justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs text-foreground/60">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-foreground">
                          {formatPrice(discountedPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-border/20" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Subtotal</span>
                    <span className="text-foreground">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-ghana-green">
                        Discount ({discountCode})
                      </span>
                      <span className="text-ghana-green">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Shipping</span>
                    <span className="text-foreground/60">Calculated later</span>
                  </div>
                </div>

                <Separator className="bg-border/20" />

                <div className="flex justify-between">
                  <span className="text-lg font-medium text-foreground">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gold">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase h-14 text-base mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <TrustBadges />

                <p className="text-xs text-foreground/40 text-center lh-relaxed">
                  By placing your order, you agree to our terms of service and
                  policies. A representative will contact you shortly to confirm
                  arrangements.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
