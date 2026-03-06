import { redirect } from "next/navigation";
import { getSubscribers } from "@/lib/actions/marketing-admin";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginationRange } from "@/lib/pagination";

export const metadata = {
  title: "Audience Dashboard | Admin",
  description: "Manage your marketing audience, segments, and subscribers.",
};

export default async function AudienceDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const pageSize = 15;

  const { subscribers, totalCount, totalPages, error } = await getSubscribers(
    currentPage,
    pageSize,
  );

  if (error === "Unauthorized access") {
    redirect("/admin/login");
  }

  const paginationRange = getPaginationRange(currentPage, totalPages || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Audience</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your subscribers and customer segments ({totalCount}{" "}
            subscribers).
          </p>
        </div>
      </div>

      <div className="bg-card border-border border rounded-lg shadow-sm overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-destructive">
            <p>Error loading subscribers: {error}</p>
          </div>
        ) : !subscribers || subscribers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <h3 className="text-lg font-medium text-foreground mb-1">
              No subscribers yet
            </h3>
            <p className="text-sm text-muted-foreground">
              When customers opt-in, they will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/40 border-b border-border uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Source</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscribers.map((sub: any) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {sub.full_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="capitalize">
                          {sub.source || "Unknown"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sub.is_subscribed ? (
                          <Badge className="bg-ghana-green text-white hover:bg-ghana-green/90">
                            Subscribed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Unsubscribed</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {format(new Date(sub.created_at), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination UI */}
            {totalPages && totalPages > 1 && (
              <div className="py-6 border-t border-border">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/admin/audience?page=${Math.max(1, currentPage - 1)}`}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {paginationRange.map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "DOTS" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href={`/admin/audience?page=${page}`}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href={`/admin/audience?page=${Math.min(
                          totalPages,
                          currentPage + 1,
                        )}`}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
