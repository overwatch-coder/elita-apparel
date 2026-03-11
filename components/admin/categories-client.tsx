"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/admin";
import { toast } from "sonner";
import type { Category } from "@/lib/types/database";

import { DataPagination } from "./data-pagination";

interface CategoriesClientProps {
  categories: Category[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoriesClient({
  categories,
  totalCount,
  pageSize,
  currentPage,
}: CategoriesClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
    } else {
      setEditingCategory(null);
      setName("");
      setSlug("");
    }
    setOpen(true);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingCategory) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = editingCategory
      ? await updateCategory(editingCategory.id, formData)
      : await createCategory(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingCategory ? "Category updated" : "Category created");
      setOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCategory(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Category deleted");
      router.refresh();
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Category?"
        description="Are you sure you want to delete this category? Products in this category will be unlinked but not deleted."
        variant="destructive"
        confirmText="Delete"
      />
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gold hover:bg-gold-dark text-white"
              onClick={() => handleOpen()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingCategory ? "Edit Category" : "New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cat-name">Name *</Label>
                <Input
                  id="cat-name"
                  name="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Category Image</Label>
                <div className="mt-1.5">
                  <SingleImageUpload
                    name="image_url"
                    defaultValue={editingCategory?.image_url}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cat-slug">Slug *</Label>
                <Input
                  id="cat-slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-white"
              >
                {editingCategory ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {cat.image_url ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <img
                          src={cat.image_url}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        —
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpen(cat)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <p className="text-muted-foreground">No categories yet</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataPagination
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  );
}
