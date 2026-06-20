"use client";

import { useState, useEffect } from "react";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TimeAgoProps {
  date: string | Date;
  className?: string;
  refreshInterval?: number;
}

export function TimeAgo({
  date,
  className,
  refreshInterval = 60000,
}: TimeAgoProps) {
  const [display, setDisplay] = useState(() => timeAgo(date));

  useEffect(() => {
    setDisplay(timeAgo(date));

    const interval = setInterval(() => {
      setDisplay(timeAgo(date));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [date, refreshInterval]);

  return (
    <time
      dateTime={new Date(date).toISOString()}
      title={new Date(date).toLocaleString()}
      className={cn("text-sm text-muted-foreground", className)}
    >
      {display}
    </time>
  );
}
