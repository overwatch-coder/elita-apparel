"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribeFromNewsletter } from "@/app/actions/marketing";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async () => {
    if (!email) return;
    setStatus("loading");

    const result = await unsubscribeFromNewsletter(email);
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage(result.message || "Successfully unsubscribed.");
    }
  };

  if (!email) {
    return (
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-serif text-foreground">Invalid Request</h1>
        <p className="text-muted-foreground">
          Missing email address. Please check your link.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-4 border-border text-foreground"
        >
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 max-w-md mx-auto">
      {status === "idle" && (
        <>
          <h1 className="text-2xl font-serif text-foreground">Unsubscribe</h1>
          <p className="text-muted-foreground">
            We're sorry to see you go! Are you sure you want to stop receiving
            marketing emails for <strong>{email}</strong>?
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleUnsubscribe}
              className="bg-destructive hover:bg-destructive/90 text-white font-medium uppercase tracking-widest text-xs h-12"
            >
              Yes, Unsubscribe Me
            </Button>
            <Button asChild variant="ghost" className="text-muted-foreground">
              <Link href="/">No, take me back</Link>
            </Button>
          </div>
        </>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-10 w-10 animate-spin text-gold" />
          <p className="text-muted-foreground">Processing your request...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 py-8">
          <CheckCircle2 className="h-16 w-16 text-ghana-green mx-auto" />
          <h2 className="text-2xl font-serif text-foreground">
            You've Unsubscribed
          </h2>
          <p className="text-muted-foreground">{message}</p>
          <Button
            asChild
            variant="outline"
            className="mt-6 border-border text-foreground"
          >
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4 py-8">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-serif text-foreground">Opps!</h2>
          <p className="text-muted-foreground">{message}</p>
          <Button
            onClick={() => setStatus("idle")}
            variant="outline"
            className="mt-6 border-border text-foreground"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="pt-32 pb-20 min-h-[60vh] flex items-center justify-center bg-background px-4">
      <Suspense
        fallback={<Loader2 className="h-8 w-8 animate-spin text-gold" />}
      >
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
