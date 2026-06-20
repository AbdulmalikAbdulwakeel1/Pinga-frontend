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
import { Badge } from "@/components/ui/badge";
import { Zap, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickReplyTemplate {
  id: string;
  name: string;
  content: string;
  category: "Greeting" | "Pricing" | "Order" | "Follow-up";
}

const TEMPLATES: QuickReplyTemplate[] = [
  {
    id: "t1",
    name: "Welcome",
    content:
      "Hi there! Welcome to our store. How can I help you today?",
    category: "Greeting",
  },
  {
    id: "t2",
    name: "Welcome (Pidgin)",
    content:
      "Hello! Welcome o. Wetin you dey look for? We fit help you.",
    category: "Greeting",
  },
  {
    id: "t3",
    name: "Thanks for reaching out",
    content:
      "Thank you for reaching out! I'd be happy to assist you. What product are you interested in?",
    category: "Greeting",
  },
  {
    id: "t4",
    name: "Price inquiry response",
    content:
      "Thank you for your interest! The price for [product] is [price]. Would you like to place an order?",
    category: "Pricing",
  },
  {
    id: "t5",
    name: "Bulk discount",
    content:
      "Yes, we offer discounts on bulk orders! For 5+ items, you get 10% off. For 10+ items, 15% off. Would you like to proceed?",
    category: "Pricing",
  },
  {
    id: "t6",
    name: "Negotiation response",
    content:
      "I understand you'd like a better price. The best I can offer is [price] for this item. This is already a great deal! Shall I proceed?",
    category: "Pricing",
  },
  {
    id: "t7",
    name: "Order confirmation",
    content:
      "Your order has been confirmed! Order #[number]. Total: [amount]. We'll process it within 24 hours. Thank you for shopping with us!",
    category: "Order",
  },
  {
    id: "t8",
    name: "Payment details",
    content:
      "Please make payment to:\nBank: GTBank\nAccount: 0123456789\nName: Pinga Store\n\nKindly send proof of payment after transfer. Thank you!",
    category: "Order",
  },
  {
    id: "t9",
    name: "Delivery info",
    content:
      "Delivery takes 2-3 business days within Lagos, and 4-7 days for other states. Delivery fee starts from NGN 1,500. Would you like to proceed?",
    category: "Order",
  },
  {
    id: "t10",
    name: "Follow-up check",
    content:
      "Hi! Just following up on our earlier conversation. Were you still interested in [product]? Let me know if you have any questions!",
    category: "Follow-up",
  },
  {
    id: "t11",
    name: "Restock notification",
    content:
      "Great news! The item you were interested in is back in stock. Would you like to place your order now?",
    category: "Follow-up",
  },
  {
    id: "t12",
    name: "Review request",
    content:
      "Hi! Hope you're enjoying your purchase. If you have a moment, we'd really appreciate a review. Thank you for your support!",
    category: "Follow-up",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Greeting: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Pricing:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Order:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Follow-up":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

interface QuickReplyPickerProps {
  onSelect: (content: string) => void;
}

export function QuickReplyPicker({ onSelect }: QuickReplyPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = ["Greeting", "Pricing", "Order", "Follow-up"];

  const filtered = TEMPLATES.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory
      ? t.category === activeCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (template: QuickReplyTemplate) => {
    onSelect(template.content);
    setOpen(false);
    setSearch("");
    setActiveCategory(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          title="Quick replies"
        >
          <Zap className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="border-b border-border p-3">
          <h4 className="mb-2 text-sm font-medium">Quick Replies</h4>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-sm"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={cn(
                  "rounded-full border border-transparent px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                  activeCategory === cat
                    ? CATEGORY_COLORS[cat]
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <ScrollArea className="max-h-64">
          <div className="p-1.5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Zap className="mb-2 size-8 opacity-40" />
                <span className="text-xs">No templates found</span>
              </div>
            ) : (
              filtered.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className="w-full rounded-md p-2.5 text-left transition-colors hover:bg-muted/60"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {template.name}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        CATEGORY_COLORS[template.category]
                      )}
                    >
                      {template.category}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {template.content}
                  </p>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
