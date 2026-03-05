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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Basic info */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description || ""}
                className="mt-1.5"
                rows={4}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="cultural_story">Cultural Story</Label>
              <Textarea
                id="cultural_story"
                name="cultural_story"
                defaultValue={product?.cultural_story || ""}
                className="mt-1.5"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & inventory */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Pricing & Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (GH₵) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price || ""}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="discount_percentage">Discount %</Label>
              <Input
                id="discount_percentage"
                name="discount_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                defaultValue={product?.discount_percentage || 0}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min="0"
                defaultValue={product?.stock_quantity || 0}
                required
                className="mt-1.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classification */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Classification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                name="category_id"
                defaultValue={product?.category_id || ""}
              >
                <SelectTrigger className="mt-1.5">
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
            <div>
              <Label>Collection</Label>
              <Select
                name="collection_id"
                defaultValue={product?.collection_id || ""}
              >
                <SelectTrigger className="mt-1.5">
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
            <div>
              <Label>Fabric Type</Label>
              <Select
                name="fabric_type"
                defaultValue={product?.fabric_type || ""}
              >
                <SelectTrigger className="mt-1.5">
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

          <div>
            <Label>Available Sizes</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-gold text-white border-gold"
                      : "border-border hover:border-gold"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggles */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Visibility & Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                label: "Early Bird Eligible",
                defaultValue: product?.early_bird_eligible ?? false,
              },
            ].map((toggle) => (
              <div
                key={toggle.name}
                className="flex items-center justify-between rounded-md border border-border/50 p-3"
              >
                <Label htmlFor={toggle.name} className="cursor-pointer">
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
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-gold">
            Product Images
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Manage product primary image and gallery."
              : "You can add and manage product images once the product is created."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ProductImageManager
              productId={product.id}
              initialImages={product.product_images || []}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border rounded-lg bg-accent/30">
              <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Create the product first to enable image upload and management.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl">SEO</CardTitle>
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

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-gold hover:bg-gold-dark text-white tracking-wider uppercase"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
