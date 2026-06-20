"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  X,
  Package,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Platform } from "@/lib/types";
import { useProduct, useUpdateProduct, useCategories } from "@/hooks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "8", "10", "12", "14", "16", "18", "13 inch", "14 inch", "15 inch"];
const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Orange", "Pink",
  "Purple", "Brown", "Navy Blue", "Transparent", "Cream", "Gold", "Wine", "Peach",
];

interface VariantGroup {
  id: string;
  type: "size" | "color" | "style";
  options: string[];
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading, isError } = useProduct(productId);
  const updateProduct = useUpdateProduct();
  const { data: categories = [] } = useCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [variants, setVariants] = useState<VariantGroup[]>([]);
  const [syncIG, setSyncIG] = useState(false);
  const [syncFB, setSyncFB] = useState(false);
  const [syncWA, setSyncWA] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCategoryId(product.category?.id || "");
      setPrice(String(product.price || ""));
      setComparePrice(product.comparePrice ? String(product.comparePrice) : "");
      setSku(product.sku || "");
      setStock(String(product.stock ?? ""));
      setImageUrls(product.images || []);

      const platforms: string[] = product.platforms || [];
      setSyncIG(platforms.includes("instagram"));
      setSyncFB(platforms.includes("facebook"));
      setSyncWA(platforms.includes("whatsapp"));

      if (product.variants && Array.isArray(product.variants)) {
        setVariants(
          product.variants.map((v: any) => ({
            id: v.id || `var-${Math.random()}`,
            type: v.type,
            options: [...(v.options || [])],
          }))
        );
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Package className="size-12 text-muted-foreground/40" />
        <p className="text-lg font-medium text-muted-foreground">
          Product not found
        </p>
        <Button variant="outline" onClick={() => router.push(ROUTES.PRODUCTS)}>
          <ArrowLeft className="size-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  const addVariant = (type: "size" | "color") => {
    const exists = variants.find((v) => v.type === type);
    if (exists) return;
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
          options: exists
            ? v.options.filter((o) => o !== option)
            : [...v.options, option],
        };
      })
    );
  };

  const handleSave = () => {
    const platforms: Platform[] = [];
    if (syncIG) platforms.push("instagram" as Platform);
    if (syncFB) platforms.push("facebook" as Platform);
    if (syncWA) platforms.push("whatsapp" as Platform);

    updateProduct.mutate(
      {
        id: productId,
        data: {
          name,
          description,
          price: parseFloat(price),
          compare_price: comparePrice ? parseFloat(comparePrice) : null,
          sku,
          stock: parseInt(stock) || 0,
          category_id: categoryId || null,
          platforms,
          variants,
          images: imageUrls,
        },
      },
      {
        onSuccess: () => router.push(ROUTES.PRODUCT_DETAIL(productId)),
        onError: (err: any) =>
          toast.error(err?.message || "Failed to update product"),
      }
    );
  };

  const hasSize = variants.some((v) => v.type === "size");
  const hasColor = variants.some((v) => v.type === "color");

  const selectedCategoryName =
    (categories as any[]).find((c: any) => c.id === categoryId)?.name || product.category?.name || "";

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => router.push(ROUTES.PRODUCT_DETAIL(productId))}
        >
          <ArrowLeft className="size-4" />
          Back to Product
        </Button>

        <PageHeader
          title="Edit Product"
          description={`Editing "${product.name}"`}
          actions={
            <Button
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
              onClick={handleSave}
              disabled={updateProduct.isPending}
            >
              {updateProduct.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Left Column ---- */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Product name, description, and category
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Product Name</Label>
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
                  placeholder="Describe your product..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category">
                      {selectedCategoryName || "Select a category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(categories as any[]).map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload up to 5 images. First image will be the main product
                image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                maxFiles={5}
                initialUrls={product.images || []}
                onUrlsChange={setImageUrls}
              />
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
                  <Label htmlFor="price">Price (NGN)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="compare-price">
                    Compare-at Price (NGN)
                  </Label>
                  <Input
                    id="compare-price"
                    type="number"
                    placeholder="0"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Shows as original price with a strikethrough
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="e.g. ANK-MAX-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
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
              <CardDescription>
                Add size and color options for this product
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold capitalize">
                      {variant.type}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeVariant(variant.id)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(variant.type === "size"
                      ? SIZE_OPTIONS
                      : variant.type === "color"
                      ? COLOR_OPTIONS
                      : variant.options
                    ).map((option) => {
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
                          onClick={() =>
                            toggleVariantOption(variant.id, option)
                          }
                        >
                          {option}
                        </Badge>
                      );
                    })}
                    {variant.options
                      .filter(
                        (opt) =>
                          !(variant.type === "size"
                            ? SIZE_OPTIONS
                            : variant.type === "color"
                            ? COLOR_OPTIONS
                            : []
                          ).includes(opt)
                      )
                      .map((option) => (
                        <Badge
                          key={option}
                          variant="default"
                          className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white border-[#FF6B2C] cursor-pointer"
                          onClick={() =>
                            toggleVariantOption(variant.id, option)
                          }
                        >
                          {option}
                        </Badge>
                      ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2">
                {!hasSize && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addVariant("size")}
                  >
                    <Plus className="size-4" />
                    Add Sizes
                  </Button>
                )}
                {!hasColor && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addVariant("color")}
                  >
                    <Plus className="size-4" />
                    Add Colors
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---- Right Column ---- */}
        <div className="flex flex-col gap-6">
          {/* Platform Sync */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Sync</CardTitle>
              <CardDescription>
                Choose where this product is visible
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-pink-500/10">
                    <span className="size-2.5 rounded-full bg-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instagram</p>
                    <p className="text-xs text-muted-foreground">
                      Show on Instagram Shop
                    </p>
                  </div>
                </div>
                <Switch checked={syncIG} onCheckedChange={setSyncIG} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <span className="size-2.5 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Facebook</p>
                    <p className="text-xs text-muted-foreground">
                      Show on Facebook Shop
                    </p>
                  </div>
                </div>
                <Switch checked={syncFB} onCheckedChange={setSyncFB} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-green-500/10">
                    <span className="size-2.5 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">
                      Show in WhatsApp Catalog
                    </p>
                  </div>
                </div>
                <Switch checked={syncWA} onCheckedChange={setSyncWA} />
              </div>
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="rounded-lg bg-green-500/10 p-4 text-center">
                <Package className="mx-auto size-8 text-green-600 mb-2" />
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  {product.isActive ? "Active" : "Inactive"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {product.isActive
                    ? "This product is published and visible"
                    : "This product is not visible to customers"}
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
                  {name || "---"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{selectedCategoryName || "---"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {price ? `NGN ${Number(price).toLocaleString()}` : "---"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{stock || "---"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Variants</span>
                <span className="font-medium">
                  {variants.reduce((acc, v) => acc + v.options.length, 0) ||
                    "None"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platforms</span>
                <div className="flex items-center gap-1.5">
                  {syncIG && (
                    <span className="size-2.5 rounded-full bg-pink-500" />
                  )}
                  {syncFB && (
                    <span className="size-2.5 rounded-full bg-blue-500" />
                  )}
                  {syncWA && (
                    <span className="size-2.5 rounded-full bg-green-500" />
                  )}
                </div>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Sales</span>
                <span className="font-medium">{product.salesCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Views</span>
                <span className="font-medium">{product.viewCount ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar (mobile-friendly) */}
      <div className="flex items-center justify-end gap-2 border-t border-border pt-4 lg:hidden">
        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.PRODUCT_DETAIL(productId))}
        >
          Cancel
        </Button>
        <Button
          className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
          onClick={handleSave}
          disabled={updateProduct.isPending}
        >
          {updateProduct.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
