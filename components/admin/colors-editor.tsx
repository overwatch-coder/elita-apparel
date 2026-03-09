"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types/database";

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image_ids: string[];
}

export function ColorsEditor({
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
