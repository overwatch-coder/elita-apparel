"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { FabricType } from "@/lib/types/database";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";
import { DataPagination } from "./data-pagination";

interface FabricTypesClientProps {
  initialFabricTypes: FabricType[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export function FabricTypesClient({
  initialFabricTypes,
  totalCount,
  pageSize,
  currentPage,
}: FabricTypesClientProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  async function handleCreate(e: React.SubmitEvent) {
    e.preventDefault();
    if (!newName) return;

    setIsSubmitting(true);
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const { error } = await supabase.from("fabric_types").insert({
      name: newName,
      slug,
      description: newDescription || null,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Fabric type created");
      setNewName("");
      setNewDescription("");
      setIsDialogOpen(false);
      router.refresh();
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("fabric_types").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete. It might be in use.");
    } else {
      toast.success("Fabric type deleted");
      router.refresh();
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-6 pb-10">
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Fabric Type?"
        description="Are you sure? This might affect products using this fabric type if not handled."
        variant="destructive"
        confirmText="Delete"
      />
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Fabric Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage fabrics available for your products
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Fabric Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Add New Fabric Type</DialogTitle>
                <DialogDescription>
                  Enter the details for the new fabric type.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Kente, Silk"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the fabric"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gold hover:bg-gold-dark text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Fabric Type"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-bold py-4">Name</TableHead>
                <TableHead className="font-bold py-4">Slug</TableHead>
                <TableHead className="font-bold py-4">Description</TableHead>
                <TableHead className="text-right font-bold py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialFabricTypes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground bg-muted/5"
                  >
                    No fabric types found.
                  </TableCell>
                </TableRow>
              ) : (
                initialFabricTypes.map((fabric) => (
                  <TableRow
                    key={fabric.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">{fabric.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {fabric.slug}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground/80">
                      {fabric.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(fabric.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DataPagination
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
      />

      <div className="flex items-start gap-4 p-4 rounded-xl bg-gold/5 border border-gold/10 text-sm text-muted-foreground/80 shadow-sm">
        <AlertCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <p>
          Fabric types added here will appear in the dropdown menu when creating
          or editing products. Deleting a fabric type that is currently in use
          by products may result in those products having an "unknown" fabric
          reference.
        </p>
      </div>
    </div>
  );
}
