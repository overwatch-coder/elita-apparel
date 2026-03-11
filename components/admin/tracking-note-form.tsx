"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateTrackingNote } from "@/lib/actions/admin";
import { toast } from "sonner";

interface TrackingNoteFormProps {
  orderId: string;
  initialNote: string;
}

export function TrackingNoteForm({
  orderId,
  initialNote,
}: TrackingNoteFormProps) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateTrackingNote(orderId, note);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Tracking note updated");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update tracking note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Tracking Note</h2>
        <p className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
          Visible to Customer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Package dispatched via DHL. Tracking number: 123456789. Estimated delivery: Oct 20th."
          className="min-h-[120px] resize-y"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || note === initialNote}
            className="bg-gold hover:bg-gold-dark text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Note"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
