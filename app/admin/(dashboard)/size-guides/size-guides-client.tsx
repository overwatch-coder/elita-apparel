"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AIGeneratorButton } from "@/components/admin/ai-generator-button";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { DataPagination } from "@/components/admin/data-pagination";
import { useRouter } from "next/navigation";

interface SizeGuide {
  id: string;
  title: string;
  content_html: string;
  category: string | null;
  created_at: string;
}

interface SizeGuidesClientProps {
  guides: SizeGuide[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export function SizeGuidesClient({
  guides,
  totalCount,
  pageSize,
  currentPage,
}: SizeGuidesClientProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<SizeGuide | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        toast.success("Size guide updated");
        router.refresh();
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
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create");
      }
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteSizeGuide(id);
    if (result.success) {
      toast.success("Size guide deleted");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Size Guide?"
        description="Are you sure you want to delete this size guide? This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
      />
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Size Guides</h1>
          <p className="text-muted-foreground">
            Manage size charts for products
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-gold hover:bg-gold-dark text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Guide
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-bold py-4">Title</TableHead>
              <TableHead className="font-bold py-4">Category</TableHead>
              <TableHead className="font-bold py-4">Created</TableHead>
              <TableHead className="text-right font-bold py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 bg-muted/5">
                  <p className="text-muted-foreground font-medium">
                    No size guides yet. Create your first one.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              guides.map((guide) => (
                <TableRow
                  key={guide.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">{guide.title}</TableCell>
                  <TableCell className="text-muted-foreground/80 font-medium">
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
                        className="h-8 w-8 hover:bg-gold/10 hover:text-gold transition-colors"
                        onClick={() => openEdit(guide)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(guide.id)}
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
            <div className="space-y-4 pt-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between">
                <Label htmlFor="sg-content">Size Chart & Guidelines</Label>
                <AIGeneratorButton
                  type="product_description"
                  label="Generate Chart"
                  input={{
                    name: form.title,
                    fabric: "Standard",
                    fit: "True to size",
                    audience: form.category || "Customers",
                    occasion: "Sizing information",
                  }}
                  onGenerated={(text) =>
                    setForm((p) => ({ ...p, content_html: text }))
                  }
                />
              </div>
              <RichTextEditor
                value={form.content_html}
                onChange={(val) =>
                  setForm((p) => ({ ...p, content_html: val }))
                }
                placeholder="<table><tr><th>Size</th><th>Bust (in)</th></tr>...</table>"
                className="min-h-[250px]"
              />
              <p className="text-[10px] text-muted-foreground italic uppercase tracking-wider font-bold">
                Professional Tip: Use tables for clear size charts. AI can help
                format these perfectly.
              </p>
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
