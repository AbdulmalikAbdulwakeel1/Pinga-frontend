"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  MessageSquare,
  Bot,
  Clock,
  ChevronRight,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useConversationAnalytics, useDashboardStats } from "@/hooks";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E1306C",
  whatsapp: "#25D366",
  facebook: "#1877F2",
};

export default function ConversationAnalyticsPage() {
  const router = useRouter();

  const { data: convoAnalytics } = useConversationAnalytics();
  const { data: stats } = useDashboardStats();

  const conversationsByDay: { date: string; total: number; ai: number; human: number }[] =
    convoAnalytics?.conversationsByDay ?? [];

  const rawPlatforms: { platform: string; conversations: number; leads: number; orders: number }[] =
    convoAnalytics?.platformBreakdown ?? [];

  const totalPlatformConvos = rawPlatforms.reduce((sum, p) => sum + p.conversations, 0);
  const platformBreakdown = rawPlatforms.map((p) => ({
    ...p,
    name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
    percent: totalPlatformConvos > 0 ? Math.round((p.conversations / totalPlatformConvos) * 100) : 0,
    color: PLATFORM_COLORS[p.platform] ?? "#666",
  }));

  const aiHandlingRate: number = convoAnalytics?.aiHandlingRate ?? 0;
  const totalConversations: number = stats?.conversations?.value ?? 0;
  const aiHandled = Math.round((totalConversations * aiHandlingRate) / 100);
  const humanHandled = totalConversations - aiHandled;

  const aiVsHuman = [
    { name: "AI Handled", value: aiHandled, color: "#FF6B2C" },
    { name: "Human Handled", value: humanHandled, color: "#1877F2" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => router.push(ROUTES.ANALYTICS)}
        >
          <ArrowLeft className="size-4" />
          Back to Analytics
        </Button>

        <PageHeader
          title="Conversation Analytics"
          description="AI and human conversation performance insights"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: <MessageSquare />,
            label: "Total Conversations",
            value: formatNumber(totalConversations),
            change: stats?.conversations?.change ?? 0,
            color: "#FF6B2C",
          },
          {
            icon: <Bot />,
            label: "AI Handling Rate",
            value: `${aiHandlingRate}%`,
            change: 0,
            color: "#8B5CF6",
          },
          {
            icon: <Clock />,
            label: "Avg Response Time",
            value: convoAnalytics?.avgResponseTime ?? "< 5s",
            change: 0,
            color: "#25D366",
          },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <StatsCard icon={stat.icon} label={stat.label} value={stat.value} change={stat.change} accentColor={stat.color} />
          </motion.div>
        ))}
      </div>

      {/* Conversation Volume Chart */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Conversation Volume</CardTitle>
            <CardDescription>Daily conversations split by AI vs Human handling (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {conversationsByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={conversationsByDay}>
                    <defs>
                      <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="humanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1877F2" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      interval={Math.floor(conversationsByDay.length / 6)}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <Area type="monotone" dataKey="ai" stroke="#FF6B2C" strokeWidth={2} fill="url(#aiGradient)" name="AI Handled" />
                    <Area type="monotone" dataKey="human" stroke="#1877F2" strokeWidth={2} fill="url(#humanGradient)" name="Human Handled" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No conversation data yet
                </div>
              )}
            </div>
            {conversationsByDay.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#FF6B2C]" />
                  <span className="text-xs text-muted-foreground">AI Handled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#1877F2]" />
                  <span className="text-xs text-muted-foreground">Human Handled</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI vs Human + Platform Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI vs Human Donut */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI vs Human Breakdown</CardTitle>
              <CardDescription>Conversation handling distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {totalConversations > 0 ? (
                <div className="flex items-center gap-6">
                  <div className="h-[200px] w-[200px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie
                          data={aiVsHuman}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {aiVsHuman.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--popover))",
                            color: "hsl(var(--popover-foreground))",
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    {aiVsHuman.map((item) => (
                      <div key={item.name} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-5">
                          <span className="text-2xl font-bold">{formatNumber(item.value)}</span>
                          <span className="text-xs text-muted-foreground">conversations</span>
                        </div>
                        <p className="pl-5 text-xs text-muted-foreground">
                          {totalConversations > 0 ? Math.round((item.value / totalConversations) * 100) : 0}% of total
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No conversations yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Breakdown */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
              <CardDescription>Conversations by platform</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {platformBreakdown.length > 0 ? (
                platformBreakdown.map((item) => (
                  <div key={item.platform} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-9 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatNumber(item.conversations)} conversations
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{item.percent}%</p>
                        <p className="text-xs text-muted-foreground">{item.leads} leads</p>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 1, ease: "easeOut" as const }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No platform data yet. Connect a platform to start.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Conversion Funnel */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Conversation-to-Sale Funnel</CardTitle>
            <CardDescription>How conversations convert into sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {[
                { label: "Total Conversations", value: totalConversations, percent: 100 },
                {
                  label: "Leads Generated",
                  value: stats?.leads?.value ?? 0,
                  percent: totalConversations > 0 ? Math.round(((stats?.leads?.value ?? 0) / totalConversations) * 100) : 0,
                },
                {
                  label: "Orders Completed",
                  value: stats?.orders?.value ?? 0,
                  percent: (stats?.leads?.value ?? 0) > 0 ? Math.round(((stats?.orders?.value ?? 0) / (stats?.leads?.value ?? 1)) * 100) : 0,
                },
              ].map((step, i, arr) => (
                <div key={step.label}>
                  <div
                    className="flex items-center justify-between rounded-lg p-3"
                    style={{ backgroundColor: `rgba(255, 107, 44, ${0.03 + i * 0.04})` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-8 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: "#FF6B2C" }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{step.label}</p>
                        {i > 0 && (
                          <p className="text-xs text-muted-foreground">{step.percent}% of previous stage</p>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-bold">{formatNumber(step.value)}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-px bg-[#FF6B2C]/30" />
                        <ChevronRight className="size-3.5 rotate-90 text-[#FF6B2C]/50" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
