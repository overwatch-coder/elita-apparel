"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createPopup, updatePopup } from "@/lib/actions/marketing-popups";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AIGeneratorButton } from "@/components/admin/ai-generator-button";
import { AIRewriteButton } from "@/components/admin/ai-rewrite-button";

interface PopupFormProps {
  initialData?: any;
  discountCodes: any[];
}

export function PopupForm({ initialData, discountCodes }: PopupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    type: initialData?.type || "early_bird",
    title: initialData?.title || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    cta_label: initialData?.cta_label || "",
    cta_url: initialData?.cta_url || "",
    discount_code: initialData?.discount_code || "none",
    delay_seconds: initialData?.delay_seconds || 5,
    is_active: initialData?.is_active ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = {
      ...formData,
      discount_code:
        formData.discount_code === "none" ? null : formData.discount_code,
    };

    try {
      if (initialData?.id) {
        const { error } = await updatePopup(initialData.id, submissionData);
        if (error) throw new Error(error);
        toast.success("Popup updated successfully");
      } else {
        const { error } = await createPopup(submissionData);
        if (error) throw new Error(error);
        toast.success("Popup created successfully");
      }
      router.push("/admin/marketing/popups");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/marketing/popups"
          className="flex items-center text-sm text-muted-foreground hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Popups
        </Link>
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-[10px] h-11 px-8"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {initialData?.id ? "Update Popup" : "Create Popup"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Internal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Summer Sale Early Bird"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <p className="text-[10px] text-muted-foreground">
                  Only visible to admins.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label htmlFor="title">Display Title</Label>
                  <div className="flex items-center gap-2">
                    <AIGeneratorButton
                      type="popup"
                      label="Generate Headline"
                      input={{
                        target: formData.type,
                        offer: formData.name,
                      }}
                      onGenerated={(text) => {
                        // Extract headline from AI response if it's structured
                        const headline =
                          text.match(/Headline:\s*(.*)/i)?.[1] || text;
                        setFormData((prev) => ({ ...prev, title: headline }));
                      }}
                      size="sm"
                      className="flex-1 sm:flex-none"
                    />
                    <AIRewriteButton
                      text={formData.title}
                      onRewrite={(text) =>
                        setFormData((prev) => ({ ...prev, title: text }))
                      }
                      className="flex-1 sm:flex-none"
                    />
                  </div>
                </div>
                <Input
                  id="title"
                  placeholder="e.g. Get 20% Off Your First Order"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label htmlFor="content">Content / Description</Label>
                  <div className="flex items-center gap-2">
                    <AIGeneratorButton
                      type="popup"
                      label="Generate Content"
                      input={{
                        target: formData.type,
                        offer: formData.title || formData.name,
                      }}
                      onGenerated={(text) => {
                        // Extract subheadline/content from AI response
                        const content =
                          text.match(/Subheadline:\s*(.*)/i)?.[1] || text;
                        setFormData((prev) => ({ ...prev, content }));
                      }}
                      size="sm"
                      className="flex-1 sm:flex-none"
                    />
                  </div>
                </div>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  placeholder="e.g. Subscribe to our newsletter and unlock a special discount code..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_label">CTA Button Label</Label>
                  <Input
                    id="cta_label"
                    placeholder="e.g. Claim Discount"
                    value={formData.cta_label}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_label: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_url">CTA Button URL (Optional)</Label>
                  <Input
                    id="cta_url"
                    placeholder="e.g. /shop"
                    value={formData.cta_url}
                    onChange={(e) =>
                      setFormData({ ...formData, cta_url: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-serif text-lg mb-2">Visuals & Branding</h3>
              <div className="space-y-2">
                <Label htmlFor="image_url">Feature Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
                <p className="text-[10px] text-muted-foreground">
                  High quality lifestyle image recommended (aspect ratio 4:5 or
                  1:1).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="font-serif text-lg mb-2">Targeting & Rewards</h3>

              <div className="space-y-2">
                <Label>Popup Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early_bird">
                      Early Bird (On Load)
                    </SelectItem>
                    <SelectItem value="exit_intent">Exit Intent</SelectItem>
                    <SelectItem value="timed">Timed Delay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "timed" && (
                <div className="space-y-2">
                  <Label htmlFor="delay">Delay (Seconds)</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="1"
                    value={formData.delay_seconds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delay_seconds: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Attached Discount Code</Label>
                <Select
                  value={formData.discount_code}
                  onValueChange={(value) =>
                    setFormData({ ...formData, discount_code: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Discount</SelectItem>
                    {discountCodes.map((code) => (
                      <SelectItem key={code.id} value={code.code}>
                        {code.code} ({code.percentage}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">
                  The code will be revealed or applied when they subscribe.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="space-y-0.5">
                  <Label>Published Status</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Enable to show on storefront immediately.
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
