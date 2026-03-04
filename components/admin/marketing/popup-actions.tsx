"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { deletePopup, togglePopupActive } from "@/lib/actions/marketing-popups";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface PopupActionsProps {
  popup: any;
}

export function PopupActions({ popup }: PopupActionsProps) {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(popup.is_active);

  const onToggle = async () => {
    setLoading(true);
    try {
      const { error } = await togglePopupActive(popup.id, !active);
      if (error) throw new Error(error);
      setActive(!active);
      toast.success(`Popup ${!active ? "activated" : "deactivated"}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle status");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this popup?")) return;

    setLoading(true);
    try {
      const { error } = await deletePopup(popup.id);
      if (error) throw new Error(error);
      toast.success("Popup deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete popup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onToggle}
        disabled={loading}
        className="transition-opacity hover:opacity-80"
      >
        {active ? (
          <Badge className="bg-ghana-green/10 text-ghana-green border-none text-[10px] py-0.5 pointer-events-none">
            Active
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground border-none text-[10px] py-0.5 pointer-events-none"
          >
            Inactive
          </Badge>
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={loading}
            className="h-8 w-8 hover:bg-gold/10 hover:text-gold transition-all duration-300"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-1">
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/marketing/popups/${popup.id}`}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-3 opacity-70" />
              Edit Configuration
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-3 opacity-70" />
            Delete Popup
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
