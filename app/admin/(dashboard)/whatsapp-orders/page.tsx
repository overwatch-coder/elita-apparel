import { WhatsAppOrdersClient } from "@/components/admin/whatsapp-orders-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "WhatsApp Orders | Elita Admin",
};

export default async function AdminWhatsAppOrdersPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/admin/login");

  // Fetch whatsapp orders
  const { data: orders, error } = await supabase
    .from("whatsapp_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching whatsapp orders:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif">WhatsApp Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track orders initiated via WhatsApp.
        </p>
      </div>

      <WhatsAppOrdersClient initialOrders={orders || []} />
    </div>
  );
}
