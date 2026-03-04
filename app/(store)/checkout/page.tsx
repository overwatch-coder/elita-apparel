"use client";

import { useState } from "react";
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
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone || null,
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_state: form.state || null,
          shipping_zip: form.zip || null,
          shipping_country: form.country,
          total_amount: totalPrice,
          discount_code: null,
          discount_amount: 0,
          status: "pending" as const,
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
      setIsComplete(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete && orderId) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <div className="text-center py-16">
            <CheckCircle className="h-20 w-20 text-ghana-green mx-auto mb-6" />
            <h1 className="font-serif text-3xl sm:text-4xl mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order. We&apos;ll be in touch shortly.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order ID:{" "}
              <span className="font-mono text-foreground">
                {orderId.slice(0, 8).toUpperCase()}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isComplete) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl text-center py-16">
          <h1 className="font-serif text-3xl mb-4">No Items to Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart first.
          </p>
          <Button asChild className="bg-gold hover:bg-gold-dark text-white">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
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
              <div>
                <h2 className="font-serif text-xl mb-6">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                      placeholder="Ama Mensah"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                      placeholder="ama@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      className="mt-1.5"
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                      placeholder="12 Independence Avenue"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                      placeholder="Accra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Region/State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="mt-1.5"
                      placeholder="Greater Accra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      className="mt-1.5"
                      placeholder="GA-XXX-XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Order Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="mt-1.5"
                      placeholder="Any special instructions..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6 p-6 rounded-lg bg-card border border-border/50">
                <h2 className="font-serif text-xl">Order Summary</h2>

                <Separator />

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
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span>
                          {formatPrice(discountedPrice * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground">Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-xl font-bold text-gold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase h-14 text-base"
                  size="lg"
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

                <p className="text-[10px] text-muted-foreground text-center">
                  Payment integration coming soon. Orders will be confirmed via
                  WhatsApp/Email.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
