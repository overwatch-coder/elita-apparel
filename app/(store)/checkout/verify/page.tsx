"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrustBadges } from "@/components/checkout/trust-badges";
import { verifyPaystackPayment } from "@/lib/actions/payments";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const orderId = searchParams?.get("order_id");
  const reference = searchParams?.get("reference");
  const trxref = searchParams?.get("trxref");

  useEffect(() => {
    if (!orderId || (!reference && !trxref)) {
      setStatus("error");
      setErrorMessage("Invalid verification link.");
      return;
    }

    const verifyPayment = async () => {
      try {
        if (reference && orderId) {
          const result = await verifyPaystackPayment(reference, orderId);
          if (result.success) {
            clearCart();
            if (result.trackingNumber) setTrackingNumber(result.trackingNumber);
            setStatus("success");
          } else {
            setErrorMessage(result.error || "Payment verification failed.");
            setStatus("error");
          }
        } else {
          // Fallback if no reference is provided (e.g. COD orders or unusual flows)
          clearCart();
          setStatus("success");
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage("An error occurred while verifying your payment.");
      }
    };

    verifyPayment();
  }, [orderId, reference, trxref, clearCart]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 pt-24 pb-10 mt-10">
      <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl p-8 text-center shadow-xl">
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-gold animate-spin mb-6" />
            <h1 className="font-serif text-3xl mb-2 text-foreground">
              Verifying Payment
            </h1>
            <p className="text-muted-foreground mb-8">
              Please wait while we confirm your transaction...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-gold" />
            </div>
            <h1 className="font-serif text-3xl mb-2 text-foreground">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. Your payment was successful.
            </p>
            {(trackingNumber || orderId) && (
              <p className="text-sm text-foreground mb-8 bg-black/20 py-2 px-4 rounded-lg inline-block">
                Tracking Number:{" "}
                <span className="font-mono text-gold font-bold tracking-widest text-lg ml-2">
                  {trackingNumber || orderId}
                </span>
                <br />
                <span className="text-xs text-muted-foreground mt-2 block">
                  Check your email or visit the{" "}
                  <Link href="/track" className="underline hover:text-gold">
                    Track Order
                  </Link>{" "}
                  page.
                </span>
              </p>
            )}

            <div className="w-full space-y-3">
              <Button
                className="w-full h-12 bg-gold hover:bg-gold/90 text-black font-medium"
                asChild
              >
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-border"
                asChild
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </div>

            <div className="mt-8">
              <TrustBadges />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="font-serif text-3xl mb-2 text-foreground">
              Verification Failed
            </h1>
            <p className="text-muted-foreground mb-8">
              {errorMessage} If your account was charged, please contact support
              with your order ID.
            </p>
            <Button
              className="w-full h-12 bg-gold hover:bg-gold/90 text-black font-medium"
              onClick={() => router.push("/checkout")}
            >
              Return to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <Loader2 className="h-12 w-12 text-gold animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
