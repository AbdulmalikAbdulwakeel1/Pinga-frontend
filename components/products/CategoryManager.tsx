"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Tag, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks";

interface Category {
  id: string;
  name: string;
  description?: string;
  product_count?: number;
}

// ---------------------------------------------------------------------------
// Inline edit row
// ---------------------------------------------------------------------------

function CategoryRow({
  category,
  onDeleted,
}: {
  category: Category;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleSave = () => {
    if (!name.trim() || name.trim() === category.name) {
      setEditing(false);
      setName(category.name);
      return;
    }
    updateCategory.mutate(
      { id: category.id, data: { name: name.trim() } },
      { onSuccess: () => setEditing(false) }
    );
  };

  const handleDelete = () => {
    deleteCategory.mutate(category.id, { onSuccess: onDeleted });
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <Tag className="size-4 shrink-0 text-muted-foreground" />

      {editing ? (
        <Input
          className="h-7 flex-1 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setEditing(false); setName(category.name); }
          }}
          autoFocus
        />
      ) : (
        <span className="flex-1 truncate text-sm font-medium">{category.name}</span>
      )}

      {typeof category.product_count === "number" && !editing && (
        <Badge variant="secondary" className="shrink-0 text-xs">
          {category.product_count} {category.product_count === 1 ? "product" : "products"}
        </Badge>
      )}

      <div className="flex shrink-0 items-center gap-1">
        {editing ? (
          <>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-green-600 hover:text-green-700"
              onClick={handleSave}
              disabled={updateCategory.isPending}
            >
              <Check className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground"
              onClick={() => { setEditing(false); setName(category.name); }}
            >
              <X className="size-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(true)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteCategory.isPending}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// New category form
// ---------------------------------------------------------------------------

function NewCategoryForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const createCategory = useCreateCategory();

  const handleCreate = () => {
    if (!name.trim()) return;
    createCategory.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName("");
          onCreated();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="new-cat-name" className="text-sm font-medium">
        New Category Name
      </Label>
      <div className="flex gap-2">
        <Input
          id="new-cat-name"
          placeholder="e.g. Electronics & Gadgets"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1"
        />
        <Button
          onClick={handleCreate}
          disabled={!name.trim() || createCategory.isPending}
          className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
        >
          {createCategory.isPending ? "Adding…" : "Add"}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface CategoryManagerProps {
  /** Called after any change so the parent can refresh its filter list */
  onChanged?: () => void;
}

export function CategoryManager({ onChanged }: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const { data: categories = [], isLoading } = useCategories();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="shrink-0"
          title="Manage categories"
        >
          <Plus className="size-4" />
          <span className="sr-only">Manage categories</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="size-5 text-[#FF6B2C]" />
            Manage Categories
          </DialogTitle>
        </DialogHeader>

        {/* Create new */}
        <NewCategoryForm onCreated={() => onChanged?.()} />

        <Separator />

        {/* Existing list */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your categories ({categories.length})
          </p>

          {isLoading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Loading…</p>
          ) : categories.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No categories yet. Add your first one above.
            </p>
          ) : (
            <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto pr-1">
              {(categories as Category[]).map((cat) => (
                <CategoryRow
                  key={cat.id}
                  category={cat}
                  onDeleted={() => onChanged?.()}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
