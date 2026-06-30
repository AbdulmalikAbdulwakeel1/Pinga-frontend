"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
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
  Bot,
  Plus,
  Megaphone,
  FileDown,
  X,
  CheckCircle2,
  Circle,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Clock,
  Zap,
  Package,
} from "lucide-react";
import { Instagram, Facebook, Twitter, Linkedin, TikTok, Reddit } from "@/components/icons/brand-icons";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BusinessPulse } from "@/components/shared/BusinessPulse";
import {
  useDashboardStats,
  useRevenueAnalytics,
  useProfile,
  useConversationAnalytics,
} from "@/hooks";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PlatformDot({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    instagram: "bg-pink-500",
    facebook: "bg-blue-500",
    whatsapp: "bg-green-500",
    twitter: "bg-black",
    linkedin: "bg-blue-600",
    tiktok: "bg-gray-900",
    reddit: "bg-orange-500",
  };
  return (
    <span className={cn("inline-block size-2 rounded-full", colors[platform] ?? "bg-gray-400")} />
  );
}

function CircularProgress({ value, size = 120, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/40" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#FF6B2C"
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" as const }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold">{value}%</span>
        <span className="text-[10px] text-muted-foreground">AI Rate</span>
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

const PLATFORM_META = [
  { key: "instagram", name: "Instagram", icon: Instagram,     color: "#E1306C", bg: "bg-pink-500/10" },
  { key: "facebook",  name: "Facebook",  icon: Facebook,      color: "#1877F2", bg: "bg-blue-500/10" },
  { key: "whatsapp",  name: "WhatsApp",  icon: MessageCircle, color: "#25D366", bg: "bg-green-500/10" },
  { key: "twitter",   name: "Twitter/X", icon: Twitter,       color: "#000000", bg: "bg-black/10 dark:bg-white/10" },
  { key: "linkedin",  name: "LinkedIn",  icon: Linkedin,      color: "#0A66C2", bg: "bg-blue-600/10" },
  { key: "tiktok",    name: "TikTok",    icon: TikTok,        color: "#010101", bg: "bg-gray-900/10 dark:bg-white/5" },
  { key: "reddit",    name: "Reddit",    icon: Reddit,         color: "#FF4500", bg: "bg-orange-500/10" },
];

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState("30d");

  const revenueDays = revenuePeriod === "7d" ? 7 : revenuePeriod === "14d" ? 14 : 30;

  const { data: stats } = useDashboardStats();
  const { data: revenueData } = useRevenueAnalytics(revenueDays);
  const { data: profile } = useProfile();
  const { data: convoAnalytics } = useConversationAnalytics();

  // ── Derived values ──────────────────────────────────────────────

  const firstName = profile?.firstName ?? "";
  const connectedPlatforms: string[] = profile?.business?.connectedPlatforms ?? [];
  const hasProducts = (stats?.topProducts?.length ?? 0) > 0;
  const hasOrders = (stats?.orders?.value ?? 0) > 0;

  const onboardingSteps = [
    { label: "Create account",       done: true },
    { label: "Add products",         done: hasProducts },
    { label: "Connect a platform",   done: connectedPlatforms.length > 0 },
    { label: "Configure AI Agent",   done: (stats?.aiResponseRate?.value ?? 0) > 0 },
    { label: "Receive first order",  done: hasOrders },
  ];
  const completedSteps = onboardingSteps.filter((s) => s.done).length;
  const progressPercent = (completedSteps / onboardingSteps.length) * 100;

  // Platform breakdown from convo analytics (conversations per platform)
  const platformBreakdown: Record<string, number> = {};
  (convoAnalytics?.platformBreakdown ?? []).forEach((p: any) => {
    platformBreakdown[p.platform] = p.conversations;
  });

  // Revenue chart — API field is revenueByDay
  const chartData = (revenueData?.revenueByDay ?? []).map((d: any) => ({
    date: typeof d.date === "string" ? d.date.slice(5) : d.date, // show MM-DD
    revenue: typeof d.revenue === "string" ? parseFloat(d.revenue) : (d.revenue ?? 0),
  }));

  // Recent conversations
  const recentConversations: Array<{
    id: string; name: string; avatar: string;
    platform: string;
    message: string; time: string; unread: boolean;
  }> = (stats?.recentConversations ?? []).map((c: any) => ({
    id: String(c.id),
    name: String(c.contactName ?? "Unknown"),
    avatar: String(c.contactAvatar ?? ""),
    platform: String(c.platform ?? ""),
    message: String(c.lastMessage ?? ""),
    time: String(c.lastMessageAt ?? new Date().toISOString()),
    unread: (c.unreadCount ?? 0) > 0,
  }));

  // Top products
  const topProducts: Array<{ id: string; name: string; sales: number; revenue: number }> =
    (stats?.topProducts ?? []).map((p: any) => ({
      id: String(p.id),
      name: String(p.name),
      sales: Number(p.salesCount ?? 0),
      revenue: Number(p.revenue ?? 0),
    }));

  // Recent orders
  const recentOrders: Array<{
    id: string; orderNumber: string; customer: string;
    amount: number; status: string; date: string;
  }> = (stats?.recentOrders ?? []).map((o: any) => ({
    id: String(o.id),
    orderNumber: String(o.orderNumber ?? o.id),
    customer: String(o.customerName ?? "Unknown"),
    amount: typeof o.total === "string" ? parseFloat(o.total) : Number(o.total ?? 0),
    status: String(o.status ?? "pending"),
    date: String(o.createdAt ?? new Date().toISOString()),
  }));

  const aiRate = stats?.aiResponseRate?.value ?? 0;
  const totalConversations = stats?.conversations?.value ?? 0;

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-pinga-orange/10 via-pinga-orange/5 to-transparent p-5 md:p-6"
      >
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{getFormattedDate()}</p>
        </div>
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-pinga-orange/5" />
      </motion.div>

      {/* Business Pulse */}
      <BusinessPulse />

      {/* Onboarding — hide once all done or dismissed */}
      <AnimatePresence>
        {showOnboarding && completedSteps < onboardingSteps.length && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-pinga-orange" />
                  Complete your setup
                </CardTitle>
                <CardDescription>
                  {completedSteps} of {onboardingSteps.length} steps completed
                </CardDescription>
                <CardAction>
                  <Button variant="ghost" size="icon-xs" onClick={() => setShowOnboarding(false)}>
                    <X className="size-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Progress value={progressPercent} className="h-2" />
                <div className="flex flex-wrap gap-2">
                  {onboardingSteps.map((step) => (
                    <Badge
                      key={step.label}
                      variant="outline"
                      className={cn(
                        "gap-1.5 px-3 py-1",
                        step.done
                          ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-800 dark:text-green-400"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {step.done ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5" />}
                      {step.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[
          { icon: <Wallet />,       label: "Revenue",              value: formatCurrency(stats?.revenue?.value ?? 0),        change: stats?.revenue?.change ?? 0,        color: "#FF6B2C" },
          { icon: <MessageSquare />, label: "Conversations",        value: String(totalConversations),                        change: stats?.conversations?.change ?? 0,  color: "#1877F2" },
          { icon: <Users />,        label: "New Leads",             value: String(stats?.leads?.value ?? 0),                  change: stats?.leads?.change ?? 0,          color: "#25D366" },
          { icon: <ShoppingCart />, label: "Orders",                value: String(stats?.orders?.value ?? 0),                 change: stats?.orders?.change ?? 0,         color: "#E1306C" },
          { icon: <Bot />,          label: "AI Response Rate",      value: `${aiRate}%`,                                      change: stats?.aiResponseRate?.change ?? 0, color: "#8B5CF6" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <StatsCard icon={stat.icon} label={stat.label} value={stat.value} change={stat.change} accentColor={stat.color} />
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart + Latest Conversations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardAction>
                <Tabs value={revenuePeriod} onValueChange={setRevenuePeriod}>
                  <TabsList>
                    <TabsTrigger value="7d">7d</TabsTrigger>
                    <TabsTrigger value="14d">14d</TabsTrigger>
                    <TabsTrigger value="30d">30d</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardAction>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <div className="flex h-[280px] flex-col items-center justify-center text-muted-foreground">
                  <ShoppingCart className="mb-2 size-8 opacity-30" />
                  <p className="text-sm">No revenue data for this period</p>
                </div>
              ) : (
                <div className="h-[280px] w-full min-w-0 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(value: any) => [formatCurrency(value as number), "Revenue"]}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#FF6B2C" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#FF6B2C", strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Latest Conversations</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.CONVERSATIONS}>View All <ArrowRight className="size-4" data-icon="inline-end" /></Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {recentConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <MessageSquare className="mb-2 size-8 opacity-30" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                recentConversations.map((convo) => (
                  <Link key={convo.id} href={ROUTES.CONVERSATION_DETAIL(convo.id)} className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                    <div className="relative shrink-0">
                      <Avatar size="sm">
                        {convo.avatar && <AvatarImage src={convo.avatar} alt={convo.name} />}
                        <AvatarFallback>
                          {convo.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {convo.unread && (
                        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-pinga-orange ring-2 ring-card" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={cn("truncate text-sm", convo.unread ? "font-semibold" : "font-medium")}>{convo.name}</span>
                        <PlatformDot platform={convo.platform} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{convo.message}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(convo.time)}</span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Performance + Platform Status + Top Products */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* AI Agent Performance */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="size-5 text-pinga-orange" />
                AI Agent Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <CircularProgress value={aiRate} />
              <div className="grid w-full grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3">
                  <MessageSquare className="size-4 text-muted-foreground" />
                  <span className="text-lg font-bold">{totalConversations}</span>
                  <span className="text-[10px] text-muted-foreground">Total Conversations</span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-lg font-bold">{convoAnalytics?.avgResponseTime ?? "< 5s"}</span>
                  <span className="text-[10px] text-muted-foreground">Avg Response</span>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <Badge variant="outline" className="gap-1.5 border-pinga-orange/20 bg-pinga-orange/10 text-pinga-orange">
                  <Zap className="size-3" />
                  {aiRate > 0 ? `${aiRate}% AI handled` : "Not yet active"}
                </Badge>
                <Button variant="outline" size="sm" asChild>
                  <Link href={ROUTES.AI_AGENT}>Configure</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Status — from real connectedPlatforms */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Platform Status</h3>
          {PLATFORM_META.map((platform) => {
            const Icon = platform.icon;
            const isConnected = connectedPlatforms.includes(platform.key);
            const msgCount = platformBreakdown[platform.key] ?? 0;
            return (
              <Card key={platform.key} size="sm" className="flex-1">
                <CardContent className="flex items-center gap-4">
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", platform.bg)}>
                    <Icon className="size-5" style={{ color: platform.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{platform.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-block size-2 rounded-full", isConnected ? "bg-green-500" : "bg-gray-400")} />
                      <span className="text-xs text-muted-foreground">{isConnected ? "Connected" : "Not connected"}</span>
                    </div>
                  </div>
                  {isConnected ? (
                    <div className="text-right">
                      <p className="text-lg font-bold">{msgCount}</p>
                      <p className="text-[10px] text-muted-foreground">convos</p>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={ROUTES.INTEGRATIONS}>Connect</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Top Products */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.PRODUCTS}>View All <ArrowRight className="size-4" data-icon="inline-end" /></Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Package className="mb-2 size-8 opacity-30" />
                  <p className="text-sm">No products yet</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href={ROUTES.PRODUCT_ADD}>Add your first product</Link>
                  </Button>
                </div>
              ) : (
                topProducts.map((product, i) => {
                  const maxSales = topProducts[0]?.sales || 1;
                  const barWidth = (product.sales / maxSales) * 100;
                  return (
                    <div key={product.id} className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-medium text-muted-foreground">{i + 1}</span>
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Package className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" as const }}
                              className="h-full rounded-full bg-pinga-orange"
                            />
                          </div>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{product.sales} sold</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions + Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "New Product",    icon: Plus,      href: ROUTES.PRODUCT_ADD,  color: "#FF6B2C" },
                  { label: "Send Broadcast", icon: Megaphone, href: ROUTES.BROADCASTS,   color: "#1877F2" },
                  { label: "View Leads",     icon: Users,     href: ROUTES.LEADS,        color: "#25D366" },
                  { label: "Analytics",      icon: FileDown,  href: ROUTES.ANALYTICS,    color: "#8B5CF6" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button key={action.label} variant="outline" className="flex h-auto flex-col items-center gap-2 p-4" asChild>
                      <Link href={action.href}>
                        <div className="flex size-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${action.color}15` }}>
                          <Icon className="size-5" style={{ color: action.color }} />
                        </div>
                        <span className="text-xs font-medium">{action.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={11} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardAction>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.ORDERS}>View All <ArrowRight className="size-4" data-icon="inline-end" /></Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <ShoppingCart className="mb-2 size-8 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="hidden sm:block">
                    <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-x-4 gap-y-3 text-sm">
                      <span className="text-xs font-medium text-muted-foreground">Order</span>
                      <span className="text-xs font-medium text-muted-foreground">Customer</span>
                      <span className="text-xs font-medium text-muted-foreground">Amount</span>
                      <span className="text-xs font-medium text-muted-foreground">Status</span>
                      <span className="text-xs font-medium text-muted-foreground">Date</span>
                      {recentOrders.map((order) => (
                        <Link key={order.id} href={ROUTES.ORDER_DETAIL(order.id)} className="contents group *:flex *:items-center *:py-2 *:transition-colors">
                          <span className="font-medium text-pinga-orange group-hover:text-pinga-orange-hover">{order.orderNumber}</span>
                          <span>{order.customer}</span>
                          <span className="font-medium">{formatCurrency(order.amount)}</span>
                          <span><StatusBadge status={order.status} /></span>
                          <span className="text-xs text-muted-foreground">{timeAgo(order.date)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {recentOrders.map((order) => (
                      <Link key={order.id} href={ROUTES.ORDER_DETAIL(order.id)} className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-pinga-orange">{order.orderNumber}</span>
                          <span className="text-xs text-muted-foreground">{order.customer}</span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-sm font-medium">{formatCurrency(order.amount)}</span>
                          <StatusBadge status={order.status} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
