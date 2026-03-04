"use client";

import { cn } from "@/lib/utils";
import { SIZES } from "@/lib/constants";

interface SizeSelectorProps {
  availableSizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({
  availableSizes,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Size</span>
        {selectedSize && (
          <span className="text-xs text-muted-foreground">
            Selected: {selectedSize}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {SIZES.map((size) => {
          const isAvailable = availableSizes.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              disabled={!isAvailable}
              onClick={() => isAvailable && onSelect(size)}
              className={cn(
                "h-10 min-w-[44px] px-3 rounded-md border text-sm font-medium transition-all duration-200",
                isAvailable
                  ? isSelected
                    ? "bg-gold border-gold text-white"
                    : "border-border hover:border-gold hover:text-gold"
                  : "border-border/30 text-muted-foreground/30 cursor-not-allowed line-through",
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
