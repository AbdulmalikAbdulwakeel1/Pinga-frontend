"use client";

import { useState, useRef } from "react";
import { Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCategories, useCreateCategory } from "@/hooks";

interface CategoryComboboxProps {
  value: string;          // selected category ID
  onChange: (id: string, name: string) => void;
  placeholder?: string;
}

export function CategoryCombobox({
  value,
  onChange,
  placeholder = "Select or create a category",
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();

  const cats = categories as Array<{ id: string; name: string }>;
  const selected = cats.find((c) => c.id === value);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createCategory.mutate(
      { name },
      {
        onSuccess: (res: any) => {
          const created = res?.data ?? res;
          if (created?.id) {
            onChange(created.id, created.name);
          }
          setNewName("");
          setShowCreate(false);
          setOpen(false);
        },
      }
    );
  };

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setShowCreate(false); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selected ? selected.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>
              <p className="py-2 text-center text-sm text-muted-foreground">
                No category found.
              </p>
            </CommandEmpty>

            <CommandGroup>
              {cats.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={cat.name}
                  onSelect={() => {
                    onChange(cat.id, cat.name);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 size-4", value === cat.id ? "opacity-100" : "opacity-0")} />
                  {cat.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Inline create */}
            <CommandGroup>
              {!showCreate ? (
                <CommandItem
                  onSelect={() => {
                    setShowCreate(true);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="gap-2 text-[#FF6B2C]"
                >
                  <Plus className="size-4" />
                  Create new category
                </CommandItem>
              ) : (
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Input
                    ref={inputRef}
                    placeholder="Category name…"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleCreate(); }
                      if (e.key === "Escape") { setShowCreate(false); setNewName(""); }
                    }}
                    className="h-7 flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    className="h-7 bg-[#FF6B2C] px-2 text-white hover:bg-[#FF6B2C]/90"
                    onClick={handleCreate}
                    disabled={!newName.trim() || createCategory.isPending}
                  >
                    {createCategory.isPending ? <Loader2 className="size-3 animate-spin" /> : "Add"}
                  </Button>
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
