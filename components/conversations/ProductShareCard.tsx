"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Search, Send, Package } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface ShareableProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

const MOCK_PRODUCTS: ShareableProduct[] = [
  {
    id: "prod-1",
    name: "Ankara Fabric - Royal Blue",
    price: 4500,
    image: "/products/ankara-blue.jpg",
    category: "Fabrics",
    inStock: true,
  },
  {
    id: "prod-2",
    name: "iPhone 15 Pro Max Case",
    price: 8500,
    image: "/products/iphone-case.jpg",
    category: "Accessories",
    inStock: true,
  },
  {
    id: "prod-3",
    name: "AirPods Pro 2nd Gen",
    price: 125000,
    image: "/products/airpods.jpg",
    category: "Electronics",
    inStock: true,
  },
  {
    id: "prod-4",
    name: "Adire Shirt - Men",
    price: 15000,
    image: "/products/adire-shirt.jpg",
    category: "Clothing",
    inStock: false,
  },
  {
    id: "prod-5",
    name: "Samsung Galaxy Buds FE",
    price: 45000,
    image: "/products/galaxy-buds.jpg",
    category: "Electronics",
    inStock: true,
  },
  {
    id: "prod-6",
    name: "Lace Fabric - Gold",
    price: 12000,
    image: "/products/lace-gold.jpg",
    category: "Fabrics",
    inStock: true,
  },
];

interface ProductShareCardProps {
  onShareProduct: (product: ShareableProduct) => void;
}

export function ProductShareCard({ onShareProduct }: ProductShareCardProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleShare = (product: ShareableProduct) => {
    onShareProduct(product);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          title="Share product"
        >
          <ShoppingBag className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="border-b border-border p-3">
          <h4 className="mb-2 text-sm font-medium">Share a Product</h4>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="max-h-64">
          <div className="p-1.5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Package className="mb-2 size-8 opacity-40" />
                <span className="text-xs">No products found</span>
              </div>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/60"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#FF6B2C]">
                        {formatCurrency(product.price)}
                      </span>
                      {!product.inStock && (
                        <span className="text-[10px] text-destructive">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="xs"
                    variant={product.inStock ? "default" : "outline"}
                    disabled={!product.inStock}
                    onClick={() => handleShare(product)}
                    className="shrink-0"
                  >
                    <Send className="size-3" />
                    Share
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface InlineProductCardProps {
  name: string;
  price: number;
  image: string;
}

export function InlineProductCard({
  name,
  price,
  image,
}: InlineProductCardProps) {
  return (
    <div className="mt-1.5 flex items-center gap-2.5 rounded-lg border border-border/60 bg-background/80 p-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <Package className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-medium">{name}</p>
        <p className="text-xs font-semibold text-[#FF6B2C]">
          {formatCurrency(price)}
        </p>
      </div>
      <Button size="xs" variant="outline" className="shrink-0 text-[10px]">
        View
      </Button>
    </div>
  );
}
