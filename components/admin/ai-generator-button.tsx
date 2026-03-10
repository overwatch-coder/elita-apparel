"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { GenerationType } from "@/lib/ai/prompts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AIGeneratorButtonProps {
  type: GenerationType;
  input: any;
  onGenerated: (text: string) => void;
  label?: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function AIGeneratorButton({
  type,
  input,
  onGenerated,
  label = "Generate with AI",
  className,
  size = "sm",
}: AIGeneratorButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [showCustomDialog, setShowCustomDialog] = useState(false);

  const handleGenerate = async (instructions?: string) => {
    // Basic validation: ensure we have at least a name for product-related tasks
    if (type === "product_description" && !input.name) {
      toast.error(
        "Please enter a product name first to provide context for AI.",
      );
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          input,
          customInstructions: instructions,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      onGenerated(data.text);
      toast.success("Content generated successfully!");
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size={size}
            disabled={isGenerating}
            className={className}
          >
            {isGenerating ? (
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3 mr-2 text-gold" />
            )}
            {isGenerating ? "Generating..." : label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleGenerate()}
            className="cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2 text-gold" />
            Standard Generation
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowCustomDialog(true)}
            className="cursor-pointer"
          >
            <MessageSquarePlus className="h-3.5 w-3.5 mr-2 text-gold" />
            Custom Instructions...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-serif">
              Custom AI Instructions
            </DialogTitle>
            <DialogDescription>
              Provide specific guidance for the AI to follow while generating
              your content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="instructions"
                className="text-xs uppercase tracking-widest text-muted-foreground font-bold"
              >
                Your Instructions
              </Label>
              <Textarea
                id="instructions"
                placeholder="e.g. Focus on the sustainable materials... or Keep it under 20 words..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="min-h-[120px] bg-muted/20 border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomDialog(false)}
              className="uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleGenerate(customInstructions)}
              disabled={isGenerating || !customInstructions.trim()}
              className="bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-[10px]"
            >
              {isGenerating ? "Generating..." : "Generate with Instructions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
