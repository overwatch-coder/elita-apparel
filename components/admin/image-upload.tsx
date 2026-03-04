"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  uploadProductImage,
  deleteProductImage,
  setPrimaryImage,
} from "@/lib/actions/images";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ProductImage } from "@/lib/types/database";

interface ImageUploadProps {
  productId: string;
  images: ProductImage[];
}

export function ImageUpload({ productId, images }: ImageUploadProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      setIsUploading(true);
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadProductImage(productId, formData);
        if (result.error) {
          toast.error(`Failed to upload ${file.name}: ${result.error}`);
        }
      }

      toast.success(
        `${fileArray.length} image${fileArray.length > 1 ? "s" : ""} uploaded`,
      );
      setIsUploading(false);
      router.refresh();
    },
    [productId, router],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload],
  );

  const handleDelete = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    const result = await deleteProductImage(imageId, productId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Image deleted");
      router.refresh();
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    const result = await setPrimaryImage(imageId, productId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Primary image updated");
      router.refresh();
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-serif text-xl">Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images
              .sort((a, b) => a.position - b.position)
              .map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-border/50"
                >
                  <Image
                    src={img.image_url}
                    alt="Product image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Primary badge */}
                  {img.is_primary && (
                    <div className="absolute top-1.5 left-1.5 bg-gold text-white text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Primary
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!img.is_primary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 text-xs"
                        onClick={() => handleSetPrimary(img.id)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs"
                      onClick={() => handleDelete(img.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Upload area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-gold bg-gold/5"
              : "border-border/50 hover:border-gold/50"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop images here, or{" "}
                <label className="text-gold hover:text-gold-dark cursor-pointer font-medium">
                  browse
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground/60">
                JPEG, PNG, WebP, or AVIF • Max 5MB each
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
