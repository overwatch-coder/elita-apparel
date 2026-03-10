"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Pencil } from "lucide-react";
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
import { addAddressAction, updateAddressAction } from "@/lib/actions/address";
import { toast } from "sonner";
import { LocationSelector } from "@/components/checkout/location-selector";
import type { Address } from "@/lib/types/database";

interface AddressFormDialogProps {
  address?: Address;
  trigger?: React.ReactNode;
}

export function AddressFormDialog({
  address,
  trigger,
}: AddressFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!address;

  const [formData, setFormData] = useState({
    fullName: address?.full_name || "",
    phone: address?.phone || "",
    addressLine1: address?.address_line_1 || "",
    addressLine2: address?.address_line_2 || "",
    city: address?.city || "",
    region: address?.region || "",
    country: address?.country || "Ghana",
    isDefault: address?.is_default || false,
  });

  // Update effect if address changes (for editing)
  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.full_name || "",
        phone: address.phone || "",
        addressLine1: address.address_line_1 || "",
        addressLine2: address.address_line_2 || "",
        city: address.city || "",
        region: address.region || "",
        country: address.country || "Ghana",
        isDefault: address.is_default || false,
      });
    }
  }, [address]);

  const handleLocationChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const data = new FormData(e.currentTarget);
    // Ensure hidden location fields are correctly populated if needed,
    // but here we can just use the state directly if the action supports it,
    // or ensure inputs are present.

    let result;
    if (isEditing && address) {
      result = await updateAddressAction(address.id, data);
    } else {
      result = await addAddressAction(data);
    }

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.success);
      setOpen(false);
      if (!isEditing) {
        setFormData({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          region: "",
          country: "Ghana",
          isDefault: false,
        });
      }
    }

    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gold hover:bg-gold-dark text-white font-medium gap-2 uppercase tracking-widest text-[10px] px-6 h-11">
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background text-foreground border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">
            {isEditing ? "Edit Address" : "Add Shipping Address"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditing
              ? "Update your delivery details below."
              : "Enter your delivery details. We currently ship within Ghana and select international locations."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="bg-background border-border text-foreground h-12 focus-visible:ring-gold/50"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-background border-border text-foreground h-12 focus-visible:ring-gold/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="addressLine1"
              className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold"
            >
              Street Address
            </Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              required
              placeholder="House No, Street name"
              value={formData.addressLine1}
              onChange={(e) =>
                setFormData({ ...formData, addressLine1: e.target.value })
              }
              className="bg-background border-border text-foreground h-12 focus-visible:ring-gold/50"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="addressLine2"
              className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold"
            >
              Apartment, suite, etc. (Optional)
            </Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={(e) =>
                setFormData({ ...formData, addressLine2: e.target.value })
              }
              className="bg-background border-border text-foreground h-12 focus-visible:ring-gold/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <LocationSelector
              country={formData.country}
              state={formData.region}
              city={formData.city}
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* Hidden inputs to ensure controlled components values are sent with FormData */}
          <input type="hidden" name="country" value={formData.country} />
          <input type="hidden" name="region" value={formData.region} />
          <input type="hidden" name="city" value={formData.city} />
          <input
            type="hidden"
            name="isDefault"
            value={formData.isDefault ? "on" : "off"}
          />

          <div className="flex items-center space-x-3 pt-2 pb-6 border-b border-border/50">
            <Checkbox
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isDefault: !!checked })
              }
              className="border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold h-5 w-5"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium leading-none text-muted-foreground cursor-pointer select-none"
            >
              Set as default shipping address
            </label>
          </div>

          <div className="flex justify-end pt-2 gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/10 uppercase tracking-widest text-[10px] h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-[10px] h-11 px-8 min-w-[140px]"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "Update Address"
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
