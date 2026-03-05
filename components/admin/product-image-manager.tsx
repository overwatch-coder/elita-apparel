"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Star,
  StarOff,
  Loader2,
  Plus,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  uploadProductImage,
  deleteProductImage,
  setPrimaryImage,
} from "@/lib/actions/images";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  position: number;
}

interface ProductImageManagerProps {
  productId: string;
  initialImages: ProductImage[];
}

export function ProductImageManager({
  productId,
  initialImages,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadProductImage(productId, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Image uploaded successfully");
      // Refresh images list (in a real app we'd fetch or update state)
      // For simplicity here, we'll suggest a refresh if we can't get the new ID easily
      // But uploadProductImage returns success: true, url: publicUrl
      // We should ideally reload the page or fetch updated images
      window.location.reload();
    }
    setIsUploading(false);
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const result = await deleteProductImage(imageId, productId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Image deleted");
      setImages(images.filter((img) => img.id !== imageId));
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    const result = await setPrimaryImage(imageId, productId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Primary image updated");
      setImages(
        images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        })),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="flex items-center justify-center w-full">
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-accent/30 hover:bg-accent/50 transition-colors border-border",
            isUploading && "opacity-50 cursor-not-allowed",
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 mb-3 animate-spin text-gold" />
            ) : (
              <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
            )}
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-gold">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-muted-foreground/60">
              Primary or additional product images (MAX. 5MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images
            .sort((a, b) =>
              a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1,
            )
            .map((image) => (
              <div
                key={image.id}
                className={cn(
                  "relative group aspect-square rounded-lg overflow-hidden border-2",
                  image.is_primary ? "border-gold" : "border-border/50",
                )}
              >
                <Image
                  src={image.image_url}
                  alt="Product"
                  fill
                  className="object-cover"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.is_primary && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/20 hover:bg-gold text-white"
                      onClick={() => handleSetPrimary(image.id)}
                      title="Set as Primary"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleDelete(image.id)}
                    title="Delete Image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-gold text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Primary
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg bg-accent/10 border-border/50">
          <ImageIcon className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">
            No images uploaded yet.
          </p>
        </div>
      )}
    </div>
  );
}
