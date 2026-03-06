import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShieldCheck, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
          Manage your account preferences, profile details, and security settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 mb-8">
          <TabsTrigger value="profile" className="uppercase tracking-widest text-[10px] font-medium py-3 data-[state=active]:bg-background data-[state=active]:text-gold data-[state=active]:shadow-sm">
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="security" className="uppercase tracking-widest text-[10px] font-medium py-3 data-[state=active]:bg-background data-[state=active]:text-blue-500 data-[state=active]:shadow-sm">
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="uppercase tracking-widest text-[10px] font-medium py-3 data-[state=active]:bg-background data-[state=active]:text-green-500 data-[state=active]:shadow-sm">
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="border-b border-border/40 pb-4 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gold mb-2">
              Profile Details
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your personal information used for orders and shipping.
            </p>
          </div>
          
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/10 pb-6 mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">Personal Information</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
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

        <TabsContent value="security" className="space-y-6">
          <div className="border-b border-border/40 pb-4 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-2">
              Security
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage your password and authentication methods to keep your account secure.
            </p>
          </div>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/10 pb-6 mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">Access Control</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <PasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="border-b border-border/40 pb-4 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-2">
              Preferences
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage your notifications and other personal settings.
            </p>
          </div>

          <Card className="border-border/40 shadow-sm border-dashed opacity-50 grayscale">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-border flex items-center justify-center text-muted-foreground">
                  <Bell className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-medium">Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground italic">
                  Notification preferences will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
