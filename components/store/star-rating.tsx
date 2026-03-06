"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  maxStars = 5,
  interactive = false,
  onRate,
  size = "md",
}: StarRatingProps) {
  const sizeClass = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(starValue)}
            className={cn(
              "transition-colors duration-200",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default",
            )}
          >
            <Star
              className={cn(
                sizeClass,
                "transition-colors duration-200",
                isFilled ? "fill-gold text-gold" : "text-muted-foreground/30",
                interactive && !isFilled && "hover:text-gold/50",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
