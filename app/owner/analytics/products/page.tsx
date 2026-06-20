"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Package,
  Eye,
  ShoppingCart,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useProductAnalytics } from "@/hooks";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

type SortField = "name" | "viewCount" | "salesCount" | "revenue" | "price";
type SortDir = "asc" | "desc";

export default function ProductAnalyticsPage() {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: productAnalytics, isLoading } = useProductAnalytics();

  const topProducts: Array<{
    id: string;
    name: string;
    price: number;
    salesCount: number;
    viewCount: number;
    isActive: boolean;
    categoryName: string | null;
    revenue: number;
  }> = productAnalytics?.topProducts ?? [];

  const lowStock: Array<{ id: string; name: string; price: number; stockQuantity: number }> =
    productAnalytics?.lowStock ?? [];

  const totalProducts: number = productAnalytics?.totalProducts ?? 0;
  const activeProducts: number = productAnalytics?.activeProducts ?? 0;

  const totalViews = topProducts.reduce((acc, p) => acc + (p.viewCount ?? 0), 0);
  const totalSales = topProducts.reduce((acc, p) => acc + (p.salesCount ?? 0), 0);
  const totalRevenue = topProducts.reduce((acc, p) => acc + (p.revenue ?? 0), 0);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedProducts = useMemo(() => {
    return [...topProducts].sort((a, b) => {
      const aVal = a[sortField as keyof typeof a];
      const bVal = b[sortField as keyof typeof b];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [topProducts, sortField, sortDir]);

  // Category aggregation from product data
  const categoryMap = useMemo(() => {
    const map: Record<string, { products: number; views: number; sales: number; revenue: number }> = {};
    for (const p of topProducts) {
      const cat = p.categoryName ?? "Uncategorised";
      if (!map[cat]) map[cat] = { products: 0, views: 0, sales: 0, revenue: 0 };
      map[cat].products++;
      map[cat].views += p.viewCount ?? 0;
      map[cat].sales += p.salesCount ?? 0;
      map[cat].revenue += p.revenue ?? 0;
    }
    return Object.entries(map)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [topProducts]);

  // Chart data — truncate names
  const chartData = topProducts.slice(0, 8).map((p) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name,
    revenue: p.revenue,
    sales: p.salesCount,
  }));

  function SortableHead({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <TableHead className={cn("cursor-pointer select-none", className)} onClick={() => toggleSort(field)}>
        <div className="flex items-center gap-1">
          {children}
          <ArrowUpDown className={cn("size-3", sortField === field ? "text-[#FF6B2C]" : "text-muted-foreground/40")} />
        </div>
      </TableHead>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading product analytics…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.push(ROUTES.ANALYTICS)}>
          <ArrowLeft className="size-4" />
          Back to Analytics
        </Button>
        <PageHeader title="Product Analytics" description="Product performance metrics and insights" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Package />, label: "Total Products", value: formatNumber(totalProducts), change: 0, color: "#1877F2" },
          { icon: <Eye />, label: "Total Views", value: formatNumber(totalViews), change: 0, color: "#FF6B2C" },
          { icon: <ShoppingCart />, label: "Total Sales", value: formatNumber(totalSales), change: 0, color: "#25D366" },
          { icon: <TrendingUp />, label: "Active Products", value: formatNumber(activeProducts), change: 0, color: "#8B5CF6" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <StatsCard icon={stat.icon} label={stat.label} value={stat.value} change={stat.change} accentColor={stat.color} />
          </motion.div>
        ))}
      </div>

      {/* Product Performance Table */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Click column headers to sort</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedProducts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHead field="name">Product</SortableHead>
                    <SortableHead field="viewCount" className="text-right">Views</SortableHead>
                    <SortableHead field="salesCount" className="text-right">Sales</SortableHead>
                    <SortableHead field="revenue" className="text-right">Revenue</SortableHead>
                    <SortableHead field="price" className="text-right">Price</SortableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Link
                          href={ROUTES.PRODUCT_DETAIL(product.id)}
                          className="font-medium transition-colors hover:text-[#FF6B2C]"
                        >
                          {product.name}
                        </Link>
                        {product.categoryName && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{product.categoryName}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(product.viewCount ?? 0)}</TableCell>
                      <TableCell className="text-right">{product.salesCount ?? 0}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(product.revenue ?? 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price ?? 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No products yet. Add your first product to see analytics.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Products Chart + Low Stock */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products Bar Chart */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Products by Revenue</CardTitle>
              <CardDescription>Top 8 products ranked by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
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
                        formatter={(value: any, name: any) => [
                          name === "revenue" ? formatCurrency(value) : `${value} sales`,
                          name === "revenue" ? "Revenue" : "Sales",
                        ]}
                      />
                      <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`rgba(255, 107, 44, ${1 - index * 0.1})`} />
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

        {/* Low Stock Alert */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products with fewer than 5 units remaining</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {lowStock.length > 0 ? (
                lowStock.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        product.stockQuantity === 0
                          ? "border-red-200 bg-red-500/10 text-red-700 dark:border-red-800 dark:text-red-400"
                          : "border-yellow-200 bg-yellow-500/10 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
                      )}
                    >
                      {product.stockQuantity === 0 ? "Out of stock" : `${product.stockQuantity} left`}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">All products are well stocked.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Category Performance */}
      {categoryMap.length > 0 && (
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Performance breakdown by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Products</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryMap.map((cat) => {
                    const share = totalRevenue > 0 ? ((cat.revenue / totalRevenue) * 100).toFixed(1) : "0.0";
                    return (
                      <TableRow key={cat.category}>
                        <TableCell className="font-medium">{cat.category}</TableCell>
                        <TableCell className="text-center">{cat.products}</TableCell>
                        <TableCell className="text-right">{formatNumber(cat.views)}</TableCell>
                        <TableCell className="text-right">{cat.sales}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(cat.revenue)}</TableCell>
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
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
