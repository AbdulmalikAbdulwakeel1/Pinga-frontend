"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  Clock,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Insight {
  id: string;
  icon: typeof TrendingUp;
  title: string;
  message: string;
  type: "tip" | "trend" | "action";
}

const insights: Insight[] = [
  {
    id: "1",
    icon: TrendingUp,
    title: "Sales Momentum",
    message:
      "Your orders are up 23% this week. Thursday and Friday are your best days — consider scheduling broadcasts before then.",
    type: "trend",
  },
  {
    id: "2",
    icon: Lightbulb,
    title: "Quick Win",
    message:
      "3 leads haven't been contacted in 48hrs. A quick follow-up message could recover up to NGN 85,000 in potential orders.",
    type: "tip",
  },
  {
    id: "3",
    icon: Clock,
    title: "Peak Hours",
    message:
      "Most of your customers message between 6-9 PM. Make sure your AI agent is fully configured for those hours.",
    type: "action",
  },
  {
    id: "4",
    icon: Sparkles,
    title: "AI Performance",
    message:
      "Your AI handled 94% of conversations automatically today. Train it on 2 more FAQ topics to push that to 97%.",
    type: "trend",
  },
  {
    id: "5",
    icon: Lightbulb,
    title: "Product Tip",
    message:
      'Your "Ankara Maxi Set" gets the most inquiries but has low stock. Consider restocking to avoid missed sales.',
    type: "tip",
  },
];

const typeColors = {
  tip: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  trend: "bg-green-500/10 text-green-600 border-green-500/20",
  action: "bg-pinga-orange/10 text-pinga-orange border-pinga-orange/20",
};

const DISMISSED_KEY = "pinga-pulse-dismissed";

export function BusinessPulse() {
  const [dismissed, setDismissed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pick a different insight each day
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(DISMISSED_KEY);
    if (stored === today) {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
    // Rotate based on day of year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    setCurrentIndex(dayOfYear % insights.length);
  }, []);

  const insight = insights[currentIndex];

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, new Date().toDateString());
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.length);
  };

  if (dismissed || !insight) return null;

  const Icon = insight.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="mb-4"
      >
        <div
          className={cn(
            "relative flex items-start gap-3 rounded-xl border p-4",
            typeColors[insight.type]
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/80">
            <Icon className="size-4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Daily Insight
              </span>
              <span className="text-[10px] font-medium opacity-60">
                {insight.title}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {insight.message}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleNext}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
