"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/lib/actions/profile";
import { toast } from "sonner";

interface ProfileFormProps {
  initialData: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
    }

    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="fullName"
          className="text-muted-foreground text-sm font-medium"
        >
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={initialData.fullName}
          required
          className="h-12 bg-background border-border text-foreground focus-visible:ring-gold/50"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-muted-foreground text-sm font-medium"
        >
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={initialData.email}
          disabled
          className="h-12 bg-muted/30 border-border text-muted-foreground cursor-not-allowed"
        />
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
          Email cannot be changed.
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-muted-foreground text-sm font-medium"
        >
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={initialData.phone}
          placeholder="+233..."
          className="h-12 bg-background border-border text-foreground focus-visible:ring-gold/50"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto h-11 bg-gold hover:bg-gold-dark text-white font-medium uppercase tracking-widest text-[10px] px-8"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
