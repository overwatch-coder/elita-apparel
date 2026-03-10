import { redirect } from "next/navigation";
import { getSubscribers } from "@/lib/actions/marketing-admin";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataPagination } from "@/components/admin/data-pagination";

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
  const pageSize = 20;

  const { subscribers, totalCount, error } = await getSubscribers(
    currentPage,
    pageSize,
  );

  if (error === "Unauthorized access") {
    redirect("/login");
  }

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

      <div className="bg-card border-border/50 border rounded-xl shadow-sm overflow-hidden">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted-foreground bg-muted/50 border-b border-border/50 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {subscribers.map((sub: any) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-foreground">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-medium">
                      {sub.full_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className="capitalize text-[10px] font-bold border-gold/20 text-gold bg-gold/5 px-2"
                      >
                        {sub.source || "Unknown"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sub.is_subscribed ? (
                        <Badge className="bg-ghana-green/10 text-ghana-green border-ghana-green/20 text-[10px] font-bold uppercase tracking-wider">
                          Subscribed
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold uppercase tracking-wider"
                        >
                          Unsubscribed
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs font-medium">
                      {format(new Date(sub.created_at), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DataPagination
        totalCount={totalCount || 0}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  );
}
