"use client";

import { useState } from "react";
import {
  X,
  Check,
  Link,
  Package,
  Bot,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: typeof Link;
  completed: boolean;
  href?: string;
}

interface OnboardingChecklistProps {
  items?: ChecklistItem[];
  onDismiss?: () => void;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

const defaultItems: ChecklistItem[] = [
  {
    id: "connect-platform",
    label: "Connect a platform",
    description: "Link your Instagram, Facebook, or WhatsApp account",
    icon: Link,
    completed: false,
    href: "/settings/platforms",
  },
  {
    id: "add-products",
    label: "Add your products",
    description: "Upload your product catalog to start selling",
    icon: Package,
    completed: false,
    href: "/products",
  },
  {
    id: "configure-ai",
    label: "Configure AI assistant",
    description: "Set up your AI personality and responses",
    icon: Bot,
    completed: false,
    href: "/settings/ai",
  },
  {
    id: "invite-team",
    label: "Invite team members",
    description: "Add agents to help manage conversations",
    icon: Users,
    completed: false,
    href: "/settings/team",
  },
];

export function OnboardingChecklist({
  items = defaultItems,
  onDismiss,
  onItemClick,
  className,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Getting Started</CardTitle>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleDismiss}
          >
            <X className="size-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="flex-1" />
          <span className="shrink-0 text-xs text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50",
                item.completed && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  item.completed
                    ? "bg-green-500/10 text-green-600"
                    : "bg-[#FF6B2C]/10 text-[#FF6B2C]"
                )}
              >
                {item.completed ? (
                  <Check className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={cn(
                    "text-sm font-medium",
                    item.completed && "line-through"
                  )}
                >
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
