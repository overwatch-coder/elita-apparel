"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addAddressAction } from "@/lib/actions/address";
import { toast } from "sonner";

export function AddressFormDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await addAddressAction(formData);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
      setOpen(false);
    }

    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gold hover:bg-gold-dark text-white font-medium gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-royal-black text-cream border-cream/10">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-cream">
            Add Shipping Address
          </DialogTitle>
          <DialogDescription className="text-cream/60">
            Enter your delivery details. We currently ship within Ghana.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-cream/70 text-xs">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                required
                className="bg-white/5 border-cream/10 text-cream h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-cream/70 text-xs">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                required
                className="bg-white/5 border-cream/10 text-cream h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1" className="text-cream/70 text-xs">
              Street Address
            </Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              required
              placeholder="House No, Street name"
              className="bg-white/5 border-cream/10 text-cream h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2" className="text-cream/70 text-xs">
              Apartment, suite, etc. (Optional)
            </Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              className="bg-white/5 border-cream/10 text-cream h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-cream/70 text-xs">
                City
              </Label>
              <Input
                id="city"
                name="city"
                required
                className="bg-white/5 border-cream/10 text-cream h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region" className="text-cream/70 text-xs">
                Region
              </Label>
              <Input
                id="region"
                name="region"
                required
                placeholder="Greater Accra"
                className="bg-white/5 border-cream/10 text-cream h-10"
              />
            </div>
          </div>

          <div className="space-y-2 hidden">
            <Label htmlFor="country" className="text-cream/70 text-xs">
              Country
            </Label>
            <Input
              id="country"
              name="country"
              defaultValue="Ghana"
              required
              className="bg-white/5 border-cream/10 text-cream h-10"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2 pb-4 border-b border-cream/10">
            <Checkbox
              id="isDefault"
              name="isDefault"
              className="border-cream/20 data-[state=checked]:bg-gold data-[state=checked]:text-white"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium leading-none text-cream/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default shipping address
            </label>
          </div>

          <div className="flex justify-end pt-2 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-cream/70 hover:text-cream hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold hover:bg-gold-dark text-white"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Address
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
