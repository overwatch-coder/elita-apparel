"use client";

import { cn } from "@/lib/utils";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";

export type PaymentMethod = "card" | "momo" | "manual_momo";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Payment Method</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card/Momo Online */}
        <button
          type="button"
          onClick={() => onChange("card")}
          className={cn(
            "relative flex flex-col items-start p-4 border-2 rounded-xl transition-all hover:bg-accent/50 text-left",
            value === "card" || value === "momo"
              ? "border-gold bg-gold/5"
              : "border-border bg-transparent opacity-60 hover:opacity-100",
          )}
        >
          <div className="flex items-center gap-3 mb-2 w-full">
            <div
              className={cn(
                "p-2 rounded-lg",
                value === "card" || value === "momo"
                  ? "bg-gold text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="font-medium text-foreground">
              Card / Momo (Online)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Secure online payment via Paystack. Supports all cards and mobile
            money.
          </p>
          {(value === "card" || value === "momo") && (
            <div className="absolute top-3 right-3">
              <CheckCircle2 className="h-5 w-5 text-gold" />
            </div>
          )}
        </button>

        {/* Manual Transfer */}
        <button
          type="button"
          onClick={() => onChange("manual_momo")}
          className={cn(
            "relative flex flex-col items-start p-4 border-2 rounded-xl transition-all hover:bg-accent/50 text-left",
            value === "manual_momo"
              ? "border-gold bg-gold/5"
              : "border-border bg-transparent opacity-60 hover:opacity-100",
          )}
        >
          <div className="flex items-center gap-3 mb-2 w-full">
            <div
              className={cn(
                "p-2 rounded-lg",
                value === "manual_momo"
                  ? "bg-gold text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Smartphone className="h-5 w-5" />
            </div>
            <span className="font-medium text-foreground">Manual Transfer</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Transfer directly to our account and upload proof of payment.
          </p>
          {value === "manual_momo" && (
            <div className="absolute top-3 right-3">
              <CheckCircle2 className="h-5 w-5 text-gold" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
