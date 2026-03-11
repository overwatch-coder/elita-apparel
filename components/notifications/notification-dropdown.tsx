"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Notification } from "@/lib/types/database";

// Export the hook logic for reuse if needed, or keep it encapsulated.
export function NotificationDropdown({
  isAdminView = false,
  userId,
}: {
  isAdminView?: boolean;
  userId?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      // Admins see broadcasts (user_id IS NULL) OR their own exact notifications
      // Customers see ONLY their own notifications
      if (isAdminView) {
        if (userId) {
          query = query.or(`user_id.is.null,user_id.eq.${userId}`);
        } else {
          query = query.is("user_id", null);
        }
      } else {
        if (!userId) return; // Must have userId for customer view
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching notifications:", error);
      } else if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    };

    fetchNotifications();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("realtime_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;

          // Filter out irrelevant notifications
          if (isAdminView) {
            if (newNotif.user_id !== null && newNotif.user_id !== userId)
              return;
          } else {
            if (newNotif.user_id !== userId) return;
          }

          setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
          setUnreadCount((prev) => prev + 1);
          toast.info(newNotif.title, { description: newNotif.message });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          const updated = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n)),
          );
          // Recalculate unread count
          setUnreadCount((prevCount) => {
            const oldNotif = notifications.find((n) => n.id === updated.id);
            if (oldNotif && !oldNotif.is_read && updated.is_read) {
              return Math.max(0, prevCount - 1);
            }
            return prevCount;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdminView, userId, supabase]);

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    // Optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    let query = supabase.from("notifications").update({ is_read: true });

    if (isAdminView) {
      if (userId) {
        query = query.or(`user_id.is.null,user_id.eq.${userId}`);
      } else {
        query = query.is("user_id", null);
      }
    } else {
      query = query.eq("user_id", userId!);
    }

    await query.in("id", unreadIds);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative group hover:bg-accent/50"
        >
          <Bell className="h-5 w-5 text-foreground/80 group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 shrink-0 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[380px] p-0 overflow-hidden border-border/50 shadow-xl"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border/50">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px] bg-card/50">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-40 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`relative flex flex-col gap-1 p-4 cursor-pointer transition-colors hover:bg-accent/30 ${
                    !notification.is_read ? "bg-primary/5" : ""
                  }`}
                >
                  {!notification.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 pr-4">
                    {notification.message?.includes("out_for_delivery")
                      ? notification.message.replace(
                          "out_for_delivery",
                          "out for delivery",
                        )
                      : notification.message}
                  </p>

                  {notification.link && (
                    <div className="mt-2 flex items-center text-xs text-primary font-medium">
                      View details <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t border-border/50 bg-card">
          <Button
            variant="ghost"
            className="w-full text-sm text-center text-muted-foreground hover:text-foreground h-9"
            onClick={() => {
              setIsOpen(false);
              router.push(
                isAdminView ? "/admin/notifications" : "/account/notifications",
              );
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
