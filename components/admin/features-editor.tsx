"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductFeature {
  id: string;
  text: string;
}

export function FeaturesEditor({
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
