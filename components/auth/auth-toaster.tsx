"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function AuthModalContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    let error = searchParams.get("error");
    let errorDescription = searchParams.get("error_description");
    let message = searchParams.get("message");

    // Supabase sometimes appends auth errors/messages to the URL hash fragment instead of search params
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.has("error")) error = hashParams.get("error");
      if (hashParams.has("error_description")) errorDescription = hashParams.get("error_description");
      if (hashParams.has("message")) message = hashParams.get("message");
    }

    if (error || errorDescription || message) {
      const errorMessage = errorDescription || error;
      // Format Supabase specific errors for better UX
      const formattedMessage = errorMessage?.replace(/\+/g, " ");
      const formattedSuccess = message?.replace(/\+/g, " ");

      if (errorMessage) {
        setModalState({
          type: "error",
          title: "Authentication Error",
          message: formattedMessage || "An unknown verification error occurred.",
        });
        setIsOpen(true);
      } else if (message) {
        setModalState({
          type: "success",
          title: "Success",
          message: formattedSuccess || "Verification completed.",
        });
        setIsOpen(true);
      }

      // Cleanup the URL to prevent showing the modal again on refresh
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("error");
      newSearchParams.delete("error_description");
      newSearchParams.delete("message");

      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      // Use replaceState to clear hash and search params without triggering a full Next.js router re-render if possible
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams, pathname]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setModalState(null), 300); // Clear state after animation
  };

  if (!modalState) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md w-[90vw] rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className={`h-2 w-full ${modalState.type === "success" ? "bg-green-500" : "bg-destructive"}`} />
        
        <div className="p-6 pt-8 flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-full ${modalState.type === "success" ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}>
            {modalState.type === "success" ? (
              <CheckCircle2 className="h-10 w-10" />
            ) : (
              <AlertCircle className="h-10 w-10" />
            )}
          </div>
          
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-serif text-2xl tracking-tight text-center">
              {modalState.title}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed text-center">
              {modalState.message}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="p-6 pt-0 bg-muted/10 sm:justify-center border-t border-border/30 mt-2">
          <Button 
            onClick={handleClose} 
            className="w-full sm:w-auto min-w-[120px] font-medium tracking-wide"
            variant={modalState.type === "success" ? "default" : "destructive"}
          >
            {modalState.type === "success" ? "Continue" : "Dismiss"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AuthToaster() {
  return (
    <Suspense fallback={null}>
      <AuthModalContent />
    </Suspense>
  );
}
