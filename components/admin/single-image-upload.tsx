"use client";

import { useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SingleImageUploadProps {
  name: string;
  defaultValue?: string | null;
  className?: string;
  onChange?: (url: string | File) => void;
}

export function SingleImageUpload({
  name,
  defaultValue = "",
  className = "",
  onChange,
}: SingleImageUploadProps) {
  const [preview, setPreview] = useState<string>(defaultValue || "");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup preview URL if it's a blob
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Local preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setFile(selectedFile);

    if (onChange) onChange(selectedFile);
  };

  const handleRemove = () => {
    setPreview("");
    setFile(null);
    if (onChange) onChange("");

    // Clear the real file input too
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Real file input - always in DOM so FormData captures it */}
      <input
        id={name}
        name={name}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border border-border group">
          <img
            src={preview}
            alt="Preview"
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
        <label
          htmlFor={name}
          className="flex flex-col items-center justify-center w-full max-w-sm h-32 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-white/5 hover:border-cream/30 transition-colors relative"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to select image
            </p>
          </div>
        </label>
      )}

      {/* If we have an existing URL but no new file, we still need to tell the server the URL persists */}
      {preview && !file && !preview.startsWith("blob:") && (
        <input type="hidden" name={`${name}_url`} value={preview} />
      )}
    </div>
  );
}
