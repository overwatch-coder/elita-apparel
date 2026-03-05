"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", authUser.id)
          .single();

        if (profile?.role !== "admin") {
          router.push("/account");
          return;
        }

        setUser({
          name: profile?.full_name || authUser.email?.split("@")[0] || "Admin",
          role: profile?.role || "admin",
        });
      } else {
        router.push("/login");
      }
    }
    getUser();
  }, []);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-gold/30 selection:text-white">
      {/* Desktop Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <AdminMobileNav />
        <main className="overflow-y-auto scroll-smooth">
          <div className="p-4 sm:p-6 lg:p-10">
            <AdminBreadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
