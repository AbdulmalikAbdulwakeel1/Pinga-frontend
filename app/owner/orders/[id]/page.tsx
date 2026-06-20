"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Package,
  Truck,
  MapPin,
  CreditCard,
  User,
  Clock,
  Send,
  Phone,
  Mail,
} from "lucide-react";
import { cn, formatCurrency, formatDate, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Order, OrderStatus } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PlatformBadge } from "@/components/shared/PlatformBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---------------------------------------------------------------------------
// Inline mock data for one order
// ---------------------------------------------------------------------------
const ORDER_STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered"];

const MOCK_ORDER: Order = {
  id: "ord-001",
  orderNumber: "ORD-001",
  customerName: "Chioma Okafor",
  customerPhone: "+234 812 345 6789",
  customerEmail: "chioma@gmail.com",
  platform: "instagram",
  items: [
    { id: "i1", productId: "prod-001", productName: "Ankara Maxi Set", productImage: "", quantity: 2, price: 15000 },
    { id: "i2", productId: "prod-008", productName: "Gele & Aso Oke Set", productImage: "", quantity: 1, price: 35000 },
    { id: "i3", productId: "prod-010", productName: "Waist Beads Set", productImage: "", quantity: 3, price: 2000 },
  ],
  subtotal: 71000,
  deliveryFee: 3000,
  total: 74000,
  status: "Shipped",
  paymentMethod: "transfer",
  paymentStatus: "paid",
  deliveryAddress: "15 Allen Avenue, Ikeja, Lagos",
  notes: "Please deliver before 5pm. Call before delivery.",
  timeline: [
    { id: "tl-1", status: "Delivered", description: "Package delivered to customer", timestamp: "2026-05-17T14:30:00Z", actor: "Delivery Agent" },
    { id: "tl-2", status: "Shipped", description: "Package picked up by delivery agent", timestamp: "2026-05-16T09:00:00Z", actor: "System" },
    { id: "tl-3", status: "Confirmed", description: "Order confirmed and being prepared", timestamp: "2026-05-14T15:00:00Z", actor: "Tolu (Agent)" },
    { id: "tl-4", status: "Payment", description: "Payment received via bank transfer", timestamp: "2026-05-14T10:30:00Z", actor: "System" },
    { id: "tl-5", status: "Created", description: "Order placed via Instagram DM", timestamp: "2026-05-14T08:00:00Z", actor: "AI Agent" },
  ],
  createdAt: "2026-05-14T08:00:00Z",
};

// ---------------------------------------------------------------------------
// Status stepper config
// ---------------------------------------------------------------------------
const stepperStatuses: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered"];

function getStepState(stepStatus: OrderStatus, currentStatus: OrderStatus) {
  const stepIdx = stepperStatuses.indexOf(stepStatus);
  const currentIdx = stepperStatuses.indexOf(currentStatus);
  if (stepIdx < currentIdx) return "completed";
  if (stepIdx === currentIdx) return "current";
  return "upcoming";
}

const stepIcons: Record<OrderStatus, typeof Package> = {
  Pending: Clock,
  Confirmed: Check,
  Shipped: Truck,
  Delivered: MapPin,
  Cancelled: Clock,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function OrderDetailPage() {
  const router = useRouter();
  const [order, setOrder] = useState(MOCK_ORDER);
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleUpdateStatus = () => {
    setOrder((prev) => ({ ...prev, status: selectedStatus }));
  };

  const handleMarkPaid = () => {
    setOrder((prev) => ({ ...prev, paymentStatus: "paid" }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => router.push(ROUTES.ORDERS)}
        >
          <ArrowLeft className="size-4" />
          Back to Orders
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#1A2B3E] dark:text-foreground">
              Order #{order.orderNumber}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Status Stepper */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {stepperStatuses.map((status, idx) => {
              const state = getStepState(status, order.status);
              const Icon = stepIcons[status];
              return (
                <div key={status} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full border-2 transition-colors",
                        state === "completed" && "border-green-500 bg-green-500 text-white",
                        state === "current" && "border-[#FF6B2C] bg-[#FF6B2C] text-white",
                        state === "upcoming" && "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                      )}
                    >
                      {state === "completed" ? (
                        <Check className="size-5" />
                      ) : (
                        <Icon className="size-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        state === "completed" && "text-green-600 dark:text-green-400",
                        state === "current" && "text-[#FF6B2C]",
                        state === "upcoming" && "text-muted-foreground"
                      )}
                    >
                      {status}
                    </span>
                  </div>
                  {idx < stepperStatuses.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-0.5 flex-1",
                        getStepState(stepperStatuses[idx + 1], order.status) !== "upcoming"
                          ? "bg-green-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Left Column ---- */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Items Table */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Order Items
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                          <Package className="size-5 text-muted-foreground/40" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              {/* Summary */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-[#1A2B3E] dark:text-foreground">Total</span>
                  <span className="font-bold text-[#FF6B2C]">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Order Timeline
              </h3>
              <div className="space-y-0">
                {order.timeline.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Clock className="size-3.5 text-muted-foreground" />
                      </div>
                      {i < order.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className={cn("pb-6", i === order.timeline.length - 1 && "pb-0")}>
                      <p className="text-sm font-medium">{event.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{event.actor}</span>
                        <span className="text-xs text-muted-foreground">&middot;</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---- Right Column ---- */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Customer
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C] font-semibold text-sm">
                  {order.customerName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <PlatformBadge platform={order.platform} size="sm" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{order.customerPhone}</span>
                </div>
                {order.customerEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>{order.customerEmail}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Delivery Information
              </h3>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{order.deliveryAddress}</span>
              </div>
              {order.notes && (
                <div className="mt-3 rounded-md bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Delivery Notes</p>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Payment
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Method</span>
                  <span className="text-sm font-medium capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge status={order.paymentStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-bold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Actions
              </h3>
              <div className="flex flex-col gap-3">
                {/* Update Status */}
                <div className="flex gap-2">
                  <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as OrderStatus)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
                    onClick={handleUpdateStatus}
                  >
                    Update
                  </Button>
                </div>

                <Separator />

                <Button variant="outline" size="sm" className="w-full">
                  <Send className="size-4" />
                  Send Confirmation
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={order.paymentStatus === "paid"}
                  onClick={handleMarkPaid}
                >
                  <CreditCard className="size-4" />
                  {order.paymentStatus === "paid" ? "Already Paid" : "Mark as Paid"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
