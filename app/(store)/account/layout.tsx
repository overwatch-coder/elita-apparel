import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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

  return (
    <div className="min-h-screen flex flex-col bg-royal-black text-cream">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 mt-20">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <AccountSidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 bg-white/5 border border-cream/10 rounded-lg p-6 lg:p-10 shadow-xl shadow-black/20">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
