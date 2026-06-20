"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  X,
  Package,
  Save,
  Send,
  Loader2,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Platform } from "@/lib/types";
import { useCreateProduct } from "@/hooks";
import { CategoryCombobox } from "@/components/products/CategoryCombobox";
import { PageHeader } from "@/components/shared/PageHeader";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green",
  "Yellow", "Orange", "Pink", "Purple", "Brown",
];

interface VariantGroup {
  id: string;
  type: "size" | "color";
  options: string[];
}

const PLATFORMS: { key: Platform; label: string; color: string; bg: string }[] = [
  { key: "instagram", label: "Instagram", color: "bg-pink-500", bg: "bg-pink-500/10" },
  { key: "facebook", label: "Facebook", color: "bg-blue-500", bg: "bg-blue-500/10" },
  { key: "whatsapp", label: "WhatsApp", color: "bg-green-500", bg: "bg-green-500/10" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AddProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  // Basic info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  // Images (Cloudinary URLs collected from ImageUpload)
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Pricing & inventory
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");

  // Variants
  const [variants, setVariants] = useState<VariantGroup[]>([]);

  // Platform toggles
  const [enabledPlatforms, setEnabledPlatforms] = useState<Set<Platform>>(
    new Set(["instagram", "whatsapp"])
  );

  const togglePlatform = (platform: Platform) => {
    setEnabledPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  // Variants helpers
  const addVariant = (type: "size" | "color") => {
    if (variants.find((v) => v.type === type)) return;
    setVariants((prev) => [
      ...prev,
      { id: `var-${Date.now()}`, type, options: [] },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const toggleVariantOption = (variantId: string, option: string) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        const exists = v.options.includes(option);
        return {
          ...v,
          options: exists ? v.options.filter((o) => o !== option) : [...v.options, option],
        };
      })
    );
  };

  const hasSize = variants.some((v) => v.type === "size");
  const hasColor = variants.some((v) => v.type === "color");

  // Submit
  const handleSubmit = (is_active: boolean) => {
    if (!name.trim() || !price || isNaN(Number(price)) || Number(price) < 0) return;

    const payload: Record<string, any> = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: parseFloat(price),
      compare_price: comparePrice ? parseFloat(comparePrice) : undefined,
      images: imageUrls,
      stock: parseInt(stock) || 0,
      sku: sku.trim() || undefined,
      platforms: Array.from(enabledPlatforms),
      is_active,
    };

    if (categoryId) payload.category_id = categoryId;

    const variantData = variants
      .filter((v) => v.options.length > 0)
      .map((v) => ({ type: v.type, options: v.options }));
    if (variantData.length > 0) payload.variants = variantData;

    createProduct.mutate(payload, {
      onSuccess: () => router.push(ROUTES.PRODUCTS),
    });
  };

  const isSubmitting = createProduct.isPending;
  const canSubmit = name.trim() && price && !isNaN(Number(price)) && Number(price) >= 0;
  const totalVariantOptions = variants.reduce((acc, v) => acc + v.options.length, 0);

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
          title="Add Product"
          description="Add a new product to your catalog"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save as Draft
              </Button>
              <Button
                className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Publish
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── Left Column ─────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Product name, description, and category</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Ankara Maxi Set"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product — colors, materials, sizing, etc."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <CategoryCombobox
                  value={categoryId}
                  onChange={(id, catName) => {
                    setCategoryId(id);
                    setCategoryName(catName);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Search existing categories or create a new one inline.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload up to 5 images. The first image will be the main product image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload maxFiles={5} onUrlsChange={setImageUrls} />
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Set your product price, compare price, SKU and stock level
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">
                    Price (NGN) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="compare-price">Compare-at Price (NGN)</Label>
                  <Input
                    id="compare-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Shows as original price with strikethrough
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="e.g. ANK-MAX-001 (auto-generated if empty)"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Add size and color options for this product</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {variants.map((variant) => (
                <div key={variant.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold capitalize">{variant.type}</h4>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeVariant(variant.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(variant.type === "size" ? SIZE_OPTIONS : COLOR_OPTIONS).map((option) => {
                      const selected = variant.options.includes(option);
                      return (
                        <Badge
                          key={option}
                          variant={selected ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selected &&
                              "bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white border-[#FF6B2C]"
                          )}
                          onClick={() => toggleVariantOption(variant.id, option)}
                        >
                          {option}
                        </Badge>
                      );
                    })}
                  </div>
                  {variant.options.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Tap the options above to select them
                    </p>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2">
                {!hasSize && (
                  <Button variant="outline" size="sm" onClick={() => addVariant("size")}>
                    <Plus className="size-4" />
                    Add Sizes
                  </Button>
                )}
                {!hasColor && (
                  <Button variant="outline" size="sm" onClick={() => addVariant("color")}>
                    <Plus className="size-4" />
                    Add Colors
                  </Button>
                )}
                {hasSize && hasColor && (
                  <p className="text-xs text-muted-foreground">All variant types added</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─── Right Column ────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Platform Sync */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Sync</CardTitle>
              <CardDescription>Choose where this product is visible</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {PLATFORMS.map((p, i) => (
                <div key={p.key}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg",
                          p.bg
                        )}
                      >
                        <span className={cn("size-2.5 rounded-full", p.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.label}</p>
                        <p className="text-xs text-muted-foreground">
                          Show on {p.label}{" "}
                          {p.key === "whatsapp" ? "Catalog" : "Shop"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={enabledPlatforms.has(p.key)}
                      onCheckedChange={() => togglePlatform(p.key)}
                    />
                  </div>
                  {i < PLATFORMS.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <Package className="mx-auto size-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Ready to save</p>
                <p className="text-xs text-muted-foreground mt-1">
                  "Save as Draft" keeps it hidden. "Publish" makes it live.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium truncate ml-4 max-w-[160px]">
                  {name || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{categoryName || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {price ? formatCurrency(Number(price)) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{stock || "0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Images</span>
                <span className="font-medium">{imageUrls.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Variants</span>
                <span className="font-medium">{totalVariantOptions || "None"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platforms</span>
                <div className="flex items-center gap-1.5">
                  {PLATFORMS.filter((p) => enabledPlatforms.has(p.key)).map((p) => (
                    <span key={p.key} className={cn("size-2.5 rounded-full", p.color)} />
                  ))}
                  {enabledPlatforms.size === 0 && (
                    <span className="text-muted-foreground">None</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar (mobile) */}
      <div className="flex items-center justify-end gap-2 border-t border-border pt-4 lg:hidden">
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save as Draft
        </Button>
        <Button
          className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Publish
        </Button>
      </div>
    </div>
  );
}
