import { getPopups } from "@/lib/actions/marketing-popups";
import { Button } from "@/components/ui/button";
import { Plus, MousePointer2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PopupActions } from "@/components/admin/marketing/popup-actions";

export default async function PopupsPage() {
  const { popups, error } = (await getPopups()) as any;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-foreground">
            Marketing Popups
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage early bird, exit intent, and timed popups.
          </p>
        </div>
        <Button asChild className="bg-gold hover:bg-gold-dark text-white">
          <Link href="/admin/marketing/popups/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Popup
          </Link>
        </Button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-accent/40">
            <TableRow>
              <TableHead className="font-medium py-4 px-6">Name</TableHead>
              <TableHead className="font-medium py-4 px-6">Type</TableHead>
              <TableHead className="text-right font-medium py-4 px-6">
                Status & Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popups && popups.length > 0 ? (
              popups.map((popup: any) => (
                <TableRow
                  key={popup.id}
                  className="hover:bg-accent/5 transition-colors border-border/40"
                >
                  <TableCell className="font-medium py-4 px-6">
                    {popup.name}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge
                      variant="outline"
                      className="capitalize bg-accent/30 border-border/50 text-[10px] tracking-wider py-0.5"
                    >
                      {popup.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <PopupActions popup={popup} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-72 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                      <MousePointer2 className="h-8 w-8 opacity-20" />
                    </div>
                    <p className="font-serif text-lg text-foreground">
                      No Marketing Popups
                    </p>
                    <p className="text-sm max-w-xs mx-auto">
                      Create your first popup to start capturing emails and
                      driving sales with automated offers.
                    </p>
                    <Button
                      asChild
                      className="bg-gold hover:bg-gold-dark text-white mt-4"
                      size="sm"
                    >
                      <Link href="/admin/marketing/popups/new">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
