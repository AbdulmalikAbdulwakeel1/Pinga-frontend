"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, getInitials, getPlatformColor, formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Phone,
  Mail,
  ExternalLink,
  User,
  ShoppingBag,
  Package,
  UserCircle,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import type { Conversation } from "./ConversationItem";

interface ConversationSidebarProps {
  conversation: Conversation | null;
}

const STAGE_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Interested:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Negotiating:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Ready to Buy":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Converted:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Lost: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  Delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  Processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Shipped:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
};

// Mock order data per conversation
const MOCK_ORDERS: Record<
  string,
  { id: string; product: string; amount: number; status: string; date: string }[]
> = {
  "conv-1": [
    {
      id: "ORD-1041",
      product: "Ankara Fabric - Royal Blue",
      amount: 13500,
      status: "Delivered",
      date: "May 10, 2026",
    },
    {
      id: "ORD-1023",
      product: "Lace Fabric - Gold",
      amount: 24000,
      status: "Processing",
      date: "May 14, 2026",
    },
  ],
  "conv-3": [
    {
      id: "ORD-1038",
      product: "iPhone 15 Pro Max Case",
      amount: 8500,
      status: "Delivered",
      date: "May 8, 2026",
    },
  ],
  "conv-5": [
    {
      id: "ORD-1045",
      product: "AirPods Pro 2nd Gen",
      amount: 125000,
      status: "Shipped",
      date: "May 15, 2026",
    },
    {
      id: "ORD-1032",
      product: "Samsung Galaxy Buds FE",
      amount: 45000,
      status: "Delivered",
      date: "May 5, 2026",
    },
  ],
  "conv-7": [
    {
      id: "ORD-1049",
      product: "Adire Shirt - Men",
      amount: 15000,
      status: "Pending",
      date: "May 16, 2026",
    },
  ],
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
};

export function ConversationSidebar({
  conversation,
}: ConversationSidebarProps) {
  const [contactOpen, setContactOpen] = useState(true);
  const [leadOpen, setLeadOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [agentOpen, setAgentOpen] = useState(true);

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Select a conversation to view details
        </p>
      </div>
    );
  }

  const platformColor = getPlatformColor(conversation.platform);
  const orders = MOCK_ORDERS[conversation.id] ?? [];

  return (
    <div className="flex h-full flex-col border-l border-border bg-background">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Details</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Contact Info */}
        <Collapsible open={contactOpen} onOpenChange={setContactOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40">
            <div className="flex items-center gap-2">
              <User className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contact Info
              </span>
            </div>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                contactOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <div className="flex flex-col items-center py-2">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-[#1A2B3E]/10 text-lg font-semibold text-[#1A2B3E]">
                    {getInitials(conversation.name)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="mt-2 text-sm font-semibold">
                  {conversation.name}
                </h4>
                <Badge
                  variant="secondary"
                  className="mt-1 h-4 px-1.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${platformColor}15`,
                    color: platformColor,
                  }}
                >
                  {PLATFORM_LABELS[conversation.platform]}
                </Badge>
              </div>

              <div className="mt-3 space-y-2">
                {conversation.phone && (
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="size-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {conversation.phone}
                    </span>
                  </div>
                )}
                {conversation.email && (
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="size-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {conversation.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Lead Info */}
        <Collapsible open={leadOpen} onOpenChange={setLeadOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40">
            <div className="flex items-center gap-2">
              <UserCircle className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Lead Info
              </span>
            </div>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                leadOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-3 px-4 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Stage</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    STAGE_COLORS[conversation.leadStage ?? "New"]
                  )}
                >
                  {conversation.leadStage ?? "New"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Lead Score
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[#FF6B2C]"
                      style={{
                        width: `${conversation.leadScore ?? 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold">
                    {conversation.leadScore ?? 0}
                  </span>
                </div>
              </div>
              <Link
                href={ROUTES.LEADS}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#FF6B2C] hover:underline"
              >
                View Lead Profile
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Order History */}
        <Collapsible open={ordersOpen} onOpenChange={setOrdersOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Order History
              </span>
            </div>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                ordersOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 px-4 pb-4">
              {orders.length === 0 ? (
                <p className="py-2 text-xs text-muted-foreground">
                  No orders yet
                </p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border border-border p-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">
                          {order.product}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {order.id} &middot; {order.date}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          ORDER_STATUS_COLORS[order.status] ??
                            "bg-muted text-muted-foreground"
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[#FF6B2C]">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Assigned Agent */}
        <Collapsible open={agentOpen} onOpenChange={setAgentOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40">
            <div className="flex items-center gap-2">
              <Package className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Assigned Agent
              </span>
            </div>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform",
                agentOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              {conversation.assignedAgent ? (
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-[#1A2B3E]/10 text-[10px] font-semibold text-[#1A2B3E]">
                      {getInitials(conversation.assignedAgent)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">
                      {conversation.assignedAgent}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Sales Agent
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1">
                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-border">
                    <User className="size-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Unassigned
                    </p>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-[10px] text-[#FF6B2C]"
                    >
                      Assign agent
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
