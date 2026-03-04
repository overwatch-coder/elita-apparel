"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/store/star-rating";
import { submitReview, getProductReviews } from "@/app/actions/reviews";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      const data = await getProductReviews(productId);
      setReviews(data.reviews);
      setAvgRating(data.avgRating);
      setReviewCount(data.count);
      setIsLoading(false);
    }
    load();
  }, [productId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    const result = await submitReview({
      product_id: productId,
      rating,
      comment: comment.trim() || undefined,
    });

    if (result.success) {
      toast.success("Review submitted! It will appear after admin approval.");
      setShowForm(false);
      setRating(0);
      setComment("");
    } else {
      toast.error(result.error || "Failed to submit review");
    }
    setIsSubmitting(false);
  };

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-xl sm:text-2xl">Customer Reviews</h2>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size="sm" />
              <span className="text-sm text-muted-foreground">
                {avgRating} ({reviewCount})
              </span>
            </div>
          )}
        </div>
        {userId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="border-gold/30 text-gold hover:bg-gold/5"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Submit review form */}
      {showForm && (
        <div className="p-6 rounded-lg bg-secondary/50 border border-border/50 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Your Rating</p>
            <StarRating
              rating={rating}
              interactive
              onRate={setRating}
              size="lg"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Your Review (optional)</p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="bg-gold hover:bg-gold-dark text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground">
            No reviews yet. Be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="p-5 rounded-lg bg-secondary/30 border border-border/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm font-medium">
                    {review.profiles?.full_name || "Customer"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-ghana-green">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Purchase
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              )}
              {review.image_url && (
                <img
                  src={review.image_url}
                  alt="Review"
                  className="mt-3 w-24 h-24 rounded object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
