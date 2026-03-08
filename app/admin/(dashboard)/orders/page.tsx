import { createClient } from "@/lib/supabase/server";
import { OrdersClient } from "@/components/admin/orders-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders | Admin" };

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(name))")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders</p>
      </div>

      <OrdersClient initialOrders={orders || []} />
    </div>
  );
}
