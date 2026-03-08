"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBrandSettings } from "@/lib/actions/brand-settings";
import { toast } from "sonner";
import { Loader2, Save, Sparkles } from "lucide-react";

interface BrandSettingsFormProps {
  initialData?: {
    brand_voice: string;
    ai_model_preference: string;
  };
}

const TONES = [
  { id: "Luxury", label: "Luxury (Refined, elegant, high-end)" },
  { id: "Minimal", label: "Minimal (Clean, direct, modern)" },
  { id: "Bold", label: "Bold (Strong, confident, energetic)" },
  { id: "Cultural", label: "Cultural (Heritage-focused, storytelling)" },
  { id: "Playful", label: "Playful (Friendly, accessible, fun)" },
];

export function BrandSettingsForm({ initialData }: BrandSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand_voice: initialData?.brand_voice || "Luxury",
    ai_model_preference: initialData?.ai_model_preference || "openai",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateBrandSettings(formData);
      if (result.error) throw new Error(result.error);
      toast.success("Brand settings updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="brand_voice"
            className="text-sm font-bold uppercase tracking-widest text-muted-foreground"
          >
            Global Brand Voice
          </Label>
          <p className="text-xs text-muted-foreground mb-4">
            This tone will be automatically applied to all AI generations across
            the platform.
          </p>
          <Select
            value={formData.brand_voice}
            onValueChange={(val) =>
              setFormData({ ...formData, brand_voice: val })
            }
          >
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="ai_model"
            className="text-sm font-bold uppercase tracking-widest text-muted-foreground"
          >
            AI Engine Preference
          </Label>
          <p className="text-xs text-muted-foreground mb-4">
            Select the primary AI model provider for content generation.
          </p>
          <Select
            value={formData.ai_model_preference}
            onValueChange={(val) =>
              setFormData({ ...formData, ai_model_preference: val })
            }
          >
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">
                OpenAI (GPT-4o / gpt-4o-mini)
              </SelectItem>
              <SelectItem value="gemini">
                Google Gemini (Gemini 1.5 Pro / Flash)
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="p-3 bg-gold/5 border border-gold/20 rounded-lg flex items-start gap-3 mt-2 md:w-[400px]">
            <Sparkles className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p className="text-[10px] text-gold font-medium leading-relaxed">
              Vercel AI SDK is used to bridge these providers, ensuring seamless
              switching and optimal performance.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border/40">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gold hover:bg-gold-dark text-white px-8"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Brand Configuration
        </Button>
      </div>
    </form>
  );
}
