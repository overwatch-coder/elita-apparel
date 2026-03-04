"use client";

import { CheckCircle2, CreditCard, Smartphone, Banknote } from "lucide-react";

export type PaymentMethod = "cod" | "card" | "momo";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: "cod" as const,
      title: "Pay on Delivery",
      description: "Pay with cash when your order arrives.",
      icon: Banknote,
      badge: "Most Flexible",
    },
    {
      id: "card" as const,
      title: "Card Payment",
      description: "Secure payment with Visa or Mastercard.",
      icon: CreditCard,
      badge: "Instant Confirmation",
    },
    {
      id: "momo" as const,
      title: "Mobile Money",
      description: "Pay with MTN, Vodafone, or AirtelTigo.",
      icon: Smartphone,
      badge: "Popular in Ghana",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl mb-4">Payment Method</h3>
      <div className="grid gap-4 sm:grid-cols-1">
        {methods.map((method) => {
          const isSelected = value === method.id;
          const Icon = method.icon;

          return (
            <label
              key={method.id}
              className={`relative flex cursor-pointer rounded-xl border p-5 transition-all duration-300 hover:border-gold/50 hover:bg-white/5 ${
                isSelected
                  ? "border-gold bg-gold/5 shadow-[0_0_15px_rgba(202,176,131,0.15)] ring-1 ring-gold"
                  : "border-border/50 bg-black/20"
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value={method.id}
                className="sr-only"
                checked={isSelected}
                onChange={() => onChange(method.id)}
              />
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isSelected
                        ? "bg-gold text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-medium text-lg leading-none flex items-center gap-3">
                      {method.title}
                      {method.badge && (
                        <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold border border-gold/20">
                          {method.badge}
                        </span>
                      )}
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="h-6 w-6 text-gold shrink-0 mt-1" />
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
