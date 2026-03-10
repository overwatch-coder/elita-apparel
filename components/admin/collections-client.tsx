"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff, MoreHorizontal, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AIGeneratorButton } from "@/components/admin/ai-generator-button";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  toggleCollectionPublish,
} from "@/lib/actions/admin";
import { toast } from "sonner";
import type { Collection } from "@/lib/types/database";

import { DataPagination } from "./data-pagination";

interface CollectionsClientProps {
  collections: Collection[];
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

export function CollectionsClient({
  collections,
  totalCount,
  pageSize,
  currentPage,
}: CollectionsClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [culturalStory, setCulturalStory] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleOpen = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setName(collection.name);
      setSlug(collection.slug);
      setDescription(collection.description || "");
      setCulturalStory(collection.cultural_story || "");
      setIsPublished(!!collection.is_published);
    } else {
      setEditingCollection(null);
      setName("");
      setSlug("");
      setDescription("");
      setCulturalStory("");
      setIsPublished(true);
    }
    setOpen(true);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingCollection) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("description", description);
    formData.set("cultural_story", culturalStory);
    formData.set("is_published", isPublished ? "true" : "false");

    const result = editingCollection
      ? await updateCollection(editingCollection.id, formData)
      : await createCollection(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        editingCollection ? "Collection updated" : "Collection created",
      );
      setOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCollection(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Collection deleted");
      router.refresh();
    }
    setDeleteId(null);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const result = await toggleCollectionPublish(id, !currentStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        currentStatus ? "Collection unpublished" : "Collection published",
      );
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Collection?"
        description="Are you sure you want to delete this collection? Products in this collection will be unlinked but not deleted."
        variant="destructive"
        confirmText="Delete"
      />
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Collections</h1>
          <p className="text-muted-foreground mt-1">Manage your collections</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gold hover:bg-gold-dark text-white"
              onClick={() => handleOpen()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingCollection ? "Edit Collection" : "New Collection"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="col-name">Name *</Label>
                <Input
                  id="col-name"
                  name="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Cover Image</Label>
                <div className="mt-1.5">
                  <SingleImageUpload
                    name="image_url"
                    defaultValue={editingCollection?.image_url}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="col-slug">Slug *</Label>
                <Input
                  id="col-slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="col-desc">Description</Label>
                  <div className="flex items-center gap-2">
                    <AIGeneratorButton
                      type="collection_description"
                      input={{ name }}
                      onGenerated={setDescription}
                      label="Generate"
                    />
                  </div>
                </div>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe this collection..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="col-story">Cultural Story</Label>
                  <div className="flex items-center gap-2">
                    <AIGeneratorButton
                      type="cultural_story"
                      input={{ name }}
                      onGenerated={setCulturalStory}
                      label="Generate"
                    />
                  </div>
                </div>
                <RichTextEditor
                  value={culturalStory}
                  onChange={setCulturalStory}
                  placeholder="The heritage behind this collection..."
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="col-published">Published</Label>
                <Switch
                  id="col-published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-white"
              >
                {editingCollection ? "Update" : "Create"}
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length > 0 ? (
              collections.map((col) => (
                <TableRow key={col.id}>
                  <TableCell>
                    {col.image_url ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <img
                          src={col.image_url}
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
                  <TableCell className="font-medium">{col.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {col.slug}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={col.is_published ? "default" : "secondary"}
                      className={
                        col.is_published
                          ? "bg-ghana-green/10 text-ghana-green border-0"
                          : ""
                      }
                    >
                      {col.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpen(col)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleTogglePublish(col.id, !!col.is_published)
                          }
                        >
                          {col.is_published ? (
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
                          onClick={() => setDeleteId(col.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <p className="text-muted-foreground">No collections yet</p>
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
