"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { OnboardingController } from "@/components/onboarding/OnboardingController";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [onboarding, setOnboarding] = useState<{
    show: boolean;
    showWelcome: boolean;
    step: number;
  } | null>(null);
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
          .select("full_name, role, onboarding_completed, onboarding_step")
          .eq("id", authUser.id)
          .single();

        if (profile?.role !== "admin") {
          router.push("/account");
          return;
        }

        setUser({
          id: authUser.id,
          name: profile?.full_name || authUser.email?.split("@")[0] || "Admin",
          role: profile?.role || "admin",
        });

        if (!profile?.onboarding_completed) {
          const step = profile?.onboarding_step ?? 0;
          setOnboarding({ show: true, showWelcome: step === 0, step });
        }
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <AdminBreadcrumbs />
              </div>
              <div className="hidden lg:flex items-center gap-2">
                {user?.id ? (
                  <NotificationDropdown isAdminView={true} userId={user.id} />
                ) : null}
                <ThemeToggle />
              </div>
            </div>
            {children}
          </div>

          {/* Onboarding tour – only for users who haven't completed it */}
          {onboarding?.show && (
            <OnboardingController
              role="admin"
              showWelcome={onboarding.showWelcome}
              initialStep={onboarding.step}
            />
          )}
        </main>
      </div>
    </div>
  );
}
