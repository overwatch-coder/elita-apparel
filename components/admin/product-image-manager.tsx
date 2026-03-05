"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Star,
  Loader2,
  ImageIcon,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
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

interface PendingFile {
  file: File;
  previewUrl: string;
}

export function ProductImageManager({
  productId,
  initialImages,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPending = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPendingFiles((prev) => [...prev, ...newPending]);

    // Reset input value to allow selecting same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleBatchUpload = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const pending of pendingFiles) {
      const formData = new FormData();
      formData.append("file", pending.file);

      const result = await uploadProductImage(productId, formData);
      if (result.error) {
        failCount++;
        console.error(`Upload failed for ${pending.file.name}:`, result.error);
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`);
      // Revoke all preview URLs
      pendingFiles.forEach((pf) => URL.revokeObjectURL(pf.previewUrl));
      setPendingFiles([]);
      window.location.reload(); // Refresh to get DB IDs and updated state
    }

    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} image(s)`);
    }

    setIsUploading(false);
  };

  const handleDelete = async (imageId: string) => {
    const result = await deleteProductImage(imageId, productId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Image deleted");
      setImages(images.filter((img) => img.id !== imageId));
    }
    setDeleteId(null);
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
    <div className="space-y-8">
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Image?"
        description="This action cannot be undone. This image will be permanently removed from the product gallery."
        variant="destructive"
        confirmText="Delete"
      />

      <div className="flex flex-col gap-6">
        {/* Gallery Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Active Gallery */}
          {images
            .sort((a, b) => (a.is_primary ? -1 : b.is_primary ? 1 : 0))
            .map((image) => (
              <div
                key={image.id}
                className={cn(
                  "relative group aspect-square rounded-xl overflow-hidden border-2 transition-all",
                  image.is_primary ? "border-gold" : "border-border/50",
                )}
              >
                <Image
                  src={image.image_url}
                  alt="Product"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.is_primary && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-white/20 hover:bg-gold text-white"
                      onClick={() => handleSetPrimary(image.id)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setDeleteId(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-gold text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
                    Primary
                  </div>
                )}
              </div>
            ))}

          {/* Pending Previews */}
          {pendingFiles.map((pending, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gold/50 bg-gold/5 grayscale-[0.5]"
            >
              <Image
                src={pending.previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gold/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={() => removePendingFile(idx)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded font-medium border border-border/50">
                Pending
              </div>
            </div>
          ))}

          {/* Add Button */}
          <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-gold/50 hover:bg-gold/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-gold group">
            <Plus className="h-8 w-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Add Photos</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Action Bar */}
        {pendingFiles.length > 0 && (
          <div className="flex items-center justify-between p-4 rounded-xl border border-gold/20 bg-gold/5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                <ImageIcon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {pendingFiles.length} New Images Ready
                </p>
                <p className="text-xs text-muted-foreground">
                  Photos are staged but not yet uploaded to the cloud.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPendingFiles([])}
                disabled={isUploading}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
              <Button
                onClick={handleBatchUpload}
                disabled={isUploading}
                size="sm"
                className="bg-gold hover:bg-gold-dark text-white font-bold px-6"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Save & Upload All
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {!images.length && !pendingFiles.length && (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-2xl bg-accent/10 border-border/50">
          <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10 mb-4">
            <ImageIcon className="h-8 w-8 text-gold/30" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium">Gallery is Empty</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Bring your product to life with high-quality cultural assets.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
