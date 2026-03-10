"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createPopup, updatePopup } from "@/lib/actions/marketing-popups";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Save,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Type,
  Layout,
  Settings,
  Eye,
  Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AIGeneratorButton } from "@/components/admin/ai-generator-button";
import { AIRewriteButton } from "@/components/admin/ai-rewrite-button";
import { PopupPreview } from "./popup-preview";

interface PopupWizardProps {
  initialData?: any;
  discountCodes: any[];
}

export function PopupWizard({ initialData, discountCodes }: PopupWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSave = async (publish: boolean = false) => {
    const submissionData = {
      ...formData,
      is_active: publish ? true : formData.is_active,
      discount_code:
        formData.discount_code === "none" ? null : formData.discount_code,
    };

    startTransition(async () => {
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
      }
    });
  };

  const steps = [
    { title: "Basics", icon: Layout },
    { title: "Design", icon: Type },
    { title: "Behavior", icon: Settings },
    { title: "Review", icon: Eye },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Stepper Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/40 -translate-y-1/2 -z-10" />
          <motion.div
            className="absolute top-1/2 left-0 h-[2px] bg-gold -translate-y-1/2 -z-10"
            initial={false}
            animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {steps.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;

            return (
              <div key={s.title} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setStep(stepNum)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-background z-10",
                    isActive &&
                      "border-gold text-gold ring-4 ring-gold/10 scale-110",
                    isCompleted && "border-gold bg-gold text-white",
                    !isActive &&
                      !isCompleted &&
                      "border-border text-muted-foreground hover:border-gold/30",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </button>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-widest font-bold mt-3 absolute -bottom-8 whitespace-nowrap",
                    isActive ? "text-gold" : "text-muted-foreground",
                  )}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 pb-20 lg:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Basics */}
            {step === 1 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">
                    Popup Configuration
                  </CardTitle>
                  <CardDescription>
                    Give your popup a name and choose how it triggers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Internal Reference Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Summer Sale Early Bird"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Only visible to you in the dashboard.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Trigger Mechanism
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "early_bird",
                          label: "On Page Load",
                          desc: "Shows after 2 seconds",
                        },
                        {
                          id: "exit_intent",
                          label: "Exit Intent",
                          desc: "Shows on mouse leave",
                        },
                        {
                          id: "timed",
                          label: "Timed Delay",
                          desc: "Custom second delay",
                        },
                      ].map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleInputChange("type", type.id)}
                          className={cn(
                            "flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center gap-1",
                            formData.type === type.id
                              ? "border-gold bg-gold/5 text-foreground"
                              : "border-border hover:border-gold/30",
                          )}
                        >
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {type.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {type.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Content */}
            {step === 2 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">Visual Content</CardTitle>
                  <CardDescription>
                    Design the message your customers will see.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Label htmlFor="title">Display Headline *</Label>
                      <div className="flex items-center gap-2">
                        <AIGeneratorButton
                          type="popup"
                          label="AI Headline"
                          size="sm"
                          input={{
                            target: formData.type,
                            offer: formData.name,
                          }}
                          onGenerated={(text) => {
                            const headline =
                              text.match(/Headline:\s*(.*)/i)?.[1] || text;
                            handleInputChange("title", headline);
                          }}
                          className="flex-1 sm:flex-none"
                        />
                        <AIRewriteButton
                          text={formData.title}
                          onRewrite={(text) => handleInputChange("title", text)}
                          className="flex-1 sm:flex-none"
                        />
                      </div>
                    </div>
                    <Input
                      id="title"
                      placeholder="e.g. Join the Elita Club & Get 20% Off"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <Label htmlFor="content">Popup Body Text</Label>
                      <AIGeneratorButton
                        type="popup"
                        label="AI Description"
                        size="sm"
                        input={{
                          target: formData.type,
                          offer: formData.title || formData.name,
                        }}
                        onGenerated={(text) => {
                          const content =
                            text.match(/Subheadline:\s*(.*)/i)?.[1] || text;
                          handleInputChange("content", content);
                        }}
                      />
                    </div>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(val) => handleInputChange("content", val)}
                      placeholder="Share details of your offer..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">
                      Background / Side Image URL
                    </Label>
                    <Input
                      id="image_url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image_url}
                      onChange={(e) =>
                        handleInputChange("image_url", e.target.value)
                      }
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Paste a URL to a lifestyle image for maximum impact.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Behavior */}
            {step === 3 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">
                    Behavior & Rewards
                  </CardTitle>
                  <CardDescription>
                    Configure buttons, discounts, and timing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cta_label">Button Label</Label>
                      <Input
                        id="cta_label"
                        placeholder="e.g. Shop Now"
                        value={formData.cta_label}
                        onChange={(e) =>
                          handleInputChange("cta_label", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cta_url">Button Destination URL</Label>
                      <Input
                        id="cta_url"
                        placeholder="e.g. /collections/new-arrivals"
                        value={formData.cta_url}
                        onChange={(e) =>
                          handleInputChange("cta_url", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="uppercase tracking-widest text-[11px] font-bold text-muted-foreground">
                        Reward System
                      </Label>
                      <Select
                        value={formData.discount_code}
                        onValueChange={(val) =>
                          handleInputChange("discount_code", val)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a discount code" />
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
                      <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                        The code will be revealed to the user upon dismissal or
                        CTA click.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label className="uppercase tracking-widest text-[11px] font-bold text-muted-foreground">
                        Timing Control
                      </Label>
                      <div className="space-y-2">
                        <Label htmlFor="delay" className="text-xs">
                          Delay in Seconds
                        </Label>
                        <Input
                          id="delay"
                          type="number"
                          min="1"
                          max="60"
                          value={formData.delay_seconds}
                          disabled={formData.type !== "timed"}
                          onChange={(e) =>
                            handleInputChange(
                              "delay_seconds",
                              parseInt(e.target.value),
                            )
                          }
                          className="w-full"
                        />
                        {formData.type !== "timed" && (
                          <p className="text-[10px] text-muted-foreground">
                            Only applicable for "Timed Delay" trigger.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
              <div className="space-y-8">
                <Card className="border-border/50 shadow-sm overflow-hidden">
                  <CardHeader className="bg-accent/5">
                    <CardTitle className="font-serif">Live Preview</CardTitle>
                    <CardDescription>
                      This is exactly how your popup will appear on the store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-8 bg-accent/10">
                    <PopupPreview
                      data={formData}
                      className="scale-90 sm:scale-100 origin-top"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gold/5 border-gold/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-serif text-lg">Platform Status</h4>
                        <p className="text-xs text-muted-foreground">
                          Enabled popups will show to customers immediately.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                          {formData.is_active ? "Live" : "Draft"}
                        </span>
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(checked) =>
                            handleInputChange("is_active", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-12 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-lg fixed bottom-4 left-4 right-4 md:bottom-6 md:left-[280px] md:right-6 lg:left-[calc(280px+2.5rem)] lg:right-10 z-40 gap-4 transition-all duration-300">
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1 || isPending}
          className="text-muted-foreground hover:text-foreground order-2 sm:order-1"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>

        <div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
          {step < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex-1 sm:flex-none bg-accent hover:bg-accent/80 text-foreground px-8 border border-border h-11"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isPending}
              className="flex-1 sm:flex-none bg-gold hover:bg-gold-dark text-white px-10 tracking-widest uppercase font-bold shadow-md shadow-gold/20 h-11"
            >
              <Rocket className="mr-2 h-4 w-4" />
              {isPending ? "Launching..." : "Publish Popup"}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isPending}
            className="flex-1 sm:flex-none border-border hover:bg-accent h-11 uppercase tracking-widest text-[10px] font-bold px-8"
          >
            {isPending && step < totalSteps ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
