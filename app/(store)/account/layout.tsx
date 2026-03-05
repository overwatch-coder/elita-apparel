import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/sidebar";

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
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="bg-card border border-border/50 rounded-lg p-6 lg:p-10 shadow-xl shadow-black/5">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
