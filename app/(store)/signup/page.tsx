"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signupCustomerAction } from "@/lib/actions/auth";
import { subscribeToNewsletter } from "@/app/actions/marketing";
import { toast } from "sonner";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    // Client side validation
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsPending(false);
      return;
    }

    const result = await signupCustomerAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsPending(false);
      return;
    }

    // Handle newsletter opt-in
    const subscribeOptIn = formData.get("subscribe") === "on";
    if (subscribeOptIn) {
      const email = formData.get("email") as string;
      await subscribeToNewsletter(email, "signup");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-20 relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-gold/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-gold/20" />

      <div className="w-full max-w-sm space-y-8 relative z-10 mt-10">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Elita Apparel"
              width={140}
              height={56}
              className="mx-auto h-14 w-auto object-contain mb-6 dark:invert-0 light:invert transition-all"
              priority
            />
          </Link>
          <h1 className="font-serif text-3xl text-foreground">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Join Elita Apparel today
          </p>
        </div>

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-muted-foreground text-sm">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. Kwame Mensah"
              className="h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-gold/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground text-sm">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-gold/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-gold/50 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Must be at least 6 characters.
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-muted-foreground text-sm"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-gold/50"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="subscribe" name="subscribe" defaultChecked />
            <label
              htmlFor="subscribe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              Sign me up for exclusive offers and news
            </label>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase mt-2"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gold hover:text-gold-light transition-colors font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
