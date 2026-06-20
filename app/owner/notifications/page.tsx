"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ShoppingCart,
  Users,
  Bot,
  Monitor,
  CheckCheck,
  Inbox,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import type { Notification, NotificationCategory } from "@/lib/types";
import { ROUTES } from "@/lib/routes";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type FilterTab = "all" | "unread" | NotificationCategory;

const tabs: { value: FilterTab; label: string; icon: typeof Bell }[] = [
  { value: "all", label: "All", icon: Bell },
  { value: "unread", label: "Unread", icon: Inbox },
  { value: "orders", label: "Orders", icon: ShoppingCart },
  { value: "leads", label: "Leads", icon: Users },
  { value: "ai", label: "AI", icon: Bot },
  { value: "system", label: "System", icon: Monitor },
];

const categoryIcons: Record<NotificationCategory, typeof Bell> = {
  orders: ShoppingCart,
  leads: Users,
  ai: Bot,
  system: Monitor,
};

const typeStyles: Record<Notification["type"], string> = {
  info: "bg-blue-500/10 text-blue-600",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-yellow-500/10 text-yellow-600",
  error: "bg-red-500/10 text-red-600",
};

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const { data: rawNotifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications: Notification[] = useMemo(
    () =>
      (rawNotifications as any[]).map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type as Notification["type"],
        category: n.category as NotificationCategory,
        isRead: n.is_read,
        link: n.link,
        createdAt: n.created_at,
      })),
    [rawNotifications]
  );

  const filtered = useMemo(() => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {
      all: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
    };
    for (const cat of ["orders", "leads", "ai", "system"] as NotificationCategory[]) {
      map[cat] = notifications.filter((n) => n.category === cat).length;
    }
    return map;
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            {counts.unread > 0
              ? `You have ${counts.unread} unread notification${counts.unread > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        {counts.unread > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="size-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-muted/30 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                activeTab === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {tab.label}
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  activeTab === tab.value
                    ? "bg-pinga-orange/10 text-pinga-orange"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts[tab.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Bell className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground">
                  {activeTab === "unread"
                    ? "All caught up! No unread notifications."
                    : `No ${activeTab} notifications yet.`}
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map((notif) => {
                const CatIcon = categoryIcons[notif.category];
                return (
                  <motion.div key={notif.id} {...fadeUp} layout>
                    <Link
                      href={notif.link || ROUTES.NOTIFICATIONS}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={cn(
                        "flex items-start gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-muted/50 sm:px-6",
                        !notif.isRead && "bg-pinga-orange/[0.03]"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                          typeStyles[notif.type]
                        )}
                      >
                        <CatIcon className="size-4" />
                      </div>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {!notif.isRead && (
                            <span className="size-2 shrink-0 rounded-full bg-pinga-orange" />
                          )}
                          <span className="truncate text-sm font-medium">
                            {notif.title}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10px] text-muted-foreground">
                            {timeAgo(notif.createdAt)}
                          </span>
                          <Badge
                            variant="outline"
                            className="h-4 text-[10px] px-1.5"
                          >
                            {notif.category}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
