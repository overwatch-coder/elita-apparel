"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleAutomation } from "@/lib/actions/automations";
import { toast } from "sonner";

interface AutomationToggleProps {
  id: string;
  initialActive: boolean;
}

export function AutomationToggle({ id, initialActive }: AutomationToggleProps) {
  const [active, setActive] = useState(initialActive);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      const result = await toggleAutomation(id, checked);
      if (result.error) {
        toast.error(result.error);
        setActive(active); // Reset locally
      } else {
        setActive(checked);
        toast.success(`Automation ${checked ? "activated" : "deactivated"}`);
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={active}
      onCheckedChange={handleToggle}
      disabled={isLoading}
    />
  );
}
