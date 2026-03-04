"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  status: "idle" | "processing" | "success" | "error";
}

export function PaymentProcessingModal({
  isOpen,
  status,
}: PaymentProcessingModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-background border border-border/50 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transition-all duration-500 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {status === "processing" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-gold/20 animate-pulse" />
                <div className="h-20 w-20 bg-gold/10 rounded-full flex items-center justify-center relative border border-gold/30">
                  <Loader2 className="h-10 w-10 text-gold animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-2">
                  Processing Payment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please do not close this window while we secure your
                  transaction.
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-green-500/20 animate-pulse" />
                <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center relative border border-green-500/30 scale-100 transition-transform duration-500 ease-out">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-xl font-serif text-white mb-2">
                  Payment Complete
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your order has been successfully placed. Relocating you...
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
