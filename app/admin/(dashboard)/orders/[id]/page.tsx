import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/constants";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { PaymentStatusSelect } from "@/components/admin/payment-status-select";
import { TrackingNoteForm } from "@/components/admin/tracking-note-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Details | Admin" };

interface AdminOrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", params.id)
    .single();

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content - Left Col */}
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-card rounded-lg border border-border/50 p-6">
            <h2 className="text-lg font-medium mb-4">Items</h2>
            <div className="divide-y divide-border/50">
              {order.order_items.map((item: any) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Size: {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="bg-card rounded-lg border border-border/50 p-6">
            <h2 className="text-lg font-medium mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-ghana-red">
                  <span>Discount ({order.discount_code})</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="pt-4 mt-4 border-t border-border/50 flex justify-between font-medium text-base">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          <TrackingNoteForm
            orderId={order.id}
            initialNote={order.tracking_note || ""}
          />
        </div>

        {/* Sidebar - Right Col */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border/50 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Order Status</h3>
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Payment Status</h3>
              <PaymentStatusSelect
                orderId={order.id}
                currentStatus={order.payment_status}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/50 p-6 text-sm">
            <h3 className="font-medium mb-4 text-base">Customer Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  Contact
                </p>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-muted-foreground">{order.customer_email}</p>
                <p className="text-muted-foreground">{order.customer_phone}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  Shipping Address
                </p>
                <p className="text-muted-foreground">
                  {order.shipping_address}
                  <br />
                  {order.shipping_city}
                  {order.shipping_state ? `, ${order.shipping_state}` : ""}{" "}
                  {order.shipping_zip}
                  <br />
                  {order.shipping_country}
                </p>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-card rounded-lg border border-border/50 p-6">
              <h3 className="text-sm font-medium mb-2 text-gold">
                Order Notes
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
