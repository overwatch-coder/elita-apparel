"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { completeOnboarding } from "@/lib/actions/onboarding";

interface WelcomeModalProps {
  role: "admin" | "customer";
  onStartTour: () => void;
}

export function WelcomeModal({ role, onStartTour }: WelcomeModalProps) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "admin";

  const handleSkip = async () => {
    setLoading(true);
    await completeOnboarding();
    setOpen(false);
  };

  const handleStart = () => {
    setOpen(false);
    setTimeout(onStartTour, 300);
  };

  return (
    <Dialog open={open} onOpenChange={() => {/* controlled */}}>
      <DialogContent
        /* Mobile: fills almost full width with comfortable side margins.
           Tablet+: max-w-md cap as before.
           Bottom-anchored on mobile so it doesn't fight the keyboard. */
        className="
          w-[calc(100%-2rem)] max-w-md
          mx-auto
          p-5 sm:p-6
          rounded-2xl
          text-center
          bottom-4 sm:bottom-auto translate-y-0 sm:translate-y-[-50%]
        "
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 py-1 sm:py-2">
          {/* Icon – slightly smaller on mobile */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl sm:text-3xl">
            {isAdmin ? "🏪" : "👋"}
          </div>

          <DialogHeader className="space-y-1.5 sm:space-y-2">
            <DialogTitle className="text-lg sm:text-xl font-semibold leading-snug">
              {isAdmin
                ? "Welcome to your Admin Dashboard!"
                : "Welcome to Elita Apparel!"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {isAdmin
                ? "We'll walk you through the key sections of your store so you can get started quickly."
                : "Let us take a quick moment to show you around your account so you can get the most out of it."}
            </DialogDescription>
          </DialogHeader>

          {/* Actions – full-width stacked, touch-friendly (min 44px) */}
          <div className="flex flex-col gap-2 w-full pt-1 sm:pt-2">
            <Button
              onClick={handleStart}
              className="w-full bg-gold hover:bg-gold/90 text-black font-semibold h-11 sm:h-10 text-sm"
            >
              Start Tour 🚀
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground h-10 text-xs sm:text-sm"
              onClick={handleSkip}
              disabled={loading}
            >
              {loading ? "Saving…" : "Skip for now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
