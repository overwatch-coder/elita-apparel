"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface DataPaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export function DataPagination({
  totalCount,
  pageSize,
  currentPage,
}: DataPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page));
  };

  // Logic to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="py-6 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(currentPage * pageSize, totalCount)}
        </span>{" "}
        of <span className="font-medium">{totalCount}</span> results
      </p>

      <Pagination className="w-auto ml-0 mr-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(Math.max(1, currentPage - 1))}
              onClick={(e) => {
                if (currentPage === 1) e.preventDefault();
              }}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {getPageNumbers().map((p, i) => (
            <PaginationItem key={i}>
              {p === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageUrl(p as number)}
                  isActive={currentPage === p}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(p as number);
                  }}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={createPageUrl(Math.min(totalPages, currentPage + 1))}
              onClick={(e) => {
                if (currentPage === totalPages) e.preventDefault();
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
