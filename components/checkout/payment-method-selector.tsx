"use client";

import { cn } from "@/lib/utils";
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

export type PaymentMethod = "card" | "momo" | "manual_momo";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  const isPaystack = value === "card" || value === "momo";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">Payment Method</h2>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-ghana-green" />
          Secure Checkout
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Paystack Online */}
        <button
          type="button"
          onClick={() => onChange("card")}
          className={cn(
            "relative flex flex-col items-start p-5 border-2 rounded-xl transition-all hover:bg-accent/50 text-left",
            isPaystack
              ? "border-gold bg-gold/5"
              : "border-border bg-transparent opacity-60 hover:opacity-100",
          )}
        >
          <div className="flex items-center gap-3 mb-3 w-full">
            <div
              className={cn(
                "p-2 rounded-lg",
                isPaystack
                  ? "bg-gold text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-foreground block">
                Pay Online via Paystack
              </span>
              <span className="text-xs text-muted-foreground">
                Card, Mobile Money &mdash; instant &amp; secure
              </span>
            </div>
            {isPaystack && (
              <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
            )}
          </div>

          {/* Supported payment channel badges */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/40 w-full">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mr-1">
              Accepts
            </span>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-md border border-border/30">
              <Image src="/payments/visa.svg" alt="Visa" width={36} height={24} className="h-5 w-auto" />
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-md border border-border/30">
              <Image src="/payments/mastercard.svg" alt="Mastercard" width={36} height={24} className="h-5 w-auto" />
            </div>
            <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-md border border-border/30">
              <Smartphone className="h-4 w-4 text-[#FFCC00]" />
              <span className="text-[10px] font-medium text-muted-foreground">MoMo</span>
            </div>
          </div>
        </button>

        {/* Manual Transfer */}
        <button
          type="button"
          onClick={() => onChange("manual_momo")}
          className={cn(
            "relative flex flex-col items-start p-5 border-2 rounded-xl transition-all hover:bg-accent/50 text-left",
            value === "manual_momo"
              ? "border-gold bg-gold/5"
              : "border-border bg-transparent opacity-60 hover:opacity-100",
          )}
        >
          <div className="flex items-center gap-3 w-full">
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
            <div className="flex-1">
              <span className="font-medium text-foreground block">
                Manual MoMo Transfer
              </span>
              <span className="text-xs text-muted-foreground">
                Transfer via Mobile Money &amp; upload proof of payment
              </span>
            </div>
            {value === "manual_momo" && (
              <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
