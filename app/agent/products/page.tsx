"use client";

import { useState } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Package, Share2, Grid3X3, List } from "lucide-react";
import { useProducts } from "@/hooks";

function StockBadge({ stock }: { stock: number | null }) {
  if (stock === null || stock === undefined)
    return <Badge variant="secondary" className="text-[10px]">Unlimited</Badge>;
  if (stock === 0)
    return <Badge variant="outline" className="text-[10px] text-red-600 border-red-500/20 bg-red-500/10">Out of Stock</Badge>;
  if (stock < 5)
    return <Badge variant="outline" className="text-[10px] text-yellow-600 border-yellow-500/20 bg-yellow-500/10">Low Stock ({stock})</Badge>;
  return <Badge variant="outline" className="text-[10px] text-green-600 border-green-500/20 bg-green-500/10">In Stock ({stock})</Badge>;
}

export default function AgentProductsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { data: productsData, isLoading } = useProducts({
    search: search || undefined,
    is_active: true,
  });

  const products: any[] = productsData?.products || productsData || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">
          Browse the product catalogue to answer customer enquiries.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
            className={cn(view === "grid" && "bg-pinga-orange hover:bg-pinga-orange/90")}
          >
            <Grid3X3 className="size-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
            className={cn(view === "list" && "bg-pinga-orange hover:bg-pinga-orange/90")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Product count */}
      <p className="text-sm text-muted-foreground">
        {isLoading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
      </p>

      {/* Loading state */}
      {isLoading && (
        <div className={cn("gap-4", view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col")}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={cn(view === "grid" ? "h-56" : "h-16")} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Package className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No products found</p>
          <p className="text-xs text-muted-foreground">Try a different search term</p>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && products.length > 0 && view === "grid" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => {
            const images: string[] = product.images || [];
            const firstImage = images[0] || null;

            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  {firstImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={firstImage} alt={product.name} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StockBadge stock={product.stock} />
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.category?.name || "Uncategorised"}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-pinga-orange">
                      {formatCurrency(product.price)}
                    </span>
                    <Button variant="ghost" size="icon-xs">
                      <Share2 className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {!isLoading && products.length > 0 && view === "list" && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Product Catalogue</CardTitle>
            <CardAction>
              <Badge variant="secondary">{products.length} products</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {products.map((product: any) => {
                const images: string[] = product.images || [];
                const firstImage = images[0] || null;

                return (
                  <div key={product.id} className="flex items-center gap-4 px-4 py-3">
                    <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={product.name} className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <Package className="size-5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category?.name || "Uncategorised"} · SKU: {product.sku || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StockBadge stock={product.stock} />
                      <span className="text-sm font-bold text-pinga-orange whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </span>
                      <Button variant="ghost" size="icon-xs">
                        <Share2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
