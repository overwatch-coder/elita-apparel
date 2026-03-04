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
        <Label htmlFor="fullName" className="text-cream/70 text-sm">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          defaultValue={initialData.fullName}
          required
          className="h-12 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-cream/70 text-sm">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={initialData.email}
          disabled
          className="h-12 bg-black/40 border-cream/5 text-cream/50 cursor-not-allowed"
        />
        <p className="text-xs text-cream/40">Email cannot be changed.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-cream/70 text-sm">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={initialData.phone}
          placeholder="+233..."
          className="h-12 bg-black/20 border-cream/10 text-cream focus-visible:ring-gold/50"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 bg-gold hover:bg-gold-dark text-white font-medium"
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
