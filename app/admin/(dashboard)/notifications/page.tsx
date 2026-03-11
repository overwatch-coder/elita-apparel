import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";
import { PaginatedNotifications } from "@/components/notifications/paginated-notifications";

export const metadata = {
  title: "Admin Notifications",
};

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: notifications, count: totalCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .or(`user_id.is.null,user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .or(`user_id.is.null,user_id.eq.${user.id}`)
    .eq("is_read", false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-foreground">
             System Alerts
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            All system-wide events and personal admin notifications.
          </p>
        </div>
        {unreadCount !== null && unreadCount > 0 && (
           <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium w-fit">
             <Bell className="h-4 w-4" />
             {unreadCount} unread
           </div>
        )}
      </div>

      <PaginatedNotifications 
        notifications={notifications || []} 
        totalCount={totalCount || 0}
        pageSize={pageSize}
        isAdminView={true}
        userId={user.id}
      />
    </div>
  );
}
