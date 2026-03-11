"use client";

import { format } from "date-fns";
import { Bell, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Notification } from "@/lib/types/database";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function PaginatedNotifications({
  notifications,
  totalCount,
  pageSize = 10,
  isAdminView = false,
  userId,
}: {
  notifications: Notification[];
  totalCount: number;
  pageSize?: number;
  isAdminView?: boolean;
  userId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <Bell className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-foreground mb-1">
          No notifications yet
        </h3>
        <p>You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border/50">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 transition-colors hover:bg-accent/20 ${!notification.is_read ? "bg-primary/5" : ""}`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${!notification.is_read ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"}`}
                >
                  {notification.is_read ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4
                    className={`font-medium ${!notification.is_read ? "text-foreground" : "text-foreground/80"}`}
                  >
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {notification.message?.includes("out_for_delivery")
                      ? notification.message.replace(
                          "out_for_delivery",
                          "out for delivery",
                        )
                      : notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    {format(
                      new Date(notification.created_at),
                      "MMM d, yyyy 'at' h:mm a",
                    )}
                  </p>
                </div>
              </div>

              {notification.link && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="shrink-0 group sm:mt-0 mt-4 ml-14 sm:ml-0"
                >
                  <Link href={notification.link}>
                    View{" "}
                    <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {/* Show first page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink href={createPageUrl(1)}>1</PaginationLink>
              </PaginationItem>
            )}
            
            {/* Show ellipsis if needed */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Show previous, current, next */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink href={createPageUrl(currentPage - 1)}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={createPageUrl(currentPage)} isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink href={createPageUrl(currentPage + 1)}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Show ellipsis if needed */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Show last page */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink href={createPageUrl(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
