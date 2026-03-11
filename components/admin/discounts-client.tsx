"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import {
  createDiscount,
  deleteDiscount,
  toggleDiscount,
} from "@/lib/actions/admin";
import { toast } from "sonner";

import { DataPagination } from "./data-pagination";

interface DiscountCode {
  id: string;
  code: string;
  percentage: number;
  expiry_date: string | null;
  is_active: boolean;
  usage_count: number;
  max_uses: number | null;
  created_at: string;
}

interface DiscountsClientProps {
  discounts: DiscountCode[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export function DiscountsClient({
  discounts,
  totalCount,
  pageSize,
  currentPage,
}: DiscountsClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await createDiscount(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Discount code created");
      setOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discount code?")) return;
    const result = await deleteDiscount(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Discount code deleted");
      router.refresh();
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    const result = await toggleDiscount(id, isActive);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(isActive ? "Discount activated" : "Discount deactivated");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Discount Codes</h1>
          <p className="text-muted-foreground mt-1">Manage promotional codes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                New Discount Code
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="disc-code">Code *</Label>
                <Input
                  id="disc-code"
                  name="code"
                  required
                  className="mt-1.5 uppercase"
                  placeholder="EARLYBIRD10"
                />
              </div>
              <div>
                <Label htmlFor="disc-percentage">Discount Percentage *</Label>
                <Input
                  id="disc-percentage"
                  name="percentage"
                  type="number"
                  min="1"
                  max="100"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="disc-expiry">Expiry Date</Label>
                <Input
                  id="disc-expiry"
                  name="expiry_date"
                  type="date"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="disc-max">Max Uses</Label>
                <Input
                  id="disc-max"
                  name="max_uses"
                  type="number"
                  min="1"
                  className="mt-1.5"
                  placeholder="Unlimited"
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="disc-active">Active</Label>
                <input type="hidden" name="is_active" value="false" />
                <Switch
                  id="disc-active"
                  name="is_active"
                  defaultChecked={true}
                  value="true"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-white"
              >
                Create Code
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.length > 0 ? (
              discounts.map((disc) => (
                <TableRow key={disc.id}>
                  <TableCell className="font-mono font-medium text-sm">
                    {disc.code}
                  </TableCell>
                  <TableCell>{disc.percentage}%</TableCell>
                  <TableCell className="text-sm">
                    {disc.usage_count}
                    {disc.max_uses ? ` / ${disc.max_uses}` : ""}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {disc.expiry_date
                      ? new Date(disc.expiry_date).toLocaleDateString("en-GH", {
                          dateStyle: "medium",
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={disc.is_active}
                      onCheckedChange={(checked) =>
                        handleToggle(disc.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(disc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">No discount codes yet</p>
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
