"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  Package,
  Check,
  Sparkles,
  Megaphone,
  BadgePercent,
  ImageIcon,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ProductImageManager } from "@/components/admin/product-image-manager";
import {
  Category,
  Collection,
  FabricType,
  ProductWithImages,
} from "@/lib/types/database";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL"];

interface ProductWizardProps {
  product?: ProductWithImages;
  categories: Category[];
  collections: Collection[];
  fabricTypes: FabricType[];
}

export function ProductWizard({
  product,
  categories,
  collections,
  fabricTypes,
}: ProductWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [createdProductId, setCreatedProductId] = useState<string | null>(
    product?.id || null,
  );
  const isEditing = !!product;

  // Controlled Form State
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    cultural_story: product?.cultural_story || "",
    price: product?.price?.toString() || "",
    discount_percentage: product?.discount_percentage?.toString() || "0",
    stock_quantity: product?.stock_quantity?.toString() || "0",
    category_id: product?.category_id || "",
    collection_id: product?.collection_id || "",
    fabric_type: product?.fabric_type || "",
    is_published: product?.is_published ?? true,
    is_featured: product?.is_featured ?? false,
    is_new: product?.is_new ?? true,
    early_bird_eligible: product?.early_bird_eligible ?? false,
    seo_title: product?.seo_title || "",
    seo_description: product?.seo_description || "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    product?.available_sizes || [],
  );

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Auto-generate slug if it's the name field and we're not editing
      if (field === "name" && !isEditing) {
        newData.slug = (value as string)
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "");
      }
      return newData;
    });
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const totalSteps = 5;

  async function handleSave() {
    const submitData = new FormData();
    // Manually append all state fields to ensure they are present regardless of current step
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });
    submitData.append("available_sizes", JSON.stringify(selectedSizes));

    startTransition(async () => {
      const result = createdProductId
        ? await updateProduct(createdProductId, submitData)
        : await createProduct(submitData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(createdProductId ? "Product updated" : "Product created");
        if (!createdProductId && "data" in result && result.data) {
          setCreatedProductId(result.data.id);
          setStep(4); // Move to Media step
        } else if (step === totalSteps) {
          router.push("/admin/products");
          router.refresh();
        } else {
          nextStep();
        }
      }
    });
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const steps = [
    { title: "Identity", icon: Package },
    { title: "Economics", icon: BadgePercent },
    { title: "Taxonomy", icon: Sparkles },
    { title: "Media", icon: ImageIcon },
    { title: "Status", icon: Megaphone },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Stepper Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative px-2">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/40 -translate-y-1/2 -z-10" />
          {/* Progress Bar Active */}
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

      <div className="mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">Identity & Story</CardTitle>
                  <CardDescription>
                    Tell the history behind this masterpice.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        placeholder="Kente Royal Dress"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          handleInputChange("slug", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Key features and fit..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cultural_story">
                      The Cultural Narrative
                    </Label>
                    <Textarea
                      id="cultural_story"
                      value={formData.cultural_story}
                      onChange={(e) =>
                        handleInputChange("cultural_story", e.target.value)
                      }
                      placeholder="The heritage and significance..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">Economics</CardTitle>
                  <CardDescription>
                    Manage your pricing and inventory levels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (GH₵) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_percentage">Discount (%)</Label>
                      <Input
                        id="discount_percentage"
                        type="number"
                        step="0.1"
                        value={formData.discount_percentage}
                        onChange={(e) =>
                          handleInputChange(
                            "discount_percentage",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Stock Level *</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) =>
                          handleInputChange("stock_quantity", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">Taxonomy</CardTitle>
                  <CardDescription>
                    Classify the product for easier discovery.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(val) =>
                          handleInputChange("category_id", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Collection</Label>
                      <Select
                        value={formData.collection_id}
                        onValueChange={(val) =>
                          handleInputChange("collection_id", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {collections.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fabric</Label>
                      <Select
                        value={formData.fabric_type}
                        onValueChange={(val) =>
                          handleInputChange("fabric_type", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {fabricTypes.map((f) => (
                            <SelectItem key={f.slug} value={f.slug}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="uppercase tracking-widest text-[11px] font-bold text-muted-foreground">
                      Available Sizes
                    </Label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={cn(
                            "h-10 rounded-md text-xs font-bold border transition-all",
                            selectedSizes.includes(size)
                              ? "bg-gold text-white border-gold shadow-sm"
                              : "border-border hover:border-gold/50",
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card className="border-border/50 shadow-sm overflow-hidden text-center">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">Media Assets</CardTitle>
                  <CardDescription>
                    Product images and showcase visuals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  {createdProductId ? (
                    <ProductImageManager
                      productId={createdProductId}
                      initialImages={product?.product_images || []}
                    />
                  ) : (
                    <div className="py-12 flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10">
                        <ImageIcon className="h-8 w-8 text-gold/40" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Creation Required</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          Please save the product details first to enable media
                          uploads and gallery management.
                        </p>
                      </div>
                      <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-gold hover:bg-gold-dark text-white mt-4"
                      >
                        {isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save & Continue to Media
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 5 && (
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-accent/5">
                  <CardTitle className="font-serif">Status & SEO</CardTitle>
                  <CardDescription>
                    Visibility settings and search optimization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "is_published", label: "Published to Store" },
                      { key: "is_featured", label: "Featured Product" },
                      { key: "is_new", label: "New Arrival" },
                      {
                        key: "early_bird_eligible",
                        label: "Early Bird Access",
                      },
                    ].map((t) => (
                      <div
                        key={t.key}
                        className="flex items-center justify-between p-4 border rounded-lg bg-accent/10 border-border/50"
                      >
                        <Label
                          htmlFor={t.key}
                          className="cursor-pointer font-medium"
                        >
                          {t.label}
                        </Label>
                        <Switch
                          id={t.key}
                          checked={
                            formData[t.key as keyof typeof formData] as boolean
                          }
                          onCheckedChange={(val) =>
                            handleInputChange(
                              t.key as keyof typeof formData,
                              val,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <Label className="uppercase tracking-widest text-[11px] font-bold text-muted-foreground">
                      SEO Optimization
                    </Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="seo_title">SEO Title</Label>
                        <Input
                          id="seo_title"
                          value={formData.seo_title}
                          onChange={(e) =>
                            handleInputChange("seo_title", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seo_description">SEO Description</Label>
                        <Textarea
                          id="seo_description"
                          value={formData.seo_description}
                          onChange={(e) =>
                            handleInputChange("seo_description", e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div
        className="flex items-center justify-between mt-12 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border/50 shadow-lg fixed bottom-6 left-[280px] right-6 lg:left-[calc(280px+2.5rem)] lg:right-10 z-40 transition-all duration-300"
        style={{
          left:
            typeof window !== "undefined" &&
            document.querySelector("aside")?.classList.contains("w-16")
              ? "calc(64px + 2.5rem)"
              : undefined,
        }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={prevStep}
          disabled={step === 1 || isPending}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-4">
          {step < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-accent hover:bg-accent/80 text-foreground px-8 border border-border"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}

          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="bg-gold hover:bg-gold-dark text-white px-10 tracking-widest uppercase font-bold shadow-md shadow-gold/20"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : step === totalSteps ? (
              isEditing ? (
                "Update Product"
              ) : (
                "Create Product"
              )
            ) : (
              "Save Draft"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
