"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  Package,
  Plus,
  Trash2,
  GripVertical,
  Palette,
  Check,
  X,
} from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { ProductImageManager } from "./product-image-manager";
import { createClient } from "@/lib/supabase/client";
import { SIZES } from "@/lib/constants";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AIGeneratorButton } from "@/components/admin/ai-generator-button";
import { AIRewriteButton } from "@/components/admin/ai-rewrite-button";
import { toast } from "sonner";
import type {
  Product,
  Category,
  Collection,
  FabricType,
  ProductWithImages,
  ProductImage,
} from "@/lib/types/database";
import { cn } from "@/lib/utils";

// ── Shared types ─────────────────────────────────────────────────────

export interface ProductFeature {
  id: string;
  text: string;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image_ids: string[];
}

// ── Features Editor ──────────────────────────────────────────────────

function FeaturesEditor({
  features,
  onChange,
}: {
  features: ProductFeature[];
  onChange: (features: ProductFeature[]) => void;
}) {
  const [newText, setNewText] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const addFeature = () => {
    if (!newText.trim()) return;
    onChange([...features, { id: `feat-${Date.now()}`, text: newText.trim() }]);
    setNewText("");
  };

  const removeFeature = (id: string) => {
    onChange(features.filter((f) => f.id !== id));
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setOverIndex(index);
  };
  const handleDrop = () => {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const reordered = [...features];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, removed);
    onChange(reordered);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {features.map((feat, idx) => (
          <li
            key={feat.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={handleDrop}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border bg-background transition-all cursor-grab active:cursor-grabbing",
              overIndex === idx && dragIndex !== idx
                ? "border-gold bg-gold/5"
                : "border-border/50",
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-sm">{feat.text}</span>
            <button
              type="button"
              onClick={() => removeFeature(feat.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <Input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="e.g. 100% hand-woven Kente fabric"
          className="text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFeature();
            }
          }}
        />
        <Button type="button" onClick={addFeature} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {features.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          No features yet. Add bullet points like fabric, fit, or care details.
        </p>
      )}
    </div>
  );
}

// ── Colors Editor ────────────────────────────────────────────────────

function ColorsEditor({
  colors,
  images,
  onChange,
}: {
  colors: ColorVariant[];
  images: ProductImage[];
  onChange: (colors: ColorVariant[]) => void;
}) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#C6A75E");
  const [editingId, setEditingId] = useState<string | null>(null);

  const addColor = () => {
    if (!name.trim()) return;
    onChange([
      ...colors,
      { id: `color-${Date.now()}`, name: name.trim(), hex, image_ids: [] },
    ]);
    setName("");
    setHex("#C6A75E");
  };

  const removeColor = (id: string) => {
    onChange(colors.filter((c) => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const toggleImage = (colorId: string, imageId: string) => {
    onChange(
      colors.map((c) =>
        c.id === colorId
          ? {
              ...c,
              image_ids: c.image_ids.includes(imageId)
                ? c.image_ids.filter((id) => id !== imageId)
                : [...c.image_ids, imageId],
            }
          : c,
      ),
    );
  };

  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.position - b.position;
  });

  return (
    <div className="space-y-4">
      {/* Color list */}
      <div className="space-y-3">
        {colors.map((color) => (
          <div
            key={color.id}
            className="rounded-lg border border-border/50 overflow-hidden"
          >
            {/* Color header */}
            <div className="flex items-center gap-3 p-3 bg-accent/20">
              <div
                className="h-6 w-6 rounded-full border border-border/50 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <span className="flex-1 text-sm font-medium">{color.name}</span>
              <span className="text-xs text-muted-foreground">
                {color.image_ids.length} images
              </span>
              <button
                type="button"
                onClick={() =>
                  setEditingId(editingId === color.id ? null : color.id)
                }
                className="text-xs text-gold hover:text-gold-dark"
              >
                {editingId === color.id ? "Done" : "Edit"}
              </button>
              <button
                type="button"
                onClick={() => removeColor(color.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Image picker (when editing) */}
            {editingId === color.id && (
              <div className="p-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">
                  Select the images that belong to this color:
                </p>
                {sortedImages.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Upload product images first, then link them to colors.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {sortedImages.map((img) => {
                      const selected = color.image_ids.includes(img.id);
                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => toggleImage(color.id, img.id)}
                          className={cn(
                            "relative aspect-square rounded-md overflow-hidden border-2 transition-all",
                            selected
                              ? "border-gold"
                              : "border-transparent opacity-60 hover:opacity-100",
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {selected && (
                            <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white drop-shadow" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new color */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Color Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Midnight Blue"
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Hex</Label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="h-10 w-10 rounded cursor-pointer border border-border/50 p-0.5 bg-background"
            />
            <Input
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-24 text-sm font-mono"
              maxLength={7}
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={addColor}
          size="sm"
          variant="outline"
          className="h-10"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {colors.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          No color variants yet. Add colors and link them to product images.
        </p>
      )}
    </div>
  );
}

// ── Main Form ────────────────────────────────────────────────────────

interface ProductFormProps {
  product?: ProductWithImages;
  categories: Category[];
  collections: Collection[];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  product,
  categories,
  collections,
}: ProductFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    product?.available_sizes || [],
  );
  const [features, setFeatures] = useState<ProductFeature[]>(
    Array.isArray(product?.features)
      ? (product.features as any[]).map((f: any) => ({
          id: f.id || `feat-${Math.random()}`,
          text: f.text || f,
        }))
      : [],
  );
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>(
    Array.isArray(product?.color_variants)
      ? (product.color_variants as unknown as ColorVariant[])
      : [],
  );
  const [description, setDescription] = useState(product?.description || "");
  const [culturalStory, setCulturalStory] = useState(
    product?.cultural_story || "",
  );
  const [seoTitle, setSeoTitle] = useState(product?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(
    product?.seo_description || "",
  );

  const isEditing = !!product;
  const [fabricTypes, setFabricTypes] = useState<FabricType[]>([]);

  useEffect(() => {
    async function loadFabricTypes() {
      const supabase = createClient();
      const { data } = await supabase
        .from("fabric_types")
        .select("*")
        .order("name");
      if (data) setFabricTypes(data);
    }
    loadFabricTypes();
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    // Add sizes
    formData.delete("sizes");
    selectedSizes.forEach((size) => formData.append("sizes", size));

    // Add features and color variants as JSON
    formData.set("features", JSON.stringify(features));
    formData.set("color_variants", JSON.stringify(colorVariants));

    // Add controlled editor/input values
    formData.set("description", description);
    formData.set("cultural_story", culturalStory);
    formData.set("seo_title", seoTitle);
    formData.set("seo_description", seoDescription);

    try {
      const result = isEditing
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if ("error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Product updated" : "Product created");
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="flex flex-col gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Core Data (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic info */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      className="mt-1.5"
                      placeholder="e.g. Kente Royal Dress"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      className="mt-1.5"
                      placeholder="kente-royal-dress"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Description</Label>
                      <div className="flex items-center gap-2">
                        <AIGeneratorButton
                          type="product_description"
                          input={{ name }}
                          onGenerated={setDescription}
                          label="Generate"
                        />
                      </div>
                    </div>
                    <RichTextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Describe the product, its fit, and details..."
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cultural_story">Cultural Story</Label>
                      <div className="flex items-center gap-2">
                        <AIGeneratorButton
                          type="cultural_story"
                          input={{ name }}
                          onGenerated={setCulturalStory}
                          label="Generate"
                        />
                      </div>
                    </div>
                    <RichTextEditor
                      value={culturalStory}
                      onChange={setCulturalStory}
                      placeholder="Share the heritage and story behind this piece..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & inventory */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Pricing & Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Price (GH₵) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={product?.price || ""}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="discount_percentage">Discount %</Label>
                    <Input
                      id="discount_percentage"
                      name="discount_percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      defaultValue={product?.discount_percentage || 0}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stock_quantity">Stock *</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      min="0"
                      defaultValue={product?.stock_quantity || 0}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Product Features
                </CardTitle>
                <CardDescription>
                  Bullet-point highlights shown on the product page. Drag to
                  reorder.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeaturesEditor features={features} onChange={setFeatures} />
              </CardContent>
            </Card>

            {/* Color Variants */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <Palette className="h-5 w-5 text-gold" />
                  Color Variants
                </CardTitle>
                <CardDescription>
                  Define colors and link each to specific product images for
                  swatching.
                  {!isEditing &&
                    " Upload images after creating the product to link them."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorsEditor
                  colors={colorVariants}
                  images={product?.product_images || []}
                  onChange={setColorVariants}
                />
              </CardContent>
            </Card>

            {/* Product Images (only in edit mode) */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl text-gold">
                  Product Images
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Manage product primary image and gallery."
                    : "Enable image management after creation."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <ProductImageManager
                    productId={product.id}
                    initialImages={product.product_images || []}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-border rounded-lg bg-accent/30">
                    <Package className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground max-w-[250px]">
                      Create the product first to enable image upload.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  SEO Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <div className="flex items-center gap-2">
                      <AIGeneratorButton
                        type="seo"
                        label="Optimized Title"
                        input={{ name, description }}
                        onGenerated={(text) => {
                          const title =
                            text.match(/Title:\s*(.*)/i)?.[1] || text;
                          setSeoTitle(title);
                        }}
                      />
                      <AIRewriteButton
                        text={seoTitle}
                        onRewrite={setSeoTitle}
                      />
                    </div>
                  </div>
                  <Input
                    id="seo_title"
                    name="seo_title"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="e.g. Kente Royal Dress | Elita Apparel"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <div className="flex items-center gap-2">
                      <AIGeneratorButton
                        type="seo"
                        label="Optimized Desc"
                        input={{ name, description }}
                        onGenerated={(text) => {
                          const desc =
                            text.match(/Description:\s*(.*)/i)?.[1] || text;
                          setSeoDescription(desc);
                        }}
                      />
                      <AIRewriteButton
                        text={seoDescription}
                        onRewrite={setSeoDescription}
                      />
                    </div>
                  </div>
                  <Textarea
                    id="seo_description"
                    name="seo_description"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    placeholder="Brief summary for search engines..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Meta & Classification (1/3 width) */}
          <div className="space-y-8">
            {/* Toggles */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "is_published",
                    label: "Published",
                    defaultValue: product?.is_published ?? false,
                  },
                  {
                    name: "is_featured",
                    label: "Featured",
                    defaultValue: product?.is_featured ?? false,
                  },
                  {
                    name: "is_new",
                    label: "New Arrival",
                    defaultValue: product?.is_new ?? true,
                  },
                  {
                    name: "early_bird_eligible",
                    label: "Early Bird",
                    defaultValue: product?.early_bird_eligible ?? false,
                  },
                ].map((toggle) => (
                  <div
                    key={toggle.name}
                    className="flex items-center justify-between rounded-md border border-border/50 p-3"
                  >
                    <Label
                      htmlFor={toggle.name}
                      className="cursor-pointer text-sm"
                    >
                      {toggle.label}
                    </Label>
                    <input type="hidden" name={toggle.name} value="false" />
                    <Switch
                      id={toggle.name}
                      name={toggle.name}
                      defaultChecked={toggle.defaultValue}
                      value="true"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Classification */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="font-serif text-xl">
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      name="category_id"
                      defaultValue={product?.category_id || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Collection</Label>
                    <Select
                      name="collection_id"
                      defaultValue={product?.collection_id || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {collections.map((col) => (
                          <SelectItem key={col.id} value={col.id}>
                            {col.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Fabric</Label>
                    <Select
                      name="fabric_type"
                      defaultValue={product?.fabric_type || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select fabric" />
                      </SelectTrigger>
                      <SelectContent>
                        {fabricTypes.map((fabric) => (
                          <SelectItem key={fabric.slug} value={fabric.slug}>
                            {fabric.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Label className="text-sm font-semibold mb-3 block italic">
                    Available Sizes
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={cn(
                          "h-9 rounded-md text-xs border transition-all flex items-center justify-center font-bold",
                          selectedSizes.includes(size)
                            ? "bg-gold text-white border-gold shadow-md"
                            : "border-border/50 hover:border-gold/50 text-muted-foreground",
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-8 border-border/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-gold hover:bg-gold-dark text-white px-10 tracking-widest uppercase font-bold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}
