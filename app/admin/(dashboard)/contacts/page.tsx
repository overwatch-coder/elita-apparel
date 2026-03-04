import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { ContactActions } from "@/components/admin/contact-actions";

export const metadata: Metadata = { title: "Inquiries | Admin" };

export default async function AdminContactsPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl">Inquiries</h1>
        <p className="text-muted-foreground mt-1">
          Review and respond to customer messages
        </p>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={!msg.is_read ? "bg-primary/5" : ""}
                >
                  <TableCell>
                    <div>
                      <p
                        className={`text-sm ${!msg.is_read ? "font-semibold text-foreground" : "font-medium"}`}
                      >
                        {msg.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {msg.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{msg.subject}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {msg.message}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={!msg.is_read ? "default" : "secondary"}
                      className={
                        !msg.is_read
                          ? "bg-ghana-red text-white hover:bg-ghana-red/90 border-0"
                          : ""
                      }
                    >
                      {!msg.is_read ? "New" : "Read"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString("en-GH", {
                      dateStyle: "medium",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <ContactActions message={msg} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">No messages yet</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
