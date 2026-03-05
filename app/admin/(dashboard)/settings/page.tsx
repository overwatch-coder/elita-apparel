"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Bell,
  Save,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import {
  initiateEmailChange,
  confirmEmailChange,
  initiatePasswordChange,
  confirmPasswordChange,
} from "@/lib/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Email Change State
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailStep, setEmailStep] = useState<"init" | "otp">("init");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // Password Change State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordStep, setPasswordStep] = useState<"init" | "otp">("init");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);

    if (result.success) {
      toast.success(result.success);
    } else {
      toast.error(result.error || "Failed to update profile");
    }
    setIsSaving(false);
  };

  // --- Email Change Logic ---
  const handleInitiateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEmailLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("newEmail") as string;
    setNewEmail(email);

    const result = await initiateEmailChange(formData);
    if (result.success) {
      toast.success(result.message);
      setEmailStep("otp");
    } else {
      toast.error(result.error);
    }
    setIsEmailLoading(false);
  };

  const handleConfirmEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEmailLoading(true);
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    const result = await confirmEmailChange(otp);
    if (result.success) {
      toast.success(result.message);
      setEmailModalOpen(false);
      setEmailStep("init");
      // Optionally reload user
      window.location.reload();
    } else {
      toast.error(result.error);
    }
    setIsEmailLoading(false);
  };

  // --- Password Change Logic ---
  const handleInitiatePassword = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await initiatePasswordChange(formData);
    if (result.success) {
      toast.success(result.message);
      setPasswordStep("otp");
    } else {
      toast.error(result.error);
    }
    setIsPasswordLoading(false);
  };

  const handleConfirmPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;
    const newPass = formData.get("newPassword") as string;

    const result = await confirmPasswordChange(otp, newPass);
    if (result.success) {
      toast.success(result.message);
      setPasswordModalOpen(false);
      setPasswordStep("init");
    } else {
      toast.error(result.error);
    }
    setIsPasswordLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20 animate-pulse">
        <Loader2 className="h-6 w-6 text-gold animate-spin mr-3" />
        <span className="text-lg font-serif">Loading your settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-foreground">
          Account Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold">
            Profile Details
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your name and contact information used for administrative
            communications and system logs.
          </p>
        </div>

        <div className="md:col-span-2">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update your primary identity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        id="fullName"
                        name="fullName"
                        defaultValue={profile?.full_name || ""}
                        className="pl-10 bg-background border-border h-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={profile?.phone || ""}
                        className="pl-10 bg-background border-border h-10"
                        placeholder="+233 24 000 0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Email Address
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 opacity-70">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="pl-10 bg-muted border-border h-10 cursor-not-allowed"
                      />
                    </div>
                    <Dialog
                      open={emailModalOpen}
                      onOpenChange={setEmailModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-gold text-gold hover:bg-gold/5 h-10 px-4 text-xs font-bold uppercase tracking-widest"
                        >
                          Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-serif">
                            Change Email Address
                          </DialogTitle>
                          <DialogDescription>
                            {emailStep === "init"
                              ? "Enter your new email and confirm with your current password."
                              : `Enter the 6-digit code sent to ${newEmail || "your email"}.`}
                          </DialogDescription>
                        </DialogHeader>

                        {emailStep === "init" ? (
                          <form
                            onSubmit={handleInitiateEmail}
                            className="space-y-4 py-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="newEmail">New Email</Label>
                              <Input
                                id="newEmail"
                                name="newEmail"
                                type="email"
                                required
                                placeholder="new@example.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">
                                Current Password
                              </Label>
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                required
                                placeholder="••••••••"
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                disabled={isEmailLoading}
                                className="w-full bg-gold hover:bg-gold-dark text-white"
                              >
                                {isEmailLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Verify & Send OTP"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        ) : (
                          <form
                            onSubmit={handleConfirmEmail}
                            className="space-y-4 py-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="otp text-center block">
                                Verification Code
                              </Label>
                              <Input
                                id="otp"
                                name="otp"
                                maxLength={6}
                                required
                                className="text-center text-2xl tracking-[10px] h-14 font-bold"
                                placeholder="000000"
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                disabled={isEmailLoading}
                                className="w-full bg-gold hover:bg-gold-dark text-white"
                              >
                                {isEmailLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Confirm Change"
                                )}
                              </Button>
                            </DialogFooter>
                            <Button
                              variant="link"
                              onClick={() => setEmailStep("init")}
                              className="text-[10px] text-muted-foreground uppercase tracking-widest block mx-auto"
                            >
                              Back / Resend code
                            </Button>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Email updates require multi-factor verification for
                    security.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gold hover:bg-gold-dark text-white font-medium uppercase tracking-widest text-[10px] h-10 px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <Save className="h-3 w-3 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Profile Details"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="bg-border/40" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold">
            Security
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Manage your password and authentication methods to keep your account
            secure.
          </p>
        </div>

        <div className="md:col-span-2">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">
                    Access Control
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Password and session management
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-background rounded-lg border border-border/50 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Update Password</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      Last updated: Recently
                    </p>
                  </div>
                </div>

                <Dialog
                  open={passwordModalOpen}
                  onOpenChange={setPasswordModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold/5 uppercase tracking-widest text-[10px] h-9"
                    >
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif">
                        Security Verification
                      </DialogTitle>
                      <DialogDescription>
                        {passwordStep === "init"
                          ? "Enter your current password to receive a verification code."
                          : "Enter the code sent to your email and choose a new password."}
                      </DialogDescription>
                    </DialogHeader>

                    {passwordStep === "init" ? (
                      <form
                        onSubmit={handleInitiatePassword}
                        className="space-y-4 py-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            required
                            placeholder="••••••••"
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="w-full bg-gold hover:bg-gold-dark text-white"
                          >
                            {isPasswordLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Send Verification Code"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    ) : (
                      <form
                        onSubmit={handleConfirmPassword}
                        className="space-y-4 py-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="otp">Verification Code</Label>
                          <Input
                            id="otp"
                            name="otp"
                            maxLength={6}
                            required
                            className="text-center font-bold tracking-widest"
                            placeholder="000000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showPass ? "text" : "password"}
                              required
                              minLength={6}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPass(!showPass)}
                              className="absolute right-3 top-2.5 text-muted-foreground"
                            >
                              {showPass ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="w-full bg-gold hover:bg-gold-dark text-white"
                          >
                            {isPasswordLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Update Password"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="p-4 rounded-xl border border-gold/20 bg-gold/5 flex gap-4">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gold-dark">
                    Administrator Access
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You currently have full administrative privileges for the
                    Elita Apparel backend. Ensure your session is logged out on
                    public devices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="bg-border/40" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold">
            Preferences
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Notification and interaction settings. (Coming Soon)
          </p>
        </div>

        <div className="md:col-span-2 opacity-50 grayscale">
          <Card className="border-border/40 shadow-sm overflow-hidden border-dashed">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base font-medium">
                  Notifications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-10">
                <p className="text-xs italic text-muted-foreground">
                  Notification preferences will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
