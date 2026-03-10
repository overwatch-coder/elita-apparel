import { createClient } from "@/lib/supabase/server";
import { OrdersClient } from "@/components/admin/orders-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders | Admin" };

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    q?: string;
    status?: string;
    start?: string;
    end?: string;
    min?: string;
    max?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const {
    page = "1",
    pageSize = "10",
    q = "",
    status = "all",
    start = "",
    end = "",
    min = "",
    max = "",
  } = await searchParams;

  const currentPage = parseInt(page);
  const size = parseInt(pageSize);
  const from = (currentPage - 1) * size;
  const to = from + size - 1;

  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(*, product:products(name))", { count: "exact" });

  // Filtering
  if (q) {
    // Search in multiple fields
    query = query.or(
      `customer_name.ilike.%${q}%,customer_email.ilike.%${q}%,id.ilike.%${q}%`,
    );
  }

  if (status && status !== "all") {
    query = query.eq("status", status as any);
  }

  if (start) {
    query = query.gte("created_at", `${start}T00:00:00Z`);
  }

  if (end) {
    query = query.lte("created_at", `${end}T23:59:59Z`);
  }

  if (min) {
    query = query.gte("total_amount", parseFloat(min));
  }

  if (max) {
    query = query.lte("total_amount", parseFloat(max));
  }

  const { data: orders, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      <OrdersClient
        initialOrders={orders || []}
        totalCount={count || 0}
        pageSize={size}
        currentPage={currentPage}
      />
    </div>
  );
}
