"use client";

import { useState } from "react";
import { WelcomeModal } from "./WelcomeModal";
import { OnboardingTour } from "./OnboardingTour";

interface OnboardingControllerProps {
  role: "admin" | "customer";
  /** Whether to show the welcome modal first vs. resuming mid-tour */
  showWelcome: boolean;
  initialStep?: number;
}

/**
 * The top-level orchestrator.
 * - If showWelcome is true  → render WelcomeModal (user hasn't started yet)
 * - If showWelcome is false → render OnboardingTour directly (user mid-tour)
 */
export function OnboardingController({
  role,
  showWelcome,
  initialStep = 0,
}: OnboardingControllerProps) {
  const [phase, setPhase] = useState<"modal" | "tour" | "done">(
    showWelcome ? "modal" : "tour"
  );

  if (phase === "done") return null;

  if (phase === "modal") {
    return (
      <WelcomeModal
        role={role}
        onStartTour={() => setPhase("tour")}
      />
    );
  }

  return <OnboardingTour role={role} initialStep={initialStep} />;
}
