"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  MessageSquare,
  Users,
  ShoppingCart,
  ArrowRight,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/shared/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardStats, useRevenueAnalytics, useProductAnalytics, useConversationAnalytics } from "@/hooks";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

const PLATFORM_META: Record<string, { icon: any; color: string; bg: string }> = {
  instagram: { icon: Instagram, color: "#E1306C", bg: "bg-pink-500/10" },
  whatsapp: { icon: MessageCircle, color: "#25D366", bg: "bg-green-500/10" },
  facebook: { icon: Facebook, color: "#1877F2", bg: "bg-blue-500/10" },
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  const revenueDays = period === "7d" ? 7 : period === "14d" ? 14 : 30;
  const { data: stats } = useDashboardStats();
  const { data: revenueData } = useRevenueAnalytics(revenueDays);
  const { data: productAnalytics } = useProductAnalytics();
  const { data: conversationAnalytics } = useConversationAnalytics();

  // Revenue chart data — API returns revenueByDay
  const revenueTrend: { date: string; revenue: number }[] =
    revenueData?.revenueByDay ?? [];

  // Top products — API returns salesCount not sales
  const topProducts: Array<{ id: string; name: string; salesCount: number; revenue: number }> =
    productAnalytics?.topProducts ?? stats?.topProducts ?? [];

  // Platform breakdown — compute percentages from raw counts
  const rawPlatforms: Array<{ platform: string; conversations: number }> =
    conversationAnalytics?.platformBreakdown ?? [];
  const totalPlatformConvos = rawPlatforms.reduce((sum, p) => sum + p.conversations, 0);
  const platformBreakdown = rawPlatforms.map((p) => {
    const meta = PLATFORM_META[p.platform] ?? { icon: MessageCircle, color: "#666", bg: "bg-muted" };
    return {
      platform: p.platform,
      name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
      count: p.conversations,
      percent: totalPlatformConvos > 0 ? Math.round((p.conversations / totalPlatformConvos) * 100) : 0,
      ...meta,
    };
  });

  // Conversion funnel from real data
  const totalConversations = stats?.conversations?.value ?? 0;
  const totalLeads = stats?.leads?.value ?? 0;
  const totalOrders = stats?.orders?.value ?? 0;
  const conversionFunnel = [
    { label: "Total Conversations", value: totalConversations, percent: 100 },
    { label: "Leads Generated", value: totalLeads, percent: totalConversations > 0 ? Math.round((totalLeads / totalConversations) * 100) : 0 },
    { label: "Orders Completed", value: totalOrders, percent: totalLeads > 0 ? Math.round((totalOrders / totalLeads) * 100) : 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track your business performance
          </p>
        </div>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="14d">14 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <Wallet />,
            label: "Revenue",
            value: formatCurrency(stats?.revenue?.value ?? 0),
            change: stats?.revenue?.change ?? 0,
            color: "#FF6B2C",
          },
          {
            icon: <MessageSquare />,
            label: "Conversations",
            value: formatNumber(stats?.conversations?.value ?? 0),
            change: stats?.conversations?.change ?? 0,
            color: "#1877F2",
          },
          {
            icon: <Users />,
            label: "Leads",
            value: formatNumber(stats?.leads?.value ?? 0),
            change: stats?.leads?.change ?? 0,
            color: "#25D366",
          },
          {
            icon: <ShoppingCart />,
            label: "Orders",
            value: formatNumber(stats?.orders?.value ?? 0),
            change: stats?.orders?.change ?? 0,
            color: "#8B5CF6",
          },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <StatsCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              accentColor={stat.color}
            />
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Revenue over the last {revenueDays} days</CardDescription>
            <CardAction>
              <Link href={ROUTES.ANALYTICS_REVENUE}>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View Details
                  <ChevronRight className="size-3.5" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {revenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      interval={Math.floor(revenueTrend.length / 6)}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--popover))",
                        color: "hsl(var(--popover-foreground))",
                        fontSize: 12,
                      }}
                      formatter={(value: any) => [formatCurrency(value as number), "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FF6B2C"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No revenue data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Platform Breakdown + Conversion Funnel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Platform Breakdown */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Platform Breakdown</CardTitle>
              <CardDescription>Conversations by platform</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {platformBreakdown.length > 0 ? (
                platformBreakdown.map((platform) => (
                  <div key={platform.platform} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("flex size-9 items-center justify-center rounded-lg", platform.bg)}>
                          <platform.icon className="size-4" style={{ color: platform.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatNumber(platform.count)} conversations
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold">{platform.percent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: platform.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${platform.percent}%` }}
                        transition={{ duration: 1, ease: "easeOut" as const }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No conversation data yet. Connect a platform to get started.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>From conversations to completed orders</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {conversionFunnel.map((step, i, arr) => (
                <div key={step.label}>
                  <div
                    className="flex items-center justify-between rounded-lg p-3"
                    style={{ backgroundColor: `rgba(255, 107, 44, ${0.05 + i * 0.05})` }}
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
                          <p className="text-xs text-muted-foreground">
                            {step.percent}% of previous stage
                          </p>
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
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
            <CardAction>
              <Link href={ROUTES.ANALYTICS_PRODUCTS}>
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All
                  <ChevronRight className="size-3.5" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, i) => (
                    <TableRow key={product.id ?? product.name}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">{product.salesCount ?? 0}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(product.revenue ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No product sales data yet.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { title: "Revenue Analytics", description: "Detailed revenue breakdown", href: ROUTES.ANALYTICS_REVENUE, color: "#FF6B2C" },
          { title: "Conversation Analytics", description: "AI vs Human performance", href: ROUTES.ANALYTICS_CONVERSATIONS, color: "#1877F2" },
          { title: "Product Analytics", description: "Product performance metrics", href: ROUTES.ANALYTICS_PRODUCTS, color: "#25D366" },
        ].map((link, i) => (
          <motion.div key={link.title} custom={8 + i} variants={fadeUp} initial="hidden" animate="visible">
            <Link href={link.href}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{link.title}</span>
                    <span className="text-xs text-muted-foreground">{link.description}</span>
                  </div>
                  <ArrowRight className="size-4" style={{ color: link.color }} />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
