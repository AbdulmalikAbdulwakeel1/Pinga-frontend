"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Product, Platform } from "@/lib/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  className?: string;
}

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

function getStockStatus(stock: number) {
  if (stock === 0) return { label: "Out of Stock", className: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800" };
  if (stock <= 5) return { label: "Low Stock", className: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800" };
  return { label: "In Stock", className: "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800" };
}

export function ProductCard({ product, onDelete, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const stockStatus = getStockStatus(product.stock);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "group relative transition-shadow duration-200",
          isHovered && "shadow-md",
          className
        )}
      >
        {/* Product Image */}
        <div className="relative mx-6 aspect-square overflow-hidden rounded-lg bg-muted">
          {product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Package className="size-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Quick actions overlay */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-2 bg-black/40 transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Button
              size="icon-sm"
              variant="secondary"
              asChild
            >
              <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
                <Eye className="size-4" />
                <span className="sr-only">View product</span>
              </Link>
            </Button>
          </div>

          {/* Status badge */}
          {!product.isActive && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2"
            >
              Inactive
            </Badge>
          )}
        </div>

        <CardContent className="flex flex-col gap-3">
          {/* Name & Actions Row */}
          <div className="flex items-start justify-between gap-2">
            <Link
              href={ROUTES.PRODUCT_DETAIL(product.id)}
              className="text-sm font-semibold leading-snug hover:text-[#FF6B2C] transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs">
                  <MoreVertical className="size-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.PRODUCT_EDIT(product.id)}>
                    <Edit className="size-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete?.(product.id)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#1A2B3E] dark:text-foreground">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Stock & Platforms Row */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn("text-xs font-medium", stockStatus.className)}
            >
              {stockStatus.label}
            </Badge>

            {/* Platform dots */}
            <div className="flex items-center gap-1.5">
              {product.platforms.map((platform) => (
                <span
                  key={platform}
                  title={platformLabels[platform]}
                  className={cn(
                    "size-2.5 rounded-full",
                    platformDotColors[platform]
                  )}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
