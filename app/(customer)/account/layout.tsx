import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/sidebar";
import { AccountMobileNav } from "@/components/account/mobile-nav";
import { AccountBreadcrumbs } from "@/components/account/account-breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch full profile for the sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Strict redirection for admins
  if (profile?.role === "admin") {
    redirect("/admin");
  }

  const userData = {
    id: user.id,
    name: profile?.full_name || user.email?.split("@")[0] || "Guest",
    email: user.email || "",
    role: profile?.role || "customer",
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-gold/30 selection:text-white">
      {/* Sidebar Navigation */}
      <AccountSidebar user={userData} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <AccountMobileNav user={userData} />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="container mx-auto px-4 py-8 md:py-12 pb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <AccountBreadcrumbs />
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <NotificationDropdown userId={user.id} isAdminView={false} />
                <ThemeToggle />
              </div>
            </div>
            
            <div className="bg-card border border-border/50 rounded-lg p-4 md:p-6 lg:p-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
