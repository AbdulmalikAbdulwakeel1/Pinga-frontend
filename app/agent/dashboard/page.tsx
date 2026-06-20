"use client";

import Link from "next/link";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Star,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn, getInitials, getPlatformColor, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatsCard } from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useConversations } from "@/hooks";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
};

const platformLabels: Record<string, string> = {
  instagram: "IG",
  facebook: "FB",
  whatsapp: "WA",
};

export default function AgentDashboardPage() {
  const { data: user } = useProfile();
  const { data: convData, isLoading } = useConversations({ limit: 5 } as any);

  const conversations = convData?.conversations || convData || [];
  const firstName = user?.firstName || "Agent";

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good morning, {firstName}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s your activity summary for today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<MessageSquare />}
          label="My Conversations"
          value={conversations.length}
          change={8}
          accentColor="#FF6B2C"
        />
        <StatsCard
          icon={<CheckCircle2 />}
          label="Resolved Today"
          value={conversations.filter((c: any) => c.status === "resolved").length}
          change={15}
          accentColor="#10B981"
        />
        <StatsCard
          icon={<Clock />}
          label="Avg Response Time"
          value="< 5s"
          change={-12}
          accentColor="#1877F2"
        />
        <StatsCard
          icon={<Star />}
          label="AI Handling"
          value={`${conversations.filter((c: any) => c.isAiEnabled).length}/${conversations.length}`}
          change={3}
          accentColor="#F59E0B"
        />
      </div>

      {/* Assigned Conversations */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Assigned Conversations</CardTitle>
          <CardAction>
            <Badge variant="secondary" className="font-semibold">
              {conversations.length} active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3.5">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              No conversations assigned yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {conversations.slice(0, 5).map((conv: any) => {
                const PlatformIcon = platformIcons[conv.platform] || MessageCircle;
                const platformColor = getPlatformColor(conv.platform);
                const hasUnread = (conv.unreadCount || conv.unread_count || 0) > 0;

                return (
                  <Link
                    key={conv.id}
                    href={ROUTES.AGENT_CONVERSATIONS}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted/50",
                      hasUnread && "bg-pinga-orange-light/30"
                    )}
                  >
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-semibold",
                          hasUnread
                            ? "bg-[#FF6B2C]/15 text-[#FF6B2C]"
                            : "bg-[#1A2B3E]/10 text-[#1A2B3E] dark:bg-white/10 dark:text-white"
                        )}
                      >
                        {getInitials(conv.contactName || conv.contact_name || "?")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("truncate text-sm", hasUnread ? "font-semibold" : "font-medium")}>
                          {conv.contactName || conv.contact_name || "Unknown"}
                        </span>
                        <Badge
                          variant="secondary"
                          className="h-4 shrink-0 px-1.5 text-[10px] font-semibold"
                          style={{ backgroundColor: `${platformColor}15`, color: platformColor }}
                        >
                          <PlatformIcon className="mr-0.5 size-2.5" />
                          {platformLabels[conv.platform]}
                        </Badge>
                      </div>
                      <p className={cn("mt-0.5 truncate text-xs", hasUnread ? "font-medium text-foreground/80" : "text-muted-foreground")}>
                        {conv.lastMessage || conv.last_message || "No messages yet"}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(conv.lastMessageAt || conv.last_message_at || conv.createdAt)}
                      </span>
                      {hasUnread && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-pinga-orange text-[10px] font-bold text-white">
                          {conv.unreadCount || conv.unread_count}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90">
          <Link href={ROUTES.AGENT_CONVERSATIONS}>
            <MessageSquare className="mr-1.5 size-4" />
            View All Conversations
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.AGENT_LEADS}>
            <ArrowRight className="mr-1.5 size-4" />
            View Leads
          </Link>
        </Button>
      </div>
    </div>
  );
}
