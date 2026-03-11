"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Joyride, {
  CallBackProps,
  STATUS,
  EVENTS,
  ACTIONS,
  Step,
} from "react-joyride";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  completeOnboarding,
  saveOnboardingStep,
} from "@/lib/actions/onboarding";
import {
  ADMIN_TOUR_STEPS,
  CUSTOMER_TOUR_STEPS,
  ADMIN_STEP_ROUTES,
  CUSTOMER_STEP_ROUTES,
} from "@/lib/constants/tour-steps";
import confetti from "canvas-confetti";

interface OnboardingTourProps {
  role: "admin" | "customer";
  initialStep?: number;
}

// Detect small screen (below md breakpoint) on the client
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

// Custom tooltip – responsively sized and touch-friendly
function TourTooltip({
  index,
  isLastStep,
  size,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  const isMobile = useIsMobile();

  // On mobile we completely take control of positioning: fixed, centred on the viewport.
  // This bypasses react-floater's computed translate offsets which push the tooltip off-screen.
  const mobileStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10001,
    width: "calc(100vw - 2rem)",
    maxWidth: "340px",
  };

  return (
    <div
      {...tooltipProps}
      style={isMobile ? mobileStyle : tooltipProps?.style}
      className="bg-card border border-border rounded-xl shadow-2xl font-sans
        w-[calc(100vw-2rem)] max-w-[340px]
        sm:w-80 sm:max-w-sm
        p-4 sm:p-5"
    >
      {/* Step counter + progress dots */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium tracking-wide">
          Step {index + 1} of {size}
        </span>
        {/* Dots – capped at 8 to avoid overflow on many steps */}
        <div className="flex gap-1 overflow-hidden max-w-[120px]">
          {Array.from({ length: Math.min(size, 8) }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full shrink-0 transition-all duration-300 ${
                i <= index ? "bg-gold w-4" : "bg-border w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {step.title && (
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5 leading-snug">
          {step.title}
        </h3>
      )}
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {step.content}
      </p>

      {/* Navigation */}
      <div className="flex flex-row items-center justify-between mt-4 gap-2">
        {/* Skip */}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground min-h-[44px]"
          {...skipProps}
        >
          Skip
        </Button>
        <div className="flex gap-2 justify-end">
          {index > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs min-h-[44px] px-4"
              {...backProps}
            >
              Back
            </Button>
          )}
          <Button
            size="sm"
            className="text-xs bg-gold hover:bg-gold/90 text-black font-semibold min-h-[44px] px-4"
            {...primaryProps}
          >
            {isLastStep ? "Finish 🎉" : "Next →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * On mobile every step targets body with center placement.
 * This prevents any tooltip from being anchored to elements that may be
 * hidden, scrolled off-screen, or simply outside the visible viewport on
 * a small handset — which caused the "cropped/off-screen" tooltip.
 */
function patchStepsForMobile(steps: Step[]): Step[] {
  return steps.map((step) => ({
    ...step,
    target: "body",
    placement: "center" as const,
    disableBeacon: true,
  }));
}

function triggerFireworks() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}

export function OnboardingTour({ role, initialStep = 0 }: OnboardingTourProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(initialStep);
  const pendingNavigationRef = useRef<string | null>(null);

  const baseSteps: Step[] = role === "admin" ? ADMIN_TOUR_STEPS : CUSTOMER_TOUR_STEPS;
  const routeMap = role === "admin" ? ADMIN_STEP_ROUTES : CUSTOMER_STEP_ROUTES;

  // On mobile all steps target body (sidebar is hidden)
  const steps = isMobile ? patchStepsForMobile(baseSteps) : baseSteps;

  // Start the tour – small delay to let the page render its targets
  useEffect(() => {
    const timer = setTimeout(() => setRun(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Resume tour after cross-page navigation
  useEffect(() => {
    if (pendingNavigationRef.current && pathname === pendingNavigationRef.current) {
      pendingNavigationRef.current = null;
      const t = setTimeout(() => setRun(true), 600);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  const handleCallback = useCallback(
    async (data: CallBackProps) => {
      const { action, index, status, type } = data;

      // Tour finished, skipped, or explicitly closed
      if (
        ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status) ||
        action === ACTIONS.CLOSE ||
        type === EVENTS.TOUR_END
      ) {
        if (status === STATUS.FINISHED || type === EVENTS.TOUR_END) {
          triggerFireworks();
        }
        await completeOnboarding();
        setRun(false);
        return;
      }

      // Step changed
      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        const nextIndex = action === ACTIONS.PREV ? index - 1 : index + 1;

        // If we click Finish on the last step, it pushes us past the end
        if (nextIndex >= steps.length) {
          triggerFireworks();
          setRun(false);
          await completeOnboarding();
          return;
        }

        if (nextIndex < 0) return;

        const targetRoute = routeMap[nextIndex];

        await saveOnboardingStep(nextIndex);
        setStepIndex(nextIndex);

        if (targetRoute && targetRoute !== pathname) {
          // Navigate first; useEffect above resumes tour after arrival
          setRun(false);
          pendingNavigationRef.current = targetRoute;
          router.push(targetRoute);
        }
      }
    },
    [pathname, steps.length, routeMap, router]
  );

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      disableScrollParentFix={false}
      spotlightClicks={false}
      tooltipComponent={TourTooltip}
      callback={handleCallback}
      floaterProps={{
        // Prevent tooltip from going off-screen
        hideArrow: isMobile,
        offset: isMobile ? 0 : 10,
      }}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: "hsl(var(--card))",
          overlayColor: "rgba(0, 0, 0, 0.55)",
          spotlightShadow: "0 0 0 3px hsl(var(--gold))",
          // Let tooltip choose its own width (controlled via className)
          width: undefined,
        },
        spotlight: {
          borderRadius: 8,
        },
        overlay: {
          // Full screen on all sizes
          height: "100%",
        },
      }}
    />
  );
}
