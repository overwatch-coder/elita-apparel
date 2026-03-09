"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "@/components/store/image-lightbox";
import { Expand } from "lucide-react";
import type { ProductImage } from "@/lib/types/database";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  activeImageId?: string;
}

export function ProductGallery({
  images,
  productName,
  activeImageId,
}: ProductGalleryProps) {
  // Use images directly as they are pre-sorted by the parent
  const sortedImages = images;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Update selected index when activeImageId changes (e.g. from color swatch selection)
  useEffect(() => {
    if (activeImageId) {
      const idx = sortedImages.findIndex((img) => img.id === activeImageId);
      if (idx !== -1) {
        setSelectedIndex(idx);
      }
    } else {
      setSelectedIndex(0);
    }
  }, [activeImageId, sortedImages]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const currentImage = sortedImages[selectedIndex];

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnail strip */}
        {sortedImages.length > 1 && (
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px]">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative shrink-0 w-16 h-20 lg:w-20 lg:h-24 rounded-md overflow-hidden border-2 transition-all duration-200",
                  index === selectedIndex
                    ? "border-gold"
                    : "border-transparent hover:border-gold/50",
                )}
              >
                <Image
                  src={image.image_url}
                  alt={`${productName} - View ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div
          className="relative flex-1 aspect-3/4 max-h-[70vh] rounded-lg overflow-hidden bg-cream-dark cursor-zoom-in lg:mx-auto"
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          {currentImage && (
            <Image
              src={currentImage.image_url}
              alt={`${productName} - Main view`}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                isZoomed && "scale-200",
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          )}

          {/* Fullscreen button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm transition-colors shadow-sm"
            aria-label="View fullscreen"
          >
            <Expand className="h-4 w-4 text-royal-black" />
          </button>

          {/* Zoom hint */}
          {!isZoomed && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-md px-3 py-1.5">
              <span className="text-[10px] tracking-wider uppercase text-royal-black font-medium">
                Click to zoom
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={sortedImages}
          initialIndex={selectedIndex}
          productName={productName}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
