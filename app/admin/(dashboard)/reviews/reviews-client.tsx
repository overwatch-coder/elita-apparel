"use client";

import { useState } from "react";
import { Star, Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { moderateReview } from "@/app/actions/reviews";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { DataPagination } from "@/components/admin/data-pagination";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  image_url: string | null;
  is_approved: boolean;
  created_at: string;
  products: { name: string; slug: string } | null;
  profiles: { full_name: string | null } | null;
}

interface ReviewsModerationClientProps {
  reviews: Review[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export function ReviewsModerationClient({
  reviews: initialReviews,
  totalCount,
  pageSize,
  currentPage,
}: ReviewsModerationClientProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [search, setSearch] = useState("");
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const filtered = reviews.filter((r) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !r.is_approved) ||
      (filter === "approved" && r.is_approved);

    const matchesSearch =
      !search ||
      r.products?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleModerate = async (id: string, approve: boolean) => {
    const result = await moderateReview(id, approve);
    if (result.success) {
      if (approve) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r)),
        );
        toast.success("Review approved");
      } else {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast.success("Review rejected and removed");
      }
    } else {
      toast.error(result.error || "Failed to moderate review");
    }
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <p className="text-muted-foreground">
          {pendingCount} pending review{pendingCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search product, customer, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="max-w-xs">Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <p className="text-muted-foreground">No reviews found</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    {review.products?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {review.profiles?.full_name || "Anonymous"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate text-sm text-muted-foreground">
                      {review.comment || "No comment"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={review.is_approved ? "default" : "secondary"}
                      className={
                        review.is_approved
                          ? "bg-green-500/10 text-green-500"
                          : "bg-amber-500/10 text-amber-500"
                      }
                    >
                      {review.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View full review */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => setViewingReview(review)}
                      >
                        View Full
                      </Button>

                      {!review.is_approved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                          onClick={() => handleModerate(review.id, true)}
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                        onClick={() => setReviewToDelete(review)}
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataPagination
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />

      {/* View Review Modal */}
      <Dialog
        open={!!viewingReview}
        onOpenChange={(open) => !open && setViewingReview(null)}
      >
        <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Review for {viewingReview?.products?.name}</DialogTitle>
            <DialogDescription>
              By {viewingReview?.profiles?.full_name || "Anonymous"} on{" "}
              {viewingReview &&
                new Date(viewingReview.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2 mt-2 grow">
            <div className="flex items-center gap-1">
              {viewingReview &&
                Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < viewingReview.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
            </div>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">
              {viewingReview?.comment || "No comment provided."}
            </p>
            {viewingReview?.image_url && (
              <img
                src={viewingReview.image_url}
                alt="Review attachment"
                className="rounded-md w-full object-cover mt-4 max-h-[300px]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              review from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white"
              onClick={() => {
                if (reviewToDelete) {
                  handleModerate(reviewToDelete.id, false);
                  setReviewToDelete(null);
                }
              }}
            >
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
