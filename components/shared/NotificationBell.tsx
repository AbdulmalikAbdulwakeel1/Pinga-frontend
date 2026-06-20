"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import type { Notification } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import { mockNotifications } from "@/lib/mock/notifications";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeIcons: Record<Notification["type"], string> = {
  info: "bg-blue-500/10 text-blue-600",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-yellow-500/10 text-yellow-600",
  error: "bg-red-500/10 text-red-600",
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-pinga-orange text-[9px] font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <span className="sr-only">
            Notifications ({unreadCount} unread)
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="z-50 flex w-80 flex-col p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-pinga-orange hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Bell className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.slice(0, 5).map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || ROUTES.NOTIFICATIONS}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                    !notification.isRead && "bg-muted/30"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                      typeIcons[notification.type]
                    )}
                  >
                    <Bell className="size-3.5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">
                      {notification.title}
                    </span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {notification.message}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-pinga-orange" />
                  )}
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="sticky bottom-0 z-10 border-t border-border bg-popover p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href={ROUTES.NOTIFICATIONS}>View All Notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
