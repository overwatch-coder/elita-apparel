import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-serif text-cream mb-2">
          Profile Settings
        </h1>
        <p className="text-cream/70 text-sm">
          Update your personal details and password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Personal Details Form */}
        <div className="space-y-6">
          <div className="border-b border-cream/10 pb-4">
            <h2 className="text-lg font-medium text-cream">Personal Details</h2>
          </div>
          <ProfileForm
            initialData={{
              fullName: profile?.full_name || "",
              email: user.email || "",
              phone: profile?.phone || "",
            }}
          />
        </div>

        {/* Change Password Form */}
        <div className="space-y-6">
          <div className="border-b border-cream/10 pb-4">
            <h2 className="text-lg font-medium text-cream">Change Password</h2>
          </div>
          <PasswordForm />
        </div>
      </div>
    </div>
  );
}
