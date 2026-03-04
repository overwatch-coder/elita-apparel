"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  MailOpen,
  MailCheck,
  Reply,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateContactStatus, deleteContactMessage } from "@/lib/actions/admin";
import { toast } from "sonner";

interface ContactActionsProps {
  message: {
    id: string;
    full_name: string;
    email: string;
    is_read: boolean;
    message: string;
    subject: string;
  };
}

export function ContactActions({ message }: ContactActionsProps) {
  const router = useRouter();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status handlers
  const handleStatusChange = async (is_read: boolean) => {
    const result = await updateContactStatus(message.id, is_read);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(
        is_read ? `Message marked as read` : `Message marked as unread`,
      );
      router.refresh();
      if (isViewOpen && is_read !== message.is_read) {
        // Optionally close or keep open
      }
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setIsDeleting(true);
    const result = await deleteContactMessage(message.id);
    if (result?.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Message deleted");
      setIsViewOpen(false);
      // Let the page refresh via action
    }
  };

  const openAndMarkRead = () => {
    setIsViewOpen(true);
    if (!message.is_read) {
      handleStatusChange(true);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={openAndMarkRead}>
            <MailOpen className="mr-2 h-4 w-4" />
            View Message
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
            }}
          >
            <Reply className="mr-2 h-4 w-4" />
            Reply via Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!message.is_read && (
            <DropdownMenuItem onClick={() => handleStatusChange(true)}>
              <MailOpen className="mr-2 h-4 w-4" />
              Mark as Read
            </DropdownMenuItem>
          )}
          {message.is_read && (
            <DropdownMenuItem onClick={() => handleStatusChange(false)}>
              <MailOpen className="mr-2 h-4 w-4" />
              Mark as Unread
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-start gap-4 pr-6">
              <span className="wrap-break-word leading-tight">
                {message.subject}
              </span>
            </DialogTitle>
            <DialogDescription className="pt-2 flex flex-col gap-1">
              <span>
                From:{" "}
                <strong className="text-foreground">{message.full_name}</strong>
              </span>
              <span>
                Email:{" "}
                <a
                  href={`mailto:${message.email}`}
                  className="text-gold hover:underline"
                >
                  {message.email}
                </a>
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-md bg-secondary/50 p-4 min-h-[150px] whitespace-pre-wrap text-sm text-foreground/90">
              {message.message}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {!message.is_read && (
              <Button
                variant="outline"
                onClick={() => {
                  handleStatusChange(true);
                  setIsViewOpen(false);
                }}
              >
                Mark Read
              </Button>
            )}
            <Button
              className="bg-gold hover:bg-gold-dark text-white"
              onClick={() => {
                window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
              }}
            >
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
