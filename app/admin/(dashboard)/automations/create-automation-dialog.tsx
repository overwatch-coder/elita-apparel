"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAutomation } from "@/lib/actions/automations";
import { toast } from "sonner";

export function CreateAutomationDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("signup");
  const [customTrigger, setCustomTrigger] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name) return;

    const finalTrigger = isCustom ? customTrigger : trigger;
    if (!finalTrigger) {
      toast.error("Please provide a trigger event");
      return;
    }

    setIsPending(true);
    try {
      const result = await createAutomation(name, finalTrigger);
      if (result.success) {
        toast.success("Automation created");
        setOpen(false);
        setName("");
        setCustomTrigger("");
        setIsCustom(false);
        router.push(`/admin/automations/${result?.data?.id}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create automation");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsPending(false);
    }
  };

  const handleTriggerChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setTrigger(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold hover:bg-gold-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Create New Automation
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Flow Name</Label>
              <Input
                id="name"
                placeholder="e.g. Post-Holiday Greeting"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Event</Label>
              <Select
                value={isCustom ? "custom" : trigger}
                onValueChange={handleTriggerChange}
              >
                <SelectTrigger id="trigger">
                  <SelectValue placeholder="Select a trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signup">New Signup</SelectItem>
                  <SelectItem value="order_placed">Order Placed</SelectItem>
                  <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                  <SelectItem value="custom" className="text-gold font-medium">
                    + Custom Event...
                  </SelectItem>
                </SelectContent>
              </Select>
              {isCustom && (
                <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="custom-trigger">Event Key Name</Label>
                  <Input
                    id="custom-trigger"
                    placeholder="e.g. vip_signup"
                    value={customTrigger}
                    onChange={(e) => setCustomTrigger(e.target.value)}
                    required
                    className="font-mono text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    Use this key in your code to trigger this flow.
                  </p>
                </div>
              )}
              {!isCustom && (
                <p className="text-[10px] text-muted-foreground italic">
                  The event that kicks off this email sequence.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !name}
              className="w-full bg-gold hover:bg-gold-dark text-white font-bold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Flow"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
