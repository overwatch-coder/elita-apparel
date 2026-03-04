"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getActivePopups } from "@/lib/actions/marketing-popups";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function PopupManager() {
  const pathname = usePathname();
  const [activePopup, setActivePopup] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show popups on store pages
    if (pathname.startsWith("/admin")) return;

    const loadPopups = async () => {
      try {
        const { popups, error } = await getActivePopups();
        if (error || !popups || popups.length === 0) return;

        // Filter out popups that have already been shown or dismissed
        const availablePopups = popups.filter((p: any) => {
          const dismissed = localStorage.getItem(`popup_dismissed_${p.id}`);
          const shownLast24h = localStorage.getItem(`popup_shown_${p.id}`);

          if (dismissed) return false;

          // Don't show again if shown in the last 24 hours
          if (shownLast24h) {
            const lastShown = new Date(shownLast24h).getTime();
            const now = new Date().getTime();
            if (now - lastShown < 24 * 60 * 60 * 1000) return false;
          }

          return true;
        });

        if (availablePopups.length === 0) return;

        // For now, prioritize by latest created if multiple active
        const popup = availablePopups[0];

        if (popup.type === "early_bird") {
          setTimeout(() => {
            showPopup(popup);
          }, 2000);
        } else if (popup.type === "timed") {
          setTimeout(
            () => {
              showPopup(popup);
            },
            (popup.delay_seconds || 5) * 1000,
          );
        } else if (popup.type === "exit_intent") {
          const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
              showPopup(popup);
              document.removeEventListener("mouseleave", handleMouseLeave);
            }
          };
          document.addEventListener("mouseleave", handleMouseLeave);
          return () =>
            document.removeEventListener("mouseleave", handleMouseLeave);
        }
      } catch (err) {
        console.error("Popup loading error:", err);
      }
    };

    const showPopup = (popup: any) => {
      setActivePopup(popup);
      setIsOpen(true);
      localStorage.setItem(`popup_shown_${popup.id}`, new Date().toISOString());
    };

    loadPopups();
  }, [pathname]);

  const handleDismiss = () => {
    if (activePopup) {
      localStorage.setItem(`popup_dismissed_${activePopup.id}`, "true");
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!activePopup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-card border-none shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>{activePopup.title}</DialogTitle>
          <DialogDescription>{activePopup.content}</DialogDescription>
        </VisuallyHidden>

        <div className="relative group">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </button>

          {activePopup.image_url && (
            <div className="relative h-56 w-full">
              <Image
                src={activePopup.image_url}
                alt={activePopup.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </div>
          )}

          <div className="p-8 text-center bg-card relative">
            <h2 className="font-serif text-3xl mb-4 text-foreground leading-tight">
              {activePopup.title}
            </h2>
            <div className="text-muted-foreground mb-8 text-base leading-relaxed">
              {activePopup.content}
            </div>

            <div className="space-y-4">
              {activePopup.cta_label && (
                <Button
                  asChild
                  className="w-full bg-gold hover:bg-gold-dark text-white font-medium tracking-wider uppercase h-12 rounded-none transition-all duration-300"
                  onClick={handleDismiss}
                >
                  <a href={activePopup.cta_url || "#"}>
                    {activePopup.cta_label}
                  </a>
                </Button>
              )}

              <button
                onClick={handleDismiss}
                className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] hover:text-gold transition-colors font-medium"
              >
                Already subscribed? Don't show again
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
