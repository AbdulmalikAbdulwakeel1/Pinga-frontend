"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: number;
  accentColor?: string;
  className?: string;
}

export function StatsCard({
  icon,
  label,
  value,
  change,
  accentColor = "#FF6B2C",
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="flex items-start gap-4 pt-5 pb-5">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accentColor}12` }}
          >
            <div
              className="[&_svg]:size-5"
              style={{ color: accentColor }}
            >
              {icon}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <span className="text-2xl font-bold tracking-tight">{value}</span>

            {change !== undefined && (
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                    isPositive
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  {isPositive ? "+" : ""}
                  {change}%
                </span>
                <span className="text-[11px] text-muted-foreground">
                  vs last period
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
