import { redirect } from "next/navigation";
import { getCampaigns } from "@/lib/actions/campaigns";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Megaphone } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Campaigns | Admin",
  description: "Create and manage your marketing campaigns.",
};

export default async function CampaignsDashboardPage() {
  const { campaigns, error } = await getCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Design, schedule, and send promotional emails to your audience.
          </p>
        </div>
        <Button
          asChild
          className="bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-xs h-11"
        >
          <Link href="/admin/campaigns/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <div className="bg-card border-border border rounded-lg shadow-sm overflow-hidden">
        {error ? (
          <div className="p-6 text-center text-destructive">
            <p>Error loading campaigns: {error}</p>
          </div>
        ) : !campaigns || campaigns.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">
              <Megaphone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-foreground mb-2">
              No campaigns found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
              Start by creating your first promotional email campaign to engage
              with your subscribers.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white uppercase tracking-widest text-xs"
            >
              <Link href="/admin/campaigns/new">
                Create Your First Campaign
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/40 border-b border-border uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Campaign Name</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Scheduled</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((camp: any) => (
                  <tr
                    key={camp.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                      {camp.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {camp.subject_line}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={cn(
                          "capitalize",
                          camp.status === "sent"
                            ? "bg-ghana-green text-white"
                            : camp.status === "scheduled"
                              ? "bg-gold text-white"
                              : "bg-muted text-foreground",
                        )}
                      >
                        {camp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {camp.scheduled_at
                        ? format(new Date(camp.scheduled_at), "MMM d, h:mm a")
                        : "Not scheduled"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-gold hover:text-gold-dark"
                      >
                        <Link href={`/admin/campaigns/${camp.id}`}>Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
