"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Wand2, Type, AlignLeft, Zap } from "lucide-react";
import { toast } from "sonner";

interface AIRewriteButtonProps {
  text: string;
  onRewrite: (newText: string) => void;
  className?: string;
}

const REWRITE_OPTIONS = [
  {
    id: "luxurious",
    label: "Make it Luxurious",
    icon: Sparkles,
    goal: "Rewrite this to sound more premium, elegant, and high-end.",
  },
  {
    id: "shorter",
    label: "Make it Shorter",
    icon: AlignLeft,
    goal: "Condense this text while keeping the core message.",
  },
  {
    id: "storytelling",
    label: "Add Storytelling",
    icon: Wand2,
    goal: "Add a narrative flair and emotional depth to this description.",
  },
  {
    id: "professional",
    label: "Professional Tone",
    icon: Type,
    goal: "Make it sound more professional and business-like.",
  },
  {
    id: "bold",
    label: "Make it Bold",
    icon: Zap,
    goal: "Make the tone stronger, more confident, and punchy.",
  },
];

export function AIRewriteButton({
  text,
  onRewrite,
  className,
}: AIRewriteButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRewrite = async (goal: string) => {
    if (!text || text.trim().length < 5) {
      toast.error("Please enter some more text first to rewrite.");
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
          type: "rewrite",
          input: { text, goal },
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      onRewrite(data.text);
      toast.success("Content improved!");
    } catch (error: any) {
      console.error("AI Rewrite Error:", error);
      toast.error(error.message || "Failed to rewrite content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isGenerating}
          className={className}
        >
          {isGenerating ? (
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
          ) : (
            <Wand2 className="h-3 w-3 mr-2 text-gold" />
          )}
          {isGenerating ? "Improving..." : "Improve with AI"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
          Refinement Options
        </div>
        <DropdownMenuSeparator />
        {REWRITE_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.id}
            onClick={() => handleRewrite(opt.goal)}
            className="flex items-center gap-2 cursor-pointer focus:text-gold"
          >
            <opt.icon className="h-3.5 w-3.5" />
            <span>{opt.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
