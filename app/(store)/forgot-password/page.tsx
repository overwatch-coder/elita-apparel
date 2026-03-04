"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/lib/actions/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await resetPasswordAction(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
      setIsSuccess(true);
    }

    setIsPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-black p-4 py-20 relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-gold/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-gold/20" />

      <div className="w-full max-w-sm space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Elita Apparel"
              width={140}
              height={56}
              className="mx-auto h-14 w-auto object-contain mb-6"
              priority
            />
          </Link>
          <h1 className="font-serif text-3xl text-cream">Reset Password</h1>
          <p className="text-sm text-cream/70 mt-2">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-white/5 border border-gold/20 p-6 text-center space-y-4 rounded-sm">
            <h3 className="text-gold font-serif text-lg">Check Your Email</h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              We've sent password reset instructions to the email address you
              provided. Please check your inbox (and spam folder) for the link.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full h-12 border-cream/20 text-cream hover:bg-white/5 uppercase tracking-wider mt-4"
            >
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cream/70 text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your registered email"
                className="h-12 bg-white/5 border-cream/10 text-cream placeholder:text-cream/30 focus-visible:ring-gold/50"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="text-center mt-6 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-cream/50 hover:text-gold transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
