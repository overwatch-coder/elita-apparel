"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction } from "@/lib/actions/auth";
import { toast } from "sonner";

export function PasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsPending(false);
      return;
    }

    const result = await updatePasswordAction(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
      (e.target as HTMLFormElement).reset();
    }

    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="currentPassword"
          className="text-muted-foreground text-sm font-medium"
        >
          Current Password
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-gold/50 pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-muted-foreground text-sm font-medium"
        >
          New Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-gold/50 pr-12"
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
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
          Must be at least 6 characters.
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-muted-foreground text-sm font-medium"
        >
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          className="h-12 bg-background border-border text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-gold/50"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto h-11 bg-gold hover:bg-gold-dark text-white font-medium uppercase tracking-widest text-[10px] px-8"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}
