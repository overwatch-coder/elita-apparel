"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PopupPreviewProps {
  data: {
    title: string;
    content: string;
    image_url?: string;
    cta_label?: string;
    cta_url?: string;
  };
  className?: string;
}

export function PopupPreview({ data, className }: PopupPreviewProps) {
  // Mock close function for preview
  const handleClose = () => {
    console.log("Popup close clicked in preview");
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-[450px] mx-auto overflow-hidden bg-card rounded-xl shadow-2xl border border-border/50",
        className,
      )}
    >
      <div className="relative group">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {data.image_url && (
          <div className="relative h-56 w-full bg-muted">
            <Image
              src={data.image_url}
              alt={data.title}
              fill
              className="object-cover"
              unoptimized // In preview we might be using temporary or external URLs
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="p-8 text-center bg-card relative">
          <h2 className="font-serif text-3xl mb-4 text-foreground leading-tight">
            {data.title || "Your Popup Title"}
          </h2>
          <div
            className="text-muted-foreground mb-8 text-base leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: data.content || "Your popup description goes here.",
            }}
          />

          <div className="space-y-4">
            {data.cta_label && (
              <Button
                type="button"
                className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase h-12 rounded-none transition-all duration-300"
              >
                {data.cta_label}
              </Button>
            )}

            <button
              type="button"
              className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] hover:text-gold transition-colors font-medium"
            >
              No thanks, I'll pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
