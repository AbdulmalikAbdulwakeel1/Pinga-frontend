"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Star,
  BarChart3,
} from "lucide-react";
import { useConversationAnalytics } from "@/hooks";

function BarSegment({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-full flex-1 overflow-hidden rounded-sm" style={{ backgroundColor: `${color}20` }}>
      <div
        className="h-full rounded-sm transition-all"
        style={{ width: `${Math.min((value / Math.max(max, 1)) * 100, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function AgentPerformancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: analyticsData, isLoading } = useConversationAnalytics();

  const byDay: any[] = analyticsData?.conversationsByDay || [];
  const platformBreakdown: any[] = analyticsData?.platformBreakdown || [];
  const aiHandlingRate: number = analyticsData?.aiHandlingRate || 0;

  const totalConversations = byDay.reduce((sum, d) => sum + (d.total || 0), 0);
  const totalHuman = byDay.reduce((sum, d) => sum + (d.human || 0), 0);
  const maxDayValue = Math.max(...byDay.map((d) => d.total || 0), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Performance</h1>
        <p className="text-sm text-muted-foreground">
          Track your performance metrics and conversation analytics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={<MessageSquare />} label="Conversations (30d)" value={isLoading ? "—" : totalConversations} change={8} accentColor="#FF6B2C" />
        <StatsCard icon={<CheckCircle2 />} label="Agent Handled" value={isLoading ? "—" : totalHuman} change={12} accentColor="#10B981" />
        <StatsCard icon={<Clock />} label="AI Response Time" value="< 5s" change={-12} accentColor="#1877F2" />
        <StatsCard icon={<Star />} label="AI Handling Rate" value={isLoading ? "—" : `${aiHandlingRate}%`} change={3} accentColor="#F59E0B" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-[#FF6B2C]" />
                Conversations — Last 30 Days
              </CardTitle>
              <CardAction>
                <Badge variant="secondary">{totalConversations} total</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-8" />)}
                </div>
              ) : byDay.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No conversation data yet</p>
              ) : (
                <div className="space-y-2">
                  {byDay.slice(-14).map((day) => (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 text-xs text-muted-foreground">
                        {new Date(day.date).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                      </span>
                      <div className="flex h-5 flex-1 gap-0.5">
                        <BarSegment value={day.ai || 0} max={maxDayValue} color="#FF6B2C" />
                        <BarSegment value={day.human || 0} max={maxDayValue} color="#10B981" />
                      </div>
                      <span className="w-8 text-right text-xs font-semibold">{day.total}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-pinga-orange" />AI handled</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-green-500" />Agent handled</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms */}
        <TabsContent value="platforms" className="mt-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Platform Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : platformBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No platform data yet</p>
              ) : (
                <div className="space-y-4">
                  {platformBreakdown.map((p) => (
                    <div key={p.platform} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize">{p.platform}</span>
                        <Badge variant="secondary">{p.conversations} conversations</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-base font-bold text-pinga-orange">{p.conversations}</p>
                          <p className="text-xs text-muted-foreground">Conversations</p>
                        </div>
                        <div>
                          <p className="text-base font-bold text-blue-500">{p.leads}</p>
                          <p className="text-xs text-muted-foreground">Leads</p>
                        </div>
                        <div>
                          <p className="text-base font-bold text-green-500">{p.orders}</p>
                          <p className="text-xs text-muted-foreground">Orders</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
