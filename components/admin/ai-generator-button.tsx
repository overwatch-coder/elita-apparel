"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GenerationType } from "@/lib/ai/prompts";

interface AIGeneratorButtonProps {
  type: GenerationType;
  input: any;
  onGenerated: (text: string) => void;
  label?: string;
  className?: string;
}

export function AIGeneratorButton({
  type,
  input,
  onGenerated,
  label = "Generate with AI",
  className,
}: AIGeneratorButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
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
        body: JSON.stringify({ type, input }),
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
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isGenerating}
      onClick={handleGenerate}
      className={className}
    >
      {isGenerating ? (
        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
      ) : (
        <Sparkles className="h-3 w-3 mr-2 text-gold" />
      )}
      {isGenerating ? "Generating..." : label}
    </Button>
  );
}
