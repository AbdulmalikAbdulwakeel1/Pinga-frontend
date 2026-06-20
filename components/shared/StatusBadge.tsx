import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  online: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  paid: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  delivered: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  confirmed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  scheduled: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  resolved: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  archived: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  inactive: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  waiting: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  shipped: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  new: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  draft: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  failed: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  lost: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  hot: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  warm: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  cold: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

const defaultStyle =
  "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700";

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || defaultStyle;

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize font-medium",
        style,
        className
      )}
    >
      {status}
    </Badge>
  );
}
