"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  ShoppingCart,
  Eye,
  TrendingUp,
  DollarSign,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn, formatCurrency, formatDate, formatNumber, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Platform } from "@/lib/types";
import { useProduct, useProductOrders, useDeleteProduct } from "@/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const platformDotColors: Record<Platform, string> = {
  instagram: "bg-pink-500",
  facebook: "bg-blue-500",
  whatsapp: "bg-green-500",
};

const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useProduct(id);
  const { data: orders = [], isLoading: ordersLoading } = useProductOrders(id);
  const deleteProduct = useDeleteProduct();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading product...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Package className="size-12 opacity-30" />
        <p>Product not found or failed to load.</p>
        <Button variant="outline" onClick={() => router.push(ROUTES.PRODUCTS)}>
          Back to Products
        </Button>
      </div>
    );
  }

  const images: string[] = product.images ?? [];
  const platforms: Platform[] = product.platforms ?? [];
  const variants: Array<{ type: string; options: string[] }> = product.variants ?? [];
  const salesCount: number = product.salesCount ?? 0;
  const viewCount: number = product.viewCount ?? 0;
  const price: number = product.price ?? 0;
  const comparePrice: number | null = product.comparePrice ?? null;
  const stock: number = product.stock ?? 0;
  const isActive: boolean = product.isActive ?? false;
  const category = product.category;

  const conversionRate =
    viewCount > 0 ? ((salesCount / viewCount) * 100).toFixed(1) : "0";
  const totalRevenue = salesCount * price;

  const handleDelete = () => {
    deleteProduct.mutate(id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        router.push(ROUTES.PRODUCTS);
      },
    });
  };

  const handleToggleStatus = async () => {
    setIsTogglingStatus(true);
    try {
      await api.patch(`/products/${id}/toggle`, {});
      queryClient.invalidateQueries({ queryKey: ["products", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Product ${isActive ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => router.push(ROUTES.PRODUCTS)}
        >
          <ArrowLeft className="size-4" />
          Back to Products
        </Button>

        <PageHeader
          title={product.name}
          description={`SKU: ${product.sku}${product.createdAt ? ` · Created ${formatDate(product.createdAt)}` : ""}`}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                className={cn(
                  isActive
                    ? "text-green-700 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400"
                )}
              >
                {isTogglingStatus ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isActive ? (
                  <ToggleRight className="size-4" />
                ) : (
                  <ToggleLeft className="size-4" />
                )}
                {isActive ? "Active" : "Inactive"}
              </Button>

              <Button variant="outline" asChild>
                <Link href={ROUTES.PRODUCT_EDIT(id)}>
                  <Edit className="size-4" />
                  Edit
                </Link>
              </Button>

              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          }
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <ShoppingCart />, label: "Total Sold", value: formatNumber(salesCount), accentColor: "#FF6B2C" },
          { icon: <DollarSign />, label: "Revenue", value: formatCurrency(totalRevenue), accentColor: "#25D366" },
          { icon: <Eye />, label: "Views", value: formatNumber(viewCount), accentColor: "#1877F2" },
          { icon: <TrendingUp />, label: "Conversion", value: `${conversionRate}%`, accentColor: "#8B5CF6" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <StatsCard
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              accentColor={stat.accentColor}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── Left Column ─────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">

          {/* Recent Orders */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders containing this product</CardDescription>
                <CardAction>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={ROUTES.ORDERS}>
                      View All
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Loading orders...
                  </div>
                ) : (orders as any[]).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                    <ShoppingCart className="size-8 opacity-30" />
                    <p className="text-sm">No orders for this product yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(orders as any[]).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <Link
                              href={ROUTES.ORDER_DETAIL(order.id)}
                              className="font-medium text-[#FF6B2C] hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{order.customerName}</span>
                              {order.platform && (
                                <span
                                  className={cn(
                                    "size-2 rounded-full shrink-0",
                                    platformDotColors[order.platform as Platform] ?? "bg-gray-400"
                                  )}
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{order.qty}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(order.total)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {timeAgo(order.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Description */}
          {product.description && (
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* ─── Right Column ────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[activeImageIndex]}
                    alt={product.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-12 opacity-30" />
                    <p className="text-sm">No images</p>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setActiveImageIndex((p) => (p > 0 ? p - 1 : images.length - 1))
                      }
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {activeImageIndex + 1} / {images.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setActiveImageIndex((p) => (p < images.length - 1 ? p + 1 : 0))
                      }
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={cn(
                          "aspect-square overflow-hidden rounded-md border-2 transition-colors",
                          i === activeImageIndex
                            ? "border-[#FF6B2C]"
                            : "border-transparent hover:border-muted-foreground/40"
                        )}
                      >
                        <img src={img} alt="" className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    isActive
                      ? "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800"
                      : "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400 dark:border-gray-700"
                  )}
                >
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#FF6B2C]">
                    {formatCurrency(price)}
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(comparePrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">
                  {category?.name ?? "Uncategorized"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stock</span>
                <Badge
                  variant="outline"
                  className={cn(
                    stock === 0
                      ? "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800"
                      : stock <= 5
                        ? "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800"
                        : "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800"
                  )}
                >
                  {stock === 0 ? "Out of Stock" : `${stock} in stock`}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {product.sku}
                </span>
              </div>

              <Separator />

              {variants.length > 0 && (
                <>
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">Variants</span>
                    {variants.map((v) => (
                      <div key={v.type}>
                        <p className="text-xs font-medium text-muted-foreground mb-1 capitalize">
                          {v.type}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {v.options.map((opt) => (
                            <Badge key={opt} variant="outline" className="text-xs">
                              {opt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </>
              )}

              <div className="flex items-start justify-between gap-2">
                <span className="text-muted-foreground shrink-0">Platforms</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {platforms.length > 0 ? (
                    platforms.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs gap-1.5">
                        <span className={cn("size-2 rounded-full", platformDotColors[p])} />
                        {platformLabels[p]}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{product.name}"?</DialogTitle>
            <DialogDescription>
              This will permanently delete the product and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteProduct.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
