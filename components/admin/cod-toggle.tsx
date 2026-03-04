"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { markCODCollected } from "@/lib/actions/admin";

interface CODToggleProps {
  orderId: string;
  initialCollected: boolean;
}

export function CODToggle({ orderId, initialCollected }: CODToggleProps) {
  const [isCollected, setIsCollected] = useState(initialCollected);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      const result = await markCODCollected(orderId, checked);
      if (result.error) throw new Error(result.error);

      setIsCollected(checked);
      toast.success(
        checked
          ? "Payment marked as collected."
          : "Payment marked as uncollected.",
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update collecting status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-t border-border/50">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">Cash Collected</Label>
        <p className="text-xs text-muted-foreground">
          Confirm driver received cash.
        </p>
      </div>
      <Switch
        checked={isCollected}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="data-[state=checked]:bg-gold"
      />
    </div>
  );
}
