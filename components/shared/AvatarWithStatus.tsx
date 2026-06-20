import { cn, getInitials } from "@/lib/utils";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

interface AvatarWithStatusProps {
  src?: string;
  name: string;
  status?: "online" | "offline" | "away";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const statusColors: Record<string, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
};

const dotSizes: Record<string, string> = {
  sm: "size-2",
  default: "size-2.5",
  lg: "size-3",
};

export function AvatarWithStatus({
  src,
  name,
  status,
  size = "default",
  className,
}: AvatarWithStatusProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <Avatar size={size}>
        {src && <AvatarImage src={src} alt={name} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>

      {status && (
        <span
          className={cn(
            "absolute right-0 bottom-0 z-10 rounded-full ring-2 ring-background",
            statusColors[status],
            dotSizes[size]
          )}
          aria-label={status}
        />
      )}
    </div>
  );
}
