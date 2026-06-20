"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  LayoutGrid,
  List,
  Package,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Product, Platform } from "@/lib/types";
import { useProducts, useDeleteProduct, useCategories } from "@/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryManager } from "@/components/products/CategoryManager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_OPTIONS = ["All", "Active", "Inactive"] as const;
const PLATFORM_OPTIONS = ["All Platforms", "Instagram", "Facebook", "WhatsApp"] as const;

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

function getStockBadge(stock: number) {
  if (stock === 0)
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800">
        Out of Stock
      </Badge>
    );
  if (stock <= 5)
    return (
      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800">
        Low Stock ({stock})
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800">
      In Stock ({stock})
    </Badge>
  );
}

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [platformFilter, setPlatformFilter] = useState("All Platforms");

  const isActiveFilter =
    statusFilter === "Active" ? true : statusFilter === "Inactive" ? false : undefined;

  const { data: productsData, isLoading, isError } = useProducts({
    search: search || undefined,
    is_active: isActiveFilter,
  });
  const products: Product[] = (productsData as any)?.products ?? productsData ?? [];

  const { data: categoriesData = [] } = useCategories();
  const categories: Array<{ id: string; name: string }> = categoriesData as any[];

  const deleteProduct = useDeleteProduct();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter — match by name since product.category is a string name
      if (categoryFilter !== "all") {
        const matchedCat = categories.find((c) => c.id === categoryFilter);
        if (matchedCat && product.category !== matchedCat.name) return false;
      }

      // Platform filter
      if (platformFilter !== "All Platforms") {
        const platformKey = platformFilter.toLowerCase() as Platform;
        if (!product.platforms.includes(platformKey)) return false;
      }

      return true;
    });
  }, [products, categoryFilter, platformFilter, categories]);

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading products...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive">
        Failed to load products. Please try again.
      </div>
    );
  }

  const hasFilters = search || categoryFilter !== "all" || statusFilter !== "All" || platformFilter !== "All Platforms";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"} in your catalog`}
        actions={
          <Button asChild className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white">
            <Link href={ROUTES.PRODUCT_ADD}>
              <Plus className="size-4" />
              Add Product
            </Link>
          </Button>
        }
      />

      {/* Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
            className="sm:w-64"
          />

          {/* Category filter + manager button */}
          <div className="flex items-center gap-1">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CategoryManager onChanged={() => setCategoryFilter("all")} />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 rounded-md border border-border p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package />}
          title="No products found"
          description={
            hasFilters
              ? "Try adjusting your filters to see more results."
              : "Get started by adding your first product."
          }
          actionLabel={hasFilters ? undefined : "Add Product"}
          onAction={hasFilters ? undefined : () => {}}
        />
      ) : viewMode === "grid" ? (
        /* Grid View */
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* List / Table View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  {/* Image */}
                  <TableCell>
                    <div className="size-10 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package className="size-5 text-muted-foreground/40" />
                      )}
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <Link
                      href={ROUTES.PRODUCT_DETAIL(product.id)}
                      className="font-medium hover:text-[#FF6B2C] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.sku}
                    </p>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <span className="font-semibold">
                      {formatCurrency(product.price)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">
                        {formatCurrency(product.comparePrice)}
                      </span>
                    )}
                  </TableCell>

                  {/* Stock */}
                  <TableCell>{getStockBadge(product.stock)}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        product.isActive
                          ? "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800"
                          : "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400 dark:border-gray-700"
                      )}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* Platforms */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {product.platforms.map((platform) => (
                        <span
                          key={platform}
                          title={platformLabels[platform]}
                          className={cn("size-2.5 rounded-full", platformDotColors[platform])}
                        />
                      ))}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
                            <Eye className="size-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={ROUTES.PRODUCT_EDIT(product.id)}>
                            <Edit className="size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}
