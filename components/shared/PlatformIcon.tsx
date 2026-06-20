import { MessageCircle } from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/types";

interface PlatformIconProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const platformColors: Record<Platform, string> = {
  instagram: "text-pink-600",
  facebook: "text-blue-600",
  whatsapp: "text-green-600",
};

const platformIcons: Record<Platform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
};

const sizeClasses: Record<string, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function PlatformIcon({
  platform,
  size = "md",
  className,
}: PlatformIconProps) {
  const Icon = platformIcons[platform];
  const color = platformColors[platform];

  return (
    <Icon className={cn(color, sizeClasses[size], className)} />
  );
}
