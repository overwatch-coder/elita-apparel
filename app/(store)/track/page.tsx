"use client";

import { useState } from "react";
import { getOrderTrackingDetails } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/constants";
import { format } from "date-fns";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
  AlertCircle,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!trackingId.trim() || !email.trim()) return;

    setIsLoading(true);
    setError("");
    setOrder(null);

    const result = await getOrderTrackingDetails(trackingId, email);

    if (result.error) {
      setError(result.error);
    } else {
      setOrder(result.order);
    }

    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "processing":
        return Clock;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle2;
      case "cancelled":
        return AlertCircle;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "processing":
        return "text-gold bg-gold/10";
      case "shipped":
        return "text-blue-500 bg-blue-500/10";
      case "delivered":
        return "text-ghana-green bg-ghana-green/10";
      case "cancelled":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const StatusIcon = order ? getStatusIcon(order.status) : Package;

  return (
    <div className="min-h-[80vh] px-4 pt-24 pb-10 mt-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header section */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-4xl text-foreground">
            Track Your Order
          </h1>
          <p className="text-muted-foreground">
            Enter your Order Reference ID and Email below to check the current
            status of your shipment.
          </p>
        </div>

        {/* Search section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleTrack} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Order Tracking Number (e.g. 5D8K0X3)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="pl-10 h-12 bg-background border-border text-foreground focus-visible:ring-gold/50"
                  required
                />
              </div>
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background border-border text-foreground focus-visible:ring-gold/50"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !trackingId.trim() || !email.trim()}
              className="h-12 px-8 bg-gold hover:bg-gold/90 text-black font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Searching...
                </>
              ) : (
                "Track"
              )}
            </Button>
          </form>
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Results section */}
        {order && (
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5">
            {/* Order Header */}
            <div className="p-6 sm:p-8 bg-black/20 border-b border-border/50">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-medium text-foreground">
                    Order Reference
                  </h2>
                  <p className="text-gold font-mono font-bold tracking-widest text-sm mt-1">
                    {order.tracking_number}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <span className="text-sm text-muted-foreground">
                    Order Date
                  </span>
                  <span className="font-medium">
                    {format(
                      new Date(order.created_at),
                      "MMM d, yyyy 'at' h:mm a",
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Order Status Timeline / Badge */}
              <div className="flex items-center gap-4">
                <div
                  className={`h-16 w-16 rounded-full flex items-center justify-center ${getStatusColor(
                    order.status,
                  )}`}
                >
                  <StatusIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                    Current Status
                  </p>
                  <h3 className="text-2xl font-serif capitalize text-foreground">
                    {order.status}
                  </h3>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Order Details Grid */}
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Shipping Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <MapPin className="h-5 w-5 text-gold" />
                    <h3>Delivery Destination</h3>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl text-sm space-y-1 border border-border/30">
                    <p className="text-foreground">{order.shipping_address}</p>
                    <p className="text-muted-foreground">
                      {order.shipping_city}
                      {order.shipping_state ? `, ${order.shipping_state}` : ""}
                    </p>
                    <p className="text-muted-foreground uppercase">
                      {order.shipping_country}
                    </p>
                    {order.shipping_zip && (
                      <p className="text-muted-foreground">
                        {order.shipping_zip}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <CreditCard className="h-5 w-5 text-gold" />
                    <h3>Payment Details</h3>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl text-sm space-y-3 border border-border/30">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Subtotal</span>
                      <span>
                        {formatPrice(
                          order.total_amount + (order.discount_amount || 0),
                        )}
                      </span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between items-center text-ghana-green">
                        <span>Discount Applied</span>
                        <span>-{formatPrice(order.discount_amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t border-border/30 pt-3">
                      <span className="text-muted-foreground font-medium">
                        Final Total
                      </span>
                      <span className="font-bold text-lg text-foreground">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg mt-2">
                      <span className="text-muted-foreground">Status</span>
                      <span
                        className={`capitalize font-medium ${
                          order.payment_status === "paid"
                            ? "text-ghana-green"
                            : "text-gold"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Order Items */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <ShoppingBag className="h-5 w-5 text-gold" />
                  <h3>Order Items</h3>
                </div>
                <div className="space-y-3">
                  {order.order_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-4 rounded-xl border border-border/30 bg-black/10"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {item.size} <span className="mx-1">•</span> Qty:{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
