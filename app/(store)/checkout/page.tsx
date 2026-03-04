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
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import type { Address } from "@/lib/types/database";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setProcessingStatus("processing");

    try {
      const supabase = createClient();

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null, // Link to user if logged in!
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone || null,
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_state: form.state || null,
          shipping_zip: form.zip || null,
          shipping_country: form.country,
          total_amount: totalPrice,
          discount_amount: 0,
          status: "pending" as const,
          payment_status: "pending" as const,
          payment_method: paymentMethod,
          notes: form.notes || null,
        })
        .select("id")
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: calculateDiscountedPrice(item.price, item.discount_percentage),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw new Error(itemsError.message);
      }

      setOrderId(orderData.id);

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
            amount: totalPrice,
            orderId: orderData.id,
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
          <div className="text-center py-16 bg-white/5 border border-cream/10 rounded-xl p-8 shadow-2xl">
            <CheckCircle className="h-20 w-20 text-ghana-green mx-auto mb-6" />
            <h1 className="font-serif text-3xl sm:text-4xl mb-4 text-cream">
              Order Confirmed!
            </h1>
            <p className="text-cream/70 mb-2">
              Thank you for your order. We'll be in touch shortly via
              WhatsApp/Email to coordinate delivery and payment.
            </p>
            <p className="text-sm text-cream/50 mb-8">
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
                  className="border-cream/20 text-cream hover:bg-white/5 tracking-wider uppercase"
                >
                  <Link href={`/account/orders/${orderId}`}>Track Order</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isComplete) {
    return (
      <div className="pt-28 pb-20 min-h-[60vh] flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center">
          <h1 className="font-serif text-3xl mb-4 text-cream">
            No Items to Checkout
          </h1>
          <p className="text-cream/70 mb-8">
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
    <div className="pt-28 pb-20 bg-royal-black text-cream min-h-screen relative">
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
              <div className="bg-white/5 p-6 sm:p-8 rounded-xl border border-cream/10">
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
                    <Label htmlFor="name" className="text-cream/70">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                      placeholder="Kwame Mensah"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-cream/70">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                      placeholder="kwame@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-cream/70">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address" className="text-cream/70">
                      Street Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                      placeholder="12 Independence Avenue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-cream/70">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                      placeholder="Accra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-cream/70">
                      Region/State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                      placeholder="Greater Accra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-cream/70">
                      Postal Code
                    </Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                      placeholder="GA-XXX-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-cream/70">
                      Country *
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 h-12"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes" className="text-cream/70">
                      Order Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="mt-1.5 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50 min-h-[100px]"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white/5 p-6 sm:p-8 rounded-xl border border-cream/10">
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6 p-6 sm:p-8 rounded-xl bg-white/5 border border-cream/10">
                <h2 className="font-serif text-xl">Order Summary</h2>

                <Separator className="bg-cream/10" />

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
                          <p className="font-medium text-cream">{item.name}</p>
                          <p className="text-xs text-cream/60">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-cream">
                          {formatPrice(discountedPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Separator className="bg-cream/10" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/60">Subtotal</span>
                    <span className="text-cream">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/60">Shipping</span>
                    <span className="text-cream/60">Calculated later</span>
                  </div>
                </div>

                <Separator className="bg-cream/10" />

                <div className="flex justify-between">
                  <span className="text-lg font-medium text-cream">Total</span>
                  <span className="text-xl font-bold text-gold">
                    {formatPrice(totalPrice)}
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

                <p className="text-xs text-cream/40 text-center lh-relaxed">
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
