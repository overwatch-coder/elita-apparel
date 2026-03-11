"use client";

import { useState } from "react";
import { Loader2, Trash2, CheckCircle2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressFormDialog } from "./address-form-dialog";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/actions/address";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Address } from "@/lib/types/database";

interface AddressListProps {
  addresses: Address[];
}

export function AddressList({ addresses }: AddressListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"delete" | "default" | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    setActionType("delete");
    const result = await deleteAddressAction(id);

    if (result?.error) toast.error(result.error);
    else toast.success(result.success);

    setLoadingId(null);
    setActionType(null);
  };

  const handleSetDefault = async (id: string) => {
    setLoadingId(id);
    setActionType("default");
    const result = await setDefaultAddressAction(id);

    if (result?.error) toast.error(result.error);
    else toast.success(result.success);

    setLoadingId(null);
    setActionType(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={`relative p-5 sm:p-6 rounded-lg border transition-all ${
            address.is_default
              ? "bg-accent/10 border-gold/50 shadow-sm shadow-gold/10"
              : "bg-card border-border hover:border-gold/30"
          }`}
        >
          {address.is_default && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded-full border border-gold/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Default
            </div>
          )}

          <div className="space-y-1 mb-6 pr-20">
            <h3 className="font-medium text-foreground text-lg">
              {address.full_name}
            </h3>
            <p className="text-muted-foreground text-sm mt-2">
              {address.address_line_1}
            </p>
            {address.address_line_2 && (
              <p className="text-muted-foreground text-sm">
                {address.address_line_2}
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              {address.city}, {address.region}
            </p>
            <p className="text-muted-foreground text-sm">{address.country}</p>
            <p className="text-muted-foreground text-sm pt-2">
              {address.phone}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <AddressFormDialog
              address={address}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-gold hover:bg-gold/10"
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Edit
                </Button>
              }
            />

            {!address.is_default && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSetDefault(address.id)}
                disabled={loadingId === address.id}
                className="text-xs text-muted-foreground hover:text-gold hover:bg-gold/10"
              >
                {loadingId === address.id && actionType === "default" ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : null}
                Set as Default
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loadingId === address.id}
                  className="text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-auto"
                >
                  {loadingId === address.id && actionType === "delete" ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{address.full_name}"'s address from your account. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(address.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Address
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
