"use client";

import { useState } from "react";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatsCard } from "@/components/shared/StatsCard";
import { Search, ShoppingCart, Package, Clock, CheckCircle2, Eye } from "lucide-react";
import { useOrders } from "@/hooks";

type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function AgentOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: ordersData, isLoading } = useOrders({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  } as any);

  const orders: any[] = ordersData?.orders || ordersData || [];

  const counts = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track customer orders assigned to you.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={<ShoppingCart />} label="Total Orders" value={counts.total} change={0} accentColor="#FF6B2C" />
        <StatsCard icon={<Clock />} label="Pending" value={counts.pending} change={0} accentColor="#F59E0B" />
        <StatsCard icon={<Package />} label="Shipped" value={counts.shipped} change={0} accentColor="#8B5CF6" />
        <StatsCard icon={<CheckCircle2 />} label="Delivered" value={counts.delivered} change={0} accentColor="#10B981" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders or customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Order List</CardTitle>
          <CardAction>
            <Badge variant="secondary">{orders.length} orders</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Platform</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {order.orderNumber || order.order_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7 shrink-0">
                            <AvatarFallback className="text-[10px]">
                              {getInitials(order.customerName || order.customer_name || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {order.customerName || order.customer_name || "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell capitalize text-sm text-muted-foreground">
                        {order.platform}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        {formatCurrency(order.total || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", statusStyles[order.status] || "")}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {formatDate(order.createdAt || order.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm">
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
