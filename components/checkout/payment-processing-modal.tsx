"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface PaymentProcessingModalProps {
  isOpen: boolean;
  status: "idle" | "processing" | "success" | "error";
  onClose?: () => void;
}

export function PaymentProcessingModal({
  isOpen,
  status,
  onClose,
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

          {status === "error" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-red-500/20 animate-pulse" />
                <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center relative border border-red-500/30">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-2">
                  Something went wrong
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We encountered an error while processing your request. Please
                  try again or contact support.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
