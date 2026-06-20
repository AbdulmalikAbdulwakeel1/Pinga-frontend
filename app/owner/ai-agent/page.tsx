"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bot,
  Zap,
  Clock,
  Star,
  Settings,
  BookOpen,
  FileText,
  ArrowRight,
  MessageSquare,
  User,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/shared/StatsCard";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const weeklyMessages = [
  { day: "Mon", messages: 210 },
  { day: "Tue", messages: 245 },
  { day: "Wed", messages: 198 },
  { day: "Thu", messages: 280 },
  { day: "Fri", messages: 256 },
  { day: "Sat", messages: 180 },
  { day: "Sun", messages: 220 },
];

const recentConversations = [
  {
    id: "1",
    customer: "Chioma Adeyemi",
    message: "How much is the ankara dress?",
    aiResponse:
      "Hi Chioma! The Ankara Maxi Set is NGN 15,000. It comes with a matching headwrap. Would you like to place an order?",
    time: "2 min ago",
    platform: "instagram",
  },
  {
    id: "2",
    customer: "Emeka Okonkwo",
    message: "Do you deliver to Abuja?",
    aiResponse:
      "Yes, we deliver to Abuja! Delivery takes 2-3 business days and costs NGN 2,500. Would you like to proceed with an order?",
    time: "15 min ago",
    platform: "whatsapp",
  },
  {
    id: "3",
    customer: "Fatima Bello",
    message: "I want to buy 5 yards of adire fabric",
    aiResponse:
      "Great choice! Our Adire Fabric (5 yards) is NGN 15,000. We have tie-dye and batik patterns available. Which style do you prefer?",
    time: "32 min ago",
    platform: "facebook",
  },
  {
    id: "4",
    customer: "Oluwaseun Bakare",
    message: "Wetin be your best price for the beaded bag?",
    aiResponse:
      "Hello! The Handmade Beaded Bag na NGN 15,000. E dey come with free pouch. You wan order am?",
    time: "1 hr ago",
    platform: "instagram",
  },
  {
    id: "5",
    customer: "Aisha Mohammed",
    message: "Is the coral necklace still available?",
    aiResponse:
      "Yes, the Coral Bead Necklace is still available at NGN 15,000. It's one of our bestsellers! Shall I reserve one for you?",
    time: "2 hr ago",
    platform: "whatsapp",
  },
];

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

// ---------------------------------------------------------------------------
// Platform color helper
// ---------------------------------------------------------------------------

function platformColor(platform: string) {
  switch (platform) {
    case "instagram":
      return "bg-pink-500/10 text-pink-600";
    case "whatsapp":
      return "bg-green-500/10 text-green-600";
    case "facebook":
      return "bg-blue-500/10 text-blue-600";
    default:
      return "bg-gray-500/10 text-gray-600";
  }
}

// ---------------------------------------------------------------------------
// AI Agent Overview Page
// ---------------------------------------------------------------------------

export default function AIAgentPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">AI Agent</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage your AI assistant
          </p>
        </div>
        <Link href={ROUTES.AI_SETTINGS}>
          <Button variant="outline" className="gap-2">
            <Settings className="size-4" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <Bot />,
            label: "Messages Today",
            value: "247",
            change: 12.3,
            color: "#FF6B2C",
          },
          {
            icon: <Zap />,
            label: "Response Rate",
            value: "94%",
            change: 2.1,
            color: "#8B5CF6",
          },
          {
            icon: <Clock />,
            label: "Avg Response Time",
            value: "12s",
            change: -8.5,
            color: "#1877F2",
          },
          {
            icon: <Star />,
            label: "Satisfaction",
            value: "4.7/5",
            change: 3.2,
            color: "#25D366",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
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

      {/* Chart + Personality */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Messages Chart */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Messages This Week</CardTitle>
              <CardDescription>Daily AI-handled messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={weeklyMessages}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
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
                    <Bar
                      dataKey="messages"
                      fill="#FF6B2C"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Personality */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Current Personality</CardTitle>
              <CardDescription>Active AI configuration</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#FF6B2C]/10 text-2xl">
                  😊
                </div>
                <div>
                  <p className="font-semibold">Friendly</p>
                  <p className="text-xs text-muted-foreground">
                    Warm and approachable tone
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Languages
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">English</Badge>
                  <Badge variant="secondary">Pidgin</Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Sample Greeting
                </span>
                <div className="rounded-lg bg-muted/50 p-3 text-sm italic text-muted-foreground">
                  &quot;Hello! Welcome to our store. How can I help you today? Feel
                  free to ask about any of our products!&quot;
                </div>
              </div>

              <Link href={ROUTES.AI_SETTINGS} className="mt-auto">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Settings className="size-3.5" />
                  Customize
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent AI Conversations */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Conversations</CardTitle>
            <CardDescription>
              Latest messages handled by your AI agent
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentConversations.map((convo) => (
              <div
                key={convo.id}
                className="flex flex-col gap-3 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {convo.customer}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-2 text-[10px] capitalize",
                          platformColor(convo.platform)
                        )}
                      >
                        {convo.platform}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {convo.time}
                  </span>
                </div>

                {/* Customer message */}
                <div className="ml-10 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm">{convo.message}</p>
                </div>

                {/* AI response */}
                <div className="ml-10 flex gap-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]/10">
                    <Bot className="size-3.5 text-[#FF6B2C]" />
                  </div>
                  <div className="rounded-lg border border-[#FF6B2C]/20 bg-[#FF6B2C]/5 p-3">
                    <p className="text-sm">{convo.aiResponse}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Train AI",
            description: "Add Q&A pairs and product knowledge",
            icon: BookOpen,
            href: ROUTES.AI_TRAIN,
            color: "#FF6B2C",
          },
          {
            title: "Templates",
            description: "Manage response templates",
            icon: FileText,
            href: ROUTES.AI_TEMPLATES,
            color: "#8B5CF6",
          },
          {
            title: "Settings",
            description: "Configure personality and behavior",
            icon: Settings,
            href: ROUTES.AI_SETTINGS,
            color: "#1A2B3E",
          },
        ].map((link, i) => (
          <motion.div
            key={link.title}
            custom={7 + i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link href={link.href}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${link.color}15` }}
                  >
                    <link.icon
                      className="size-5"
                      style={{ color: link.color }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-semibold">{link.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {link.description}
                    </span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
