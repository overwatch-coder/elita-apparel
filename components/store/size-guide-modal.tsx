"use client";

import { useState, useEffect } from "react";
import { Ruler } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getSizeGuide } from "@/app/actions/size-guides";

interface SizeGuideModalProps {
  sizeGuideId: string;
}

export function SizeGuideModal({ sizeGuideId }: SizeGuideModalProps) {
  const [guide, setGuide] = useState<{
    title: string;
    content_html: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async (open: boolean) => {
    if (open && !guide) {
      setIsLoading(true);
      const data = await getSizeGuide(sizeGuideId);
      if (data) {
        setGuide({ title: data.title, content_html: data.content_html });
      }
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors">
          <Ruler className="h-4 w-4" />
          <span className="underline underline-offset-2">View Size Guide</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {guide?.title || "Size Guide"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : guide ? (
          <div className="space-y-6">
            <div
              className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-muted [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm"
              dangerouslySetInnerHTML={{ __html: guide.content_html }}
            />

            {/* How to measure section */}
            <div className="p-4 rounded-lg bg-gold/5 border border-gold/10">
              <h4 className="font-serif text-sm font-medium mb-2 text-gold">
                How to Measure
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Bust:</strong> Measure around the fullest part of your
                  bust
                </li>
                <li>
                  <strong>Waist:</strong> Measure around the narrowest part of
                  your waist
                </li>
                <li>
                  <strong>Hips:</strong> Measure around the widest part of your
                  hips
                </li>
                <li>
                  <strong>Length:</strong> Measure from shoulder to desired hem
                  length
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            Size guide not available.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
