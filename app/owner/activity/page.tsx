"use client";

import { useState } from "react";
import {
  ShoppingCart,
  MessageSquare,
  Package,
  Users,
  Settings,
  Bot,
  Filter,
  Calendar,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  Edit,
  Trash2,
  Send,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn, getInitials, timeAgo } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActivityType =
  | "orders"
  | "conversations"
  | "products"
  | "leads"
  | "system";

interface Activity {
  id: string;
  type: ActivityType;
  actor: string;
  actorAvatar?: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  dotColor: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const now = Date.now();

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "orders",
    actor: "Amaka Obi",
    description: "Confirmed order ORD-006",
    timestamp: new Date(now - 5 * 60000).toISOString(),
    icon: CheckCircle2,
    dotColor: "bg-green-500",
  },
  {
    id: "2",
    type: "conversations",
    actor: "AI Agent",
    description: "Replied to Chioma on Instagram",
    timestamp: new Date(now - 12 * 60000).toISOString(),
    icon: Bot,
    dotColor: "bg-purple-500",
  },
  {
    id: "3",
    type: "products",
    actor: "Chidi Nwosu",
    description: "Added new product 'Ankara Bag'",
    timestamp: new Date(now - 25 * 60000).toISOString(),
    icon: PlusCircle,
    dotColor: "bg-blue-500",
  },
  {
    id: "4",
    type: "leads",
    actor: "System",
    description: "New lead from WhatsApp: Tunde Bakare",
    timestamp: new Date(now - 40 * 60000).toISOString(),
    icon: UserPlus,
    dotColor: "bg-[#FF6B2C]",
  },
  {
    id: "5",
    type: "orders",
    actor: "Funke Adeyemi",
    description: "Shipped order ORD-005 via GIG Logistics",
    timestamp: new Date(now - 1 * 3600000).toISOString(),
    icon: Send,
    dotColor: "bg-green-500",
  },
  {
    id: "6",
    type: "conversations",
    actor: "Amaka Obi",
    description: "Resolved conversation with Emeka Okonkwo",
    timestamp: new Date(now - 1.5 * 3600000).toISOString(),
    icon: CheckCircle2,
    dotColor: "bg-purple-500",
  },
  {
    id: "7",
    type: "products",
    actor: "Chidi Nwosu",
    description: "Updated price for 'Premium Ankara Dress'",
    timestamp: new Date(now - 2 * 3600000).toISOString(),
    icon: Edit,
    dotColor: "bg-blue-500",
  },
  {
    id: "8",
    type: "system",
    actor: "System",
    description: "Instagram integration reconnected successfully",
    timestamp: new Date(now - 3 * 3600000).toISOString(),
    icon: Instagram,
    dotColor: "bg-gray-500",
  },
  {
    id: "9",
    type: "conversations",
    actor: "AI Agent",
    description: "Handed off conversation with Fatima Bello to Funke",
    timestamp: new Date(now - 3.5 * 3600000).toISOString(),
    icon: AlertCircle,
    dotColor: "bg-purple-500",
  },
  {
    id: "10",
    type: "orders",
    actor: "System",
    description: "New order ORD-007 from Aisha Mohammed (NGN 52,000)",
    timestamp: new Date(now - 4 * 3600000).toISOString(),
    icon: ShoppingCart,
    dotColor: "bg-green-500",
  },
  {
    id: "11",
    type: "leads",
    actor: "System",
    description: "New lead from Facebook: Nneka Eze",
    timestamp: new Date(now - 5 * 3600000).toISOString(),
    icon: UserPlus,
    dotColor: "bg-[#FF6B2C]",
  },
  {
    id: "12",
    type: "products",
    actor: "Amaka Obi",
    description: "Deleted product 'Old Stock Fabric' from catalog",
    timestamp: new Date(now - 6 * 3600000).toISOString(),
    icon: Trash2,
    dotColor: "bg-blue-500",
  },
  {
    id: "13",
    type: "conversations",
    actor: "AI Agent",
    description: "Sent product catalog to Oluwaseun Bakare on WhatsApp",
    timestamp: new Date(now - 7 * 3600000).toISOString(),
    icon: Bot,
    dotColor: "bg-purple-500",
  },
  {
    id: "14",
    type: "system",
    actor: "System",
    description: "Billing: Monthly subscription renewed (NGN 15,000)",
    timestamp: new Date(now - 8 * 3600000).toISOString(),
    icon: Settings,
    dotColor: "bg-gray-500",
  },
  {
    id: "15",
    type: "leads",
    actor: "Funke Adeyemi",
    description: "Converted lead Kemi Owolabi to customer",
    timestamp: new Date(now - 10 * 3600000).toISOString(),
    icon: CheckCircle2,
    dotColor: "bg-[#FF6B2C]",
  },
];

// ---------------------------------------------------------------------------
// Filter Options
// ---------------------------------------------------------------------------

const filterOptions: { value: string; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: Filter },
  { value: "orders", label: "Orders", icon: ShoppingCart },
  { value: "conversations", label: "Conversations", icon: MessageSquare },
  { value: "products", label: "Products", icon: Package },
  { value: "leads", label: "Leads", icon: Users },
  { value: "system", label: "System", icon: Settings },
];

// ---------------------------------------------------------------------------
// Activity Item
// ---------------------------------------------------------------------------

function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = activity.icon;

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border last:hidden" />

      {/* Dot + Icon */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            activity.dotColor,
            "text-white"
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Avatar size="sm">
            <AvatarFallback className="text-[10px]">
              {activity.actor === "AI Agent"
                ? "AI"
                : activity.actor === "System"
                  ? "SY"
                  : getInitials(activity.actor)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{activity.actor}</span>
          <span className="text-sm text-muted-foreground">
            {activity.description}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {timeAgo(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredActivities = mockActivities.filter((activity) => {
    if (filter !== "all" && activity.type !== filter) return false;
    if (dateFilter) {
      const activityDate = new Date(activity.timestamp)
        .toISOString()
        .split("T")[0];
      if (activityDate !== dateFilter) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track all actions and events across your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              className="w-auto pl-9"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = filter === option.value;
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-1.5",
                isActive &&
                  "bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
              )}
              onClick={() => setFilter(option.value)}
            >
              <Icon className="size-3.5" />
              {option.label}
              {option.value !== "all" && (
                <span
                  className={cn(
                    "ml-0.5 text-[10px]",
                    isActive
                      ? "text-white/80"
                      : "text-muted-foreground"
                  )}
                >
                  (
                  {
                    mockActivities.filter(
                      (a) => a.type === option.value
                    ).length
                  }
                  )
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recent Activity
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredActivities.length} events)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Filter className="size-10 text-muted-foreground/40" />
              <p className="font-medium text-muted-foreground">
                No activities found
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="flex flex-col">
                {filteredActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
