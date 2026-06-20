"use client";

import { MessageCircle } from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/types";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
  className?: string;
}

const platformConfig: Record<
  Platform,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  instagram: {
    label: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    bg: "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-200 dark:border-pink-800",
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bg: "bg-blue-500/10 border-blue-200 dark:border-blue-800",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-600",
    bg: "bg-green-500/10 border-green-200 dark:border-green-800",
  },
};

export function PlatformBadge({
  platform,
  size = "md",
  className,
}: PlatformBadgeProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bg,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        className
      )}
    >
      <Icon
        className={cn(
          config.color,
          size === "sm" ? "size-3" : "size-4"
        )}
      />
      <span className={config.color}>{config.label}</span>
    </span>
  );
}
