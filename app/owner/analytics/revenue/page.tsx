"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRevenueAnalytics, useProductAnalytics } from "@/hooks";

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

export default function RevenueAnalyticsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("30d");
  const revenueDays = period === "7d" ? 7 : period === "14d" ? 14 : 30;

  const { data: revenueData, isLoading } = useRevenueAnalytics(revenueDays);
  const { data: productAnalytics } = useProductAnalytics();

  const revenueTrend: { date: string; revenue: number; orders: number }[] =
    revenueData?.revenueByDay ?? [];

  const revenueByPlatform: Array<{
    platform: string; revenue: number; orders: number; percentage: number;
  }> = revenueData?.revenueByPlatform ?? [];

  const totalRevenue: number = revenueData?.totalRevenue ?? 0;
  const totalOrders: number = revenueData?.totalOrders ?? 0;
  const avgOrderValue: number = revenueData?.avgOrderValue ?? 0;

  const topProducts = productAnalytics?.topProducts ?? [];

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
          title="Revenue Analytics"
          description="Detailed revenue breakdown and insights"
          actions={
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="7d">7 Days</TabsTrigger>
                <TabsTrigger value="14d">14 Days</TabsTrigger>
                <TabsTrigger value="30d">30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Wallet />, label: "Total Revenue", value: formatCurrency(totalRevenue), change: 0, color: "#FF6B2C" },
          { icon: <ShoppingCart />, label: "Total Orders", value: formatNumber(totalOrders), change: 0, color: "#25D366" },
          { icon: <DollarSign />, label: "Avg Order Value", value: formatCurrency(avgOrderValue), change: 0, color: "#1877F2" },
          { icon: <TrendingUp />, label: "Revenue Growth", value: isLoading ? "—" : `${revenueTrend.length} days`, change: 0, color: "#8B5CF6" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <StatsCard icon={stat.icon} label={stat.label} value={stat.value} change={stat.change} accentColor={stat.color} />
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {revenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="revDetailGradient" x1="0" y1="0" x2="0" y2="1">
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
                      formatter={(value: any, name: any) => [
                        name === "revenue" ? formatCurrency(value) : `${value} orders`,
                        name === "revenue" ? "Revenue" : "Orders",
                      ]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#FF6B2C" strokeWidth={2} fill="url(#revDetailGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No revenue data yet for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Platform Breakdown + Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue by Platform */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue by Platform</CardTitle>
              <CardDescription>Breakdown by sales channel</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {revenueByPlatform.length > 0 ? (
                revenueByPlatform.map((item) => {
                  const color = PLATFORM_COLORS[item.platform] ?? "#666";
                  return (
                    <div key={item.platform} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-9 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize">{item.platform}</p>
                            <p className="text-xs text-muted-foreground">{item.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatCurrency(item.revenue)}</p>
                          <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" as const }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No platform revenue data yet
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Product Revenue Chart */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Products by Revenue</CardTitle>
              <CardDescription>Product revenue distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                {topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart
                      data={topProducts.slice(0, 6)}
                      layout="vertical"
                      margin={{ left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        width={120}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid hsl(var(--border))",
                          backgroundColor: "hsl(var(--popover))",
                          color: "hsl(var(--popover-foreground))",
                          fontSize: 12,
                        }}
                        formatter={(value: any) => [formatCurrency(value), "Revenue"]}
                      />
                      <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                        {topProducts.slice(0, 6).map((_: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${20 + index * 5}, ${85 - index * 5}%, ${55 + index * 3}%)`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No product data yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Revenue Products Table */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Top Revenue Products</CardTitle>
            <CardDescription>Products ranked by total revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product: any, i: number) => {
                    const share = totalRevenue > 0
                      ? ((product.revenue / totalRevenue) * 100).toFixed(1)
                      : "0.0";
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.salesCount ?? 0}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.price ?? 0)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(product.revenue ?? 0)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20">
                            {share}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No product sales data yet
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
