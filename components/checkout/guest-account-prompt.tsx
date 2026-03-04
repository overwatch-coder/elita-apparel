"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface GuestAccountPromptProps {
  email: string;
  name: string;
}

export function GuestAccountPrompt({ email, name }: GuestAccountPromptProps) {
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleCreateAccount = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsCreating(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to verify.");
      setIsDone(true);
    }
    setIsCreating(false);
  };

  if (isDone) {
    return (
      <div className="mt-6 p-6 rounded-xl bg-gold/5 border border-gold/20 text-center">
        <UserPlus className="h-8 w-8 text-gold mx-auto mb-3" />
        <p className="text-sm text-cream/80">
          Account created! Check <span className="text-gold">{email}</span> to
          verify.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 rounded-xl bg-white/5 border border-cream/10">
      <div className="flex items-center gap-3 mb-4">
        <UserPlus className="h-5 w-5 text-gold" />
        <h3 className="font-serif text-lg text-cream">
          Save your details for next time?
        </h3>
      </div>
      <p className="text-sm text-cream/60 mb-4">
        Create an account with{" "}
        <span className="text-gold font-medium">{email}</span> to track orders
        and check out faster.
      </p>
      <div className="space-y-3">
        <div>
          <Label htmlFor="create-password" className="text-cream/70 text-sm">
            Choose a Password
          </Label>
          <Input
            id="create-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50"
          />
        </div>
        <Button
          onClick={handleCreateAccount}
          disabled={isCreating || password.length < 6}
          className="w-full bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
        >
          {isCreating ? "Creating..." : "Create Account"}
        </Button>
      </div>
    </div>
  );
}
