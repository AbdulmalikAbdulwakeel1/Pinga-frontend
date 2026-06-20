"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  MoreVertical,
  Loader2,
  Search,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: string;
  name: string;
  description?: string;
  product_count?: number;
  productCount?: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function CategoriesPage() {
  const router = useRouter();

  const { data: rawData, isLoading, isError } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories: Category[] = Array.isArray(rawData) ? (rawData as Category[]) : [];

  const [search, setSearch] = useState("");
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormName("");
    setFormDescription("");
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description ?? "");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    const payload = {
      name: formName.trim(),
      description: formDescription.trim() || undefined,
    };
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, data: payload },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createCategory.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCategory.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;
  const isDeleting = deleteCategory.isPending;
  const totalProducts = categories.reduce(
    (acc, cat) => acc + (cat.product_count ?? cat.productCount ?? 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading categories...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive">
        Failed to load categories. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
          title="Categories"
          description={`${categories.length} ${categories.length === 1 ? "category" : "categories"} · ${totalProducts} total products`}
          actions={
            <Button
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
              onClick={openAddDialog}
            >
              <Plus className="size-4" />
              Add Category
            </Button>
          }
        />
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <FolderOpen className="size-12 opacity-30" />
          <p className="text-sm">
            {search
              ? "No categories match your search."
              : "No categories yet. Create your first one."}
          </p>
          {!search && (
            <Button
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white mt-2"
              onClick={openAddDialog}
            >
              <Plus className="size-4" />
              Add Category
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cat, i) => (
            <motion.div
              key={cat.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Card className="relative h-full transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                        <FolderOpen className="size-6 text-[#FF6B2C]" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="text-base font-semibold leading-tight truncate">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" className="shrink-0 ml-1">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(cat)}>
                          <Edit className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteTarget(cat)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Products</span>
                    <Badge
                      variant="outline"
                      className="bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20"
                    >
                      {cat.product_count ?? cat.productCount ?? 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          if (!isSaving) setDialogOpen(o);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Create a new product category for your store."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-name">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="e.g. Fashion & Clothing"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && formName.trim()) handleSave();
                }}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                placeholder="Briefly describe what belongs in this category..."
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
              onClick={handleSave}
              disabled={!formName.trim() || isSaving}
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : editingCategory ? (
                "Save Changes"
              ) : (
                "Add Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{deleteTarget?.name}"?</DialogTitle>
            <DialogDescription>
              This will permanently delete the category. Products in this category will not be
              deleted but will become uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
