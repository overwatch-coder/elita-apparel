"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createSizeGuide,
  updateSizeGuide,
  deleteSizeGuide,
} from "@/app/actions/size-guides";
import { toast } from "sonner";

interface SizeGuide {
  id: string;
  title: string;
  content_html: string;
  category: string | null;
  created_at: string;
}

export function SizeGuidesClient({
  guides: initialGuides,
}: {
  guides: SizeGuide[];
}) {
  const [guides, setGuides] = useState(initialGuides);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<SizeGuide | null>(null);

  const [form, setForm] = useState({
    title: "",
    content_html: "",
    category: "",
  });

  const openCreate = () => {
    setEditingGuide(null);
    setForm({ title: "", content_html: "", category: "" });
    setIsDialogOpen(true);
  };

  const openEdit = (guide: SizeGuide) => {
    setEditingGuide(guide);
    setForm({
      title: guide.title,
      content_html: guide.content_html,
      category: guide.category || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content_html.trim()) {
      toast.error("Title and content are required");
      return;
    }

    if (editingGuide) {
      const result = await updateSizeGuide(editingGuide.id, {
        title: form.title,
        content_html: form.content_html,
        category: form.category || undefined,
      });
      if (result.success) {
        setGuides((prev) =>
          prev.map((g) =>
            g.id === editingGuide.id
              ? { ...g, ...form, category: form.category || null }
              : g,
          ),
        );
        toast.success("Size guide updated");
      } else {
        toast.error(result.error || "Failed to update");
      }
    } else {
      const result = await createSizeGuide({
        title: form.title,
        content_html: form.content_html,
        category: form.category || undefined,
      });
      if (result.success) {
        toast.success("Size guide created");
        // Reload to get the new ID
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to create");
      }
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this size guide?")) return;
    const result = await deleteSizeGuide(id);
    if (result.success) {
      setGuides((prev) => prev.filter((g) => g.id !== id));
      toast.success("Size guide deleted");
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Size Guides</h1>
          <p className="text-muted-foreground">
            Manage size charts for products
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Guide
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <p className="text-muted-foreground">
                    No size guides yet. Create your first one.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              guides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium">{guide.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {guide.category || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(guide.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(guide)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDelete(guide.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingGuide ? "Edit Size Guide" : "New Size Guide"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="sg-title">Title</Label>
              <Input
                id="sg-title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Women's Tops"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sg-category">Category (optional)</Label>
              <Input
                id="sg-category"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="e.g. Tops, Dresses, Bottoms"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sg-content">
                Content (HTML — use &lt;table&gt; for charts)
              </Label>
              <Textarea
                id="sg-content"
                value={form.content_html}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content_html: e.target.value }))
                }
                placeholder="<table><tr><th>Size</th><th>Bust (in)</th></tr>...</table>"
                className="mt-1 min-h-[200px] font-mono text-sm"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              {editingGuide ? "Save Changes" : "Create Guide"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
