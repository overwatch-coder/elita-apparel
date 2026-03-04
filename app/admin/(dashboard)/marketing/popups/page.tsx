import { getPopups } from "@/lib/actions/marketing-popups";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MousePointer2,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
              <TableHead className="font-medium py-4 px-6">Status</TableHead>
              <TableHead className="font-medium py-4 px-6">Delay</TableHead>
              <TableHead className="font-medium py-4 px-6">Created</TableHead>
              <TableHead className="text-right font-medium py-4 px-6">
                Actions
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
                    {popup.is_active ? (
                      <Badge className="bg-ghana-green/10 text-ghana-green border-none text-[10px] py-0.5">
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground border-none text-[10px] py-0.5"
                      >
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground py-4 px-6 text-sm">
                    {popup.type === "timed"
                      ? `${popup.delay_seconds}s`
                      : "Instantly"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[10px] py-4 px-6">
                    {formatDistanceToNow(new Date(popup.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right py-4 px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gold/10 hover:text-gold transition-all duration-300"
                        >
                          <MoreHorizontal className="h-4 w-4" />
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
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4 mr-3 opacity-70" />
                          Delete Popup
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
