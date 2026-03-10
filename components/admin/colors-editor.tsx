"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check, Palette, Image as ImageIcon } from "lucide-react";
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
    <div className="space-y-6 text-foreground">
      {/* Color list */}
      <div className="grid grid-cols-1 gap-4">
        {colors.map((color) => (
          <div
            key={color.id}
            className="rounded-xl border border-border/50 overflow-hidden bg-card/30 shadow-sm backdrop-blur-sm transition-all hover:border-gold/30 hover:shadow-md"
          >
            {/* Color header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-muted/20 border-b border-border/50">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="h-8 w-8 rounded-full border border-white/20 shrink-0 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-foreground truncate uppercase tracking-tight">
                    {color.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-gold/5 border border-gold/10 px-2 py-0.5 rounded">
                      {color.image_ids.length} IMAGES
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {color.hex}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end sm:border-l sm:border-border/50 sm:pl-4">
                <button
                  type="button"
                  onClick={() =>
                    setEditingId(editingId === color.id ? null : color.id)
                  }
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.15em] transition-all px-4 py-2 rounded-lg border",
                    editingId === color.id
                      ? "bg-gold text-white border-gold shadow-lg shadow-gold/20"
                      : "text-muted-foreground hover:text-gold border-border/50 hover:border-gold/30 hover:bg-gold/5",
                  )}
                >
                  {editingId === color.id ? "DONE" : "LINK IMAGES"}
                </button>
                <button
                  type="button"
                  onClick={() => removeColor(color.id)}
                  className="text-muted-foreground hover:text-destructive transition-all p-2 hover:bg-destructive/10 rounded-lg group"
                >
                  <Trash2 className="h-4 w-4 group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Image picker (when editing) */}
            {editingId === color.id && (
              <div className="p-5 bg-background/40">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 ml-1">
                  Select variants of this color:
                </p>
                {sortedImages.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-border/30 rounded-2xl bg-muted/5">
                    <ImageIcon className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-xs text-muted-foreground italic font-medium">
                      Upload product images first, then link them to colors.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {sortedImages.map((img) => {
                      const selected = color.image_ids.includes(img.id);
                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => toggleImage(color.id, img.id)}
                          className={cn(
                            "group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 transform",
                            selected
                              ? "border-gold ring-4 ring-gold/15 scale-[0.96] shadow-xl"
                              : "border-border/40 opacity-40 hover:opacity-100 hover:border-gold/40 hover:scale-[1.02]",
                          )}
                        >
                          <Image
                            src={img.image_url}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div
                            className={cn(
                              "absolute inset-0 transition-opacity duration-300 flex items-center justify-center",
                              selected
                                ? "bg-gold/40 opacity-100"
                                : "bg-black/0 opacity-0 group-hover:opacity-100 group-hover:bg-black/20",
                            )}
                          >
                            <div
                              className={cn(
                                "size-7 rounded-full flex items-center justify-center transition-all duration-500 transform scale-0",
                                selected &&
                                  "scale-100 bg-gold shadow-2xl ring-4 ring-white/20",
                              )}
                            >
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
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
      <div className="md:p-6 md:border-2 md:border-border/40 md:rounded-2xl bg-muted/5 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.05]">
          <Palette className="size-32" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-sm text-gold">
            <Plus className="size-5" />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-gold">
              New Color Variant
            </h4>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Define a new variant and link it to its corresponding media
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          <div className="md:col-span-12 lg:col-span-6 space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">
              Display Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midnight Blue, Charcoal Grey"
              className="h-12 text-sm bg-background/50 border-border/50 focus-visible:ring-gold/30 rounded-xl shadow-sm"
            />
          </div>

          <div className="md:col-span-12 lg:col-span-4 space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground ml-1">
              Visual Hex Value
            </Label>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0 group/picker shadow-sm transition-transform hover:scale-105 active:scale-95">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  className="h-12 w-12 rounded-xl cursor-pointer border-none p-0 bg-transparent"
                />
                <div
                  className="absolute inset-0 pointer-events-none rounded-xl border-2 border-white/10 ring-1 ring-black/5 shadow-inner"
                  style={{ backgroundColor: hex }}
                />
              </div>
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40 tracking-wider">
                  HEX
                </div>
                <Input
                  value={hex.replace("#", "")}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 6) setHex(`#${val}`);
                  }}
                  className="h-12 pl-14 text-sm font-mono bg-background/50 border-border/50 focus-visible:ring-gold/30 rounded-xl uppercase tracking-widest shadow-sm"
                  placeholder="FFFFFF"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-2 flex items-end">
            <Button
              type="button"
              onClick={addColor}
              disabled={!name.trim()}
              className="w-full h-12 bg-gold hover:bg-gold-dark text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              <Plus className="h-4 w-4 mr-2" /> CREATE
            </Button>
          </div>
        </div>
      </div>

      {colors.length === 0 && (
        <div className="text-center py-12 px-6 border border-dashed border-border/50 rounded-2xl bg-card/10">
          <div className="size-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Palette className="size-6 text-gold opacity-50" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
            No variants created yet. Define your first product color above.
          </p>
        </div>
      )}
    </div>
  );
}
