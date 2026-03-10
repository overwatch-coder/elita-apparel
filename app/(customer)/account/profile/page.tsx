import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShieldCheck, Bell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <div className="space-y-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif text-foreground mb-2">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences, profile details, and security
          settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <div className="flex justify-center mb-10">
          <TabsList className="inline-flex h-auto p-1 bg-muted/30 rounded-xl border border-border/50">
            <TabsTrigger
              value="profile"
              className="px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:text-gold data-[state=active]:shadow-sm"
            >
              Profile Details
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:text-blue-500 data-[state=active]:shadow-sm"
            >
              Security
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:text-green-500 data-[state=active]:shadow-sm"
            >
              Preferences
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6 outline-none">
          <Card className="border-border/40 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/20 pb-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20">
                  <User className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-serif">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Update your personal profile details used for orders and
                    shipping.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialData={{
                  fullName: profile?.full_name || "",
                  email: user.email || "",
                  phone: profile?.phone || "",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 outline-none">
          <Card className="border-border/40 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/20 pb-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-serif">
                    Access Control
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Manage your password and authentication methods to keep your
                    account secure.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 outline-none">
          <Card className="border-border/40 shadow-sm rounded-xl overflow-hidden border-dashed opacity-70 grayscale">
            <CardHeader className="bg-muted/10 border-b border-border/20 pb-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border/50">
                  <Bell className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-serif">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Manage your preferences for email and mobile alerts.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-20 flex flex-col items-center justify-center">
              <Bell className="h-10 w-10 text-muted-foreground/20 mb-4" />
              <p className="text-sm text-muted-foreground italic font-serif">
                Notification preferences will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
