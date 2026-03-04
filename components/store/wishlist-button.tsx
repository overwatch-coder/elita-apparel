"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  productId,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const active = isWishlisted(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(productId);
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-300",
          active
            ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
            : "text-muted-foreground hover:text-red-500 hover:bg-red-500/5",
          className,
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-all duration-300",
            active && "fill-current scale-110",
          )}
        />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full p-2 transition-all duration-300 backdrop-blur-sm",
        active
          ? "bg-red-500/20 text-red-500"
          : "bg-white/80 text-royal-black/60 hover:text-red-500 hover:bg-white",
        className,
      )}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-300",
          active && "fill-current scale-110",
        )}
      />
    </button>
  );
}
