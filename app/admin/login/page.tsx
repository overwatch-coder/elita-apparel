"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/auth";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-black p-4">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-gold/20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-gold/20" />

      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Elita Apparel"
            width={140}
            height={56}
            className="mx-auto h-14 w-auto object-contain mb-6"
            priority
          />
          <h1 className="font-serif text-2xl text-cream">Admin Portal</h1>
          <p className="text-sm text-cream/50 mt-2">
            Sign in to manage your store
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-cream/70 text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@elitaapparel.com"
              className="h-12 bg-white/5 border-cream/10 text-cream placeholder:text-cream/30 focus-visible:ring-gold/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-cream/70 text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12 bg-white/5 border-cream/10 text-cream placeholder:text-cream/30 focus-visible:ring-gold/50 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream hover:bg-transparent"
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
            className="w-full h-12 bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-[10px] text-cream/30 tracking-[0.3em] uppercase">
          Elita Apparel Admin
        </p>
      </div>
    </div>
  );
}
