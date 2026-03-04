"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SingleImageUploadProps {
  name: string;
  defaultValue?: string | null;
  bucket?: string;
  className?: string;
  onChange?: (url: string) => void;
}

export function SingleImageUpload({
  name,
  defaultValue = "",
  bucket = "product-images", // default fallback
  className = "",
  onChange,
}: SingleImageUploadProps) {
  const [url, setUrl] = useState<string>(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      setUrl(data.publicUrl);
      if (onChange) onChange(data.publicUrl);
      toast.success("Image uploaded successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      // reset file input
      if (e.target) e.target.value = "";
    }
  };

  const handleRemove = () => {
    setUrl("");
    if (onChange) onChange("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden input to pass value to the form */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border border-border group">
          <img
            src={url}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-8"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-sm h-32 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-white/5 hover:border-cream/30 transition-colors relative">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
            ) : (
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
            )}
            <p className="text-sm text-muted-foreground">
              {isUploading ? "Uploading..." : "Click to upload image"}
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
      )}
    </div>
  );
}
