import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*, product_images(*)))")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    notFound();
  }

  // Determine timeline steps based on order status
  const statuses = [
    { id: "pending", label: "Order Placed", icon: Clock },
    { id: "processing", label: "Processing", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  // Logic to determine active states
  const getStatusIndex = (currentStatus: string) => {
    switch (currentStatus.toLowerCase()) {
      case "pending":
      case "paid":
        return 0;
      case "processing":
        return 1;
      case "shipped":
      case "out for delivery":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
      case "refunded":
      case "failed":
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStatusIndex(order.status);
  const isCancelledOrFailed = currentIndex === -1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center text-sm text-muted-foreground/50 hover:text-gold transition-colors mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-serif text-foreground">
            Order #{id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
            {new Date(order.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Order Status
          </p>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize border ${
              isCancelledOrFailed
                ? "bg-red-400/10 text-red-400 border-red-400/20"
                : "bg-gold/10 text-gold border-gold/20"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Tracking Timeline */}
      {!isCancelledOrFailed && (
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
          <h3 className="font-serif text-lg text-foreground mb-6">
            Tracking Timeline
          </h3>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-accent/20 hidden sm:block">
              <div
                className="h-full bg-gold transition-all duration-500 ease-in-out"
                style={{
                  width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-6 relative z-10">
              {statuses.map((step, index) => {
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className="flex sm:flex-col items-center gap-4 sm:gap-3 text-center w-full sm:w-1/4"
                  >
                    {/* Vertical line for mobile */}
                    <div className="absolute left-[23px] top-[40px] bottom-[-24px] w-0.5 bg-accent/20 sm:hidden block last:hidden">
                      {isActive && index < currentIndex && (
                        <div className="w-full h-full bg-gold" />
                      )}
                    </div>

                    <div
                      className={`
                      h-12 w-12 rounded-full flex items-center justify-center border-2 transition-colors relative z-10 shrink-0
                      ${isActive ? "bg-gold border-gold text-white" : "bg-card border-border text-muted-foreground/30"}
                      ${isCurrent ? "ring-4 ring-gold/20" : ""}
                    `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left sm:text-center mt-1">
                      <p
                        className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && order.estimated_delivery && (
                        <p className="text-xs text-gold mt-1">
                          Est. Delivery:{" "}
                          {new Date(
                            order.estimated_delivery,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.tracking_note && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="bg-gold/5 border border-gold/20 rounded-md p-4">
                <h4 className="text-sm font-medium text-gold mb-1">
                  Latest Update
                </h4>
                <p className="text-foreground/80 text-sm whitespace-pre-wrap">
                  {order.tracking_note}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-serif text-lg text-foreground">Items Ordered</h3>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {order.order_items.map((item: any) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="h-20 w-16 bg-accent/5 rounded-md overflow-hidden flex items-center justify-center shrink-0 border border-border">
                  {item.product?.product_images?.[0]?.image_url ? (
                    <img
                      src={
                        item.product.product_images.find(
                          (img: any) => img.is_primary,
                        )?.image_url || item.product.product_images[0].image_url
                      }
                      alt={item.product_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground/20" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-base font-medium text-foreground">
                    {item.product_name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Size: {item.size}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground sm:text-right">
                  GH₵{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Shipping Details */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-serif text-lg text-foreground mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  GH₵{order.total_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">Free</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-ghana-red">
                  <span>Discount ({order.discount_code})</span>
                  <span>- GH₵{order.discount_amount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-between">
              <span className="font-medium text-foreground">Total</span>
              <span className="text-lg font-bold text-gold">
                GH₵{order.total_amount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground/40 mt-2">
              Payment Status:{" "}
              <strong className="uppercase font-semibold">
                {order.payment_status}
              </strong>
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-serif text-lg text-foreground mb-4">
              Shipping Information
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {order.customer_name}
              </p>
              <p>{order.shipping_address}</p>
              <p>
                {order.shipping_city}
                {order.shipping_state ? `, ${order.shipping_state}` : ""}{" "}
                {order.shipping_zip}
              </p>
              <p>{order.shipping_country}</p>
              <p className="pt-2">{order.customer_phone}</p>
              <p>{order.customer_email}</p>
            </div>

            {order.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Order Notes
                </p>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
