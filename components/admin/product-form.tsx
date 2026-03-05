"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Loader2, Package } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { ProductImageManager } from "./product-image-manager";
import { createClient } from "@/lib/supabase/client";
import { SIZES } from "@/lib/constants";
import { toast } from "sonner";
import type {
  Product,
  Category,
  Collection,
  FabricType,
  ProductWithImages,
} from "@/lib/types/database";
import { cn } from "@/lib/utils";

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
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={product?.description || ""}
                      className="mt-1.5"
                      rows={5}
                      placeholder="Describe the product, its fit, and details..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="cultural_story">Cultural Story</Label>
                    <Textarea
                      id="cultural_story"
                      name="cultural_story"
                      defaultValue={product?.cultural_story || ""}
                      className="mt-1.5"
                      rows={4}
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

            {/* Product Images (only in edit mode or bottom) */}
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
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    name="seo_title"
                    defaultValue={product?.seo_title || ""}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    name="seo_description"
                    defaultValue={product?.seo_description || ""}
                    className="mt-1.5"
                    rows={3}
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

        {/* Persistent Submit Bar Alternative (standard bottom placement but clean) */}
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
