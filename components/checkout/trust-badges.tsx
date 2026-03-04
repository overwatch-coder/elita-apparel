"use client";

import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    label: "Secure Checkout",
    detail: "SSL Encrypted",
  },
  {
    icon: Truck,
    label: "Ghana-Wide Delivery",
    detail: "Accra & beyond",
  },
  {
    icon: RotateCcw,
    label: "Easy Returns",
    detail: "7-day policy",
  },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-4">
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2.5">
          <div className="rounded-full bg-gold/10 p-2">
            <badge.icon className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="text-xs font-medium text-cream">{badge.label}</p>
            <p className="text-[10px] text-cream/50">{badge.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
