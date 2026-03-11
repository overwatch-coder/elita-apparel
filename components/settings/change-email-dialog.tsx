"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { initiateEmailChange, confirmEmailChange } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ChangeEmailDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"initiate" | "confirm">("initiate");
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInitiate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await initiateEmailChange(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.message);
      setStep("confirm");
    }

    setIsPending(false);
  };

  const handleConfirm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    const result = await confirmEmailChange(otp);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.message);
      setIsOpen(false);
      setStep("initiate"); // Reset for next time
      router.refresh();
    }

    setIsPending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="ml-auto text-xs h-8 border-gold/20 hover:bg-gold/10 hover:text-gold transition-colors"
        >
          Change Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {step === "initiate"
              ? "Change Email Address"
              : "Enter Verification Code"}
          </DialogTitle>
          <DialogDescription>
            {step === "initiate"
              ? "Enter your new email address and current password to verify your identity."
              : "We've sent a 6-digit verification code to your new email address. Please enter it below."}
          </DialogDescription>
        </DialogHeader>

        {step === "initiate" ? (
          <form onSubmit={handleInitiate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                required
                placeholder="new@example.com"
                className="focus-visible:ring-gold/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="focus-visible:ring-gold/50 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold hover:bg-gold-dark text-white font-medium uppercase tracking-widest text-xs h-11"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                className="focus-visible:ring-gold/50 text-center tracking-widest text-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold hover:bg-gold-dark text-white font-medium uppercase tracking-widest text-xs h-11"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Change Email"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setStep("initiate")}
              disabled={isPending}
            >
              Back
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
