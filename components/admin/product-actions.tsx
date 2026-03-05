"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteProduct, toggleProductPublished } from "@/lib/actions/products";
import { toast } from "sonner";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ProductActionsProps {
  product: { id: string; name: string; is_published: boolean; slug: string };
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    const result = await deleteProduct(product.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product deleted");
      router.refresh();
    }
    setShowDeleteDialog(false);
  };

  const handleTogglePublish = async () => {
    const result = await toggleProductPublished(
      product.id,
      !product.is_published,
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        product.is_published ? "Product unpublished" : "Product published",
      );
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTogglePublish}>
          {product.is_published ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setShowDeleteDialog(true)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title={`Delete "${product.name}"?`}
        description="This will permanently delete the product and all associated images. This action cannot be undone."
        variant="destructive"
        confirmText="Delete Product"
      />
    </DropdownMenu>
  );
}
