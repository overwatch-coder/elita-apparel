"use client";

import { useState, useEffect } from "react";
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

export default function FabricTypesPage() {
  const [fabricTypes, setFabricTypes] = useState<FabricType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchFabricTypes();
  }, []);

  async function fetchFabricTypes() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("fabric_types")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load fabric types");
    } else {
      setFabricTypes(data || []);
    }
    setIsLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
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
      fetchFabricTypes();
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("fabric_types").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete. It might be in use.");
    } else {
      toast.success("Fabric type deleted");
      setFabricTypes(fabricTypes.filter((f) => f.id !== id));
    }
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete Fabric Type?"
        description="Are you sure? This might affect products using this fabric type if not handled."
        variant="destructive"
        confirmText="Delete"
      />
      <div className="flex items-center justify-between">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-gold" />
                  </TableCell>
                </TableRow>
              ) : fabricTypes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No fabric types found.
                  </TableCell>
                </TableRow>
              ) : (
                fabricTypes.map((fabric) => (
                  <TableRow key={fabric.id}>
                    <TableCell className="font-medium">{fabric.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {fabric.slug}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {fabric.description || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

      <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 text-sm text-muted-foreground">
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
