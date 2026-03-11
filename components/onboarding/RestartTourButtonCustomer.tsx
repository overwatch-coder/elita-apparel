"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetOnboarding } from "@/lib/actions/onboarding";
import { toast } from "sonner";

export function RestartTourButtonCustomer() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRestart = async () => {
    setLoading(true);
    const result = await resetOnboarding();
    if (result.error) {
      toast.error("Could not restart tour. Please try again.");
    } else {
      toast.success("Tour restarted! Returning to your account overview…");
      router.push("/account");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleRestart}
      disabled={loading}
      variant="outline"
      className="shrink-0 border-amber-500/40 text-amber-600 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500"
    >
      <RotateCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Resetting…" : "Restart Tour"}
    </Button>
  );
}
