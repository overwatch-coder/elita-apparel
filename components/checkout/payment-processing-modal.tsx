"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Smartphone, Upload, Copy } from "lucide-react";
import { PAYMENT_INFO } from "@/lib/constants";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { updateOrderPaymentProof } from "@/lib/actions/orders";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function ProofUploadStep({
  orderId,
  onUploadComplete,
}: {
  orderId: string | null;
  onUploadComplete?: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !orderId) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${orderId}-${Math.random()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);

      const result = await updateOrderPaymentProof(orderId, publicUrl);
      if (result.error) throw new Error(result.error);

      toast.success("Proof uploaded successfully!");
      if (onUploadComplete) onUploadComplete();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload proof");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 w-full">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-xl bg-gold/20 animate-pulse" />
        <div className="h-20 w-20 bg-gold/10 rounded-full flex items-center justify-center relative border border-gold/30">
          <Upload className="h-10 w-10 text-gold" />
        </div>
      </div>

      <div className="w-full space-y-6">
        <div>
          <h3 className="text-xl font-serif text-foreground mb-2">
            Upload Proof of Payment
          </h3>
          <p className="text-sm text-muted-foreground">
            Please upload a screenshot of your transfer confirmation.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative group overflow-hidden bg-muted/30 border-2 border-dashed border-border rounded-xl p-8 hover:border-gold/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground group-hover:text-gold transition-colors" />
              <p className="text-sm font-medium">
                {file ? file.name : "Select or drag proof image"}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or PDF (max. 5MB)
              </p>
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full bg-gold hover:bg-gold-dark text-white h-12 tracking-wider uppercase"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Submit Proof"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PaymentProcessingModalProps {
  isOpen: boolean;
  status:
    | "idle"
    | "processing"
    | "success"
    | "error"
    | "manual_payment"
    | "upload_proof";
  onClose?: () => void;
  orderId?: string | null;
  trackingNumber?: string | null;
  totalAmount?: number;
}

export function PaymentProcessingModal({
  isOpen,
  status,
  onClose,
  orderId,
  trackingNumber,
  totalAmount,
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
        className={`bg-background border border-border/50 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transition-all duration-500 transform max-h-[90vh] overflow-y-auto ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {status === "processing" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-2xl bg-gold/20 animate-pulse" />
                <Loader2 className="h-16 w-16 text-gold animate-spin relative" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-foreground mb-2">
                  Processing Payment
                </h3>
                <p className="text-sm text-muted-foreground max-w-[240px]">
                  Please wait while we securely process your transaction. Do not
                  refresh the page.
                </p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-2xl bg-ghana-green/20 animate-pulse" />
                <CheckCircle2 className="h-16 w-16 text-ghana-green relative" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-foreground mb-2">
                  Payment Successful
                </h3>
                <p className="text-sm text-muted-foreground w-64">
                  Thank you for your purchase! We've received your payment and
                  are preparing your order.
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <div className="h-8 w-2 bg-destructive rounded-full" />
                <div className="h-2 w-2 bg-destructive rounded-full mt-6 -ml-2" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-foreground mb-2">
                  Payment Failed
                </h3>
                <p className="text-sm text-muted-foreground">
                  Something went wrong with your transaction. Please try again
                  or choose another method.
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-border hover:bg-muted"
              >
                Close and Try Again
              </Button>
            </>
          )}

          {status === "manual_payment" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl bg-gold/20 animate-pulse" />
                <div className="h-20 w-20 bg-gold/10 rounded-full flex items-center justify-center relative border border-gold/30">
                  <Smartphone className="h-10 w-10 text-gold" />
                </div>
              </div>
              <div className="w-full space-y-6">
                <div>
                  <h3 className="text-xl font-serif text-foreground mb-2">
                    Manual Momo Transfer
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please transfer the total amount to the account below:
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-xl space-y-3 text-left border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Account Number
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(PAYMENT_INFO.number);
                        toast.success("Copied to clipboard");
                      }}
                      className="text-gold hover:text-gold-light"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-mono text-lg font-bold text-foreground tracking-wider">
                    {PAYMENT_INFO.number}
                  </p>

                  <Separator className="bg-border/20" />

                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Account Name
                    </span>
                    <p className="font-medium text-foreground">
                      {PAYMENT_INFO.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Reference
                    </span>
                    <p className="font-medium text-gold font-mono uppercase">
                      {trackingNumber || orderId?.slice(0, 8) || "ELITA-ORDER"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400 text-left">
                    <strong>Important:</strong> Please use the Order Number or
                    your name as the transfer reference to speed up
                    verification.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase py-4 rounded-xl transition-all shadow-lg shadow-gold/20"
                  >
                    Payment Complete
                  </button>
                </div>
              </div>
            </>
          )}

          {status === "upload_proof" && (
            <ProofUploadStep
              orderId={orderId ?? null}
              onUploadComplete={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
