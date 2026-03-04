"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  createCollection,
  updateCollection,
  deleteCollection,
} from "@/lib/actions/admin";
import { toast } from "sonner";
import type { Collection } from "@/lib/types/database";

interface CollectionsClientProps {
  collections: Collection[];
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CollectionsClient({ collections }: CollectionsClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleOpen = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setName(collection.name);
      setSlug(collection.slug);
    } else {
      setEditingCollection(null);
      setName("");
      setSlug("");
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
    if (!confirm("Delete this collection?")) return;
    const result = await deleteCollection(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Collection deleted");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
              <div>
                <Label htmlFor="col-desc">Description</Label>
                <Textarea
                  id="col-desc"
                  name="description"
                  defaultValue={editingCollection?.description || ""}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="col-story">Cultural Story</Label>
                <Textarea
                  id="col-story"
                  name="cultural_story"
                  defaultValue={editingCollection?.cultural_story || ""}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="col-published">Published</Label>
                <input type="hidden" name="is_published" value="false" />
                <Switch
                  id="col-published"
                  name="is_published"
                  defaultChecked={editingCollection?.is_published ?? true}
                  value="true"
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
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpen(col)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(col.id)}
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
                  <p className="text-muted-foreground">No collections yet</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
