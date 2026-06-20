"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  MessageCircle,
  Clock,
  Send,
  MessageSquare,
  ShoppingCart,
  Tag,
  ChevronRight,
} from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn, formatCurrency, formatDate, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { LeadStage, LeadScore, Platform } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Inline mock data for one detailed lead
// ---------------------------------------------------------------------------
const STAGES: LeadStage[] = ["New", "Contacted", "Qualified", "Negotiating", "Won", "Lost"];

const MOCK_LEAD = {
  id: "lead-001",
  name: "Chioma Okafor",
  email: "chioma@gmail.com",
  phone: "+234 812 345 6789",
  platform: "instagram" as Platform,
  stage: "Qualified" as LeadStage,
  score: "hot" as LeadScore,
  value: 85000,
  source: "Instagram DM",
  lastInteraction: "2026-05-17T09:30:00Z",
  createdAt: "2026-05-15T08:00:00Z",
  notes: "Interested in bulk ankara fabric orders for a boutique. Has requested samples. Very responsive and engaged customer.",
};

const MOCK_ACTIVITY = [
  { id: "act-1", type: "message", description: "Sent product catalog via DM", actor: "AI Agent", timestamp: "2026-05-17T09:30:00Z" },
  { id: "act-2", type: "stage", description: "Stage moved from Contacted to Qualified", actor: "Tolu (Agent)", timestamp: "2026-05-16T14:00:00Z" },
  { id: "act-3", type: "note", description: "Added note: Interested in bulk ankara fabric orders", actor: "Tolu (Agent)", timestamp: "2026-05-16T11:30:00Z" },
  { id: "act-4", type: "message", description: "Replied to inquiry about pricing and MOQ", actor: "AI Agent", timestamp: "2026-05-15T16:00:00Z" },
  { id: "act-5", type: "call", description: "Follow-up call - discussed delivery options", actor: "Tolu (Agent)", timestamp: "2026-05-15T10:00:00Z" },
  { id: "act-6", type: "message", description: "Initial inquiry about ankara collection", actor: "Customer", timestamp: "2026-05-15T08:00:00Z" },
];

const scoreConfig: Record<LeadScore, { label: string; color: string }> = {
  hot: { label: "Hot", color: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800" },
  warm: { label: "Warm", color: "bg-orange-500/10 text-orange-700 border-orange-200 dark:text-orange-400 dark:border-orange-800" },
  cold: { label: "Cold", color: "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800" },
};

const stageColors: Record<LeadStage, string> = {
  New: "bg-blue-500",
  Contacted: "bg-yellow-500",
  Qualified: "bg-purple-500",
  Negotiating: "bg-[#FF6B2C]",
  Won: "bg-green-500",
  Lost: "bg-red-500",
};

const platformConfig: Record<Platform, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  instagram: { label: "Instagram", icon: Instagram, color: "text-pink-600" },
  facebook: { label: "Facebook", icon: Facebook, color: "text-blue-600" },
  whatsapp: { label: "WhatsApp", icon: MessageCircle, color: "text-green-600" },
};

const activityIcons: Record<string, typeof Send> = {
  message: Send,
  stage: Tag,
  note: MessageSquare,
  call: Phone,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LeadDetailPage() {
  const router = useRouter();
  const [lead, setLead] = useState(MOCK_LEAD);
  const [notes, setNotes] = useState(MOCK_LEAD.notes || "");

  const PlatformIcon = platformConfig[lead.platform].icon;
  const currentStageIndex = STAGES.indexOf(lead.stage);

  const moveStage = (direction: "prev" | "next") => {
    const idx = STAGES.indexOf(lead.stage);
    const newIdx = direction === "next" ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < STAGES.length) {
      setLead((prev) => ({ ...prev, stage: STAGES[newIdx] }));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => router.push(ROUTES.LEADS)}
        >
          <ArrowLeft className="size-4" />
          Back to Leads
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#FF6B2C]/10 text-[#FF6B2C] font-semibold text-sm">
            {lead.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1A2B3E] dark:text-foreground">
              {lead.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Lead since {formatDate(lead.createdAt)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("ml-2 font-medium", scoreConfig[lead.score].color)}
          >
            {scoreConfig[lead.score].label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Left Column ---- */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Contact Info Card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{lead.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Mail className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{lead.email || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Phone className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{lead.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <PlatformIcon className={cn("size-4", platformConfig[lead.platform].color)} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Platform</p>
                    <p className="text-sm font-medium">{platformConfig[lead.platform].label}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="notes" className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-3 block">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this lead..."
                className="min-h-[100px] resize-y"
              />
              <div className="mt-3 flex justify-end">
                <Button size="sm" className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white">
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Activity Timeline
              </h3>
              <div className="space-y-0">
                {MOCK_ACTIVITY.map((event, i) => {
                  const Icon = activityIcons[event.type] || Clock;
                  return (
                    <div key={event.id} className="flex gap-3">
                      {/* Line + dot */}
                      <div className="flex flex-col items-center">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Icon className="size-3.5 text-muted-foreground" />
                        </div>
                        {i < MOCK_ACTIVITY.length - 1 && (
                          <div className="w-px flex-1 bg-border" />
                        )}
                      </div>
                      {/* Content */}
                      <div className={cn("pb-6", i === MOCK_ACTIVITY.length - 1 && "pb-0")}>
                        <p className="text-sm font-medium">{event.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{event.actor}</span>
                          <span className="text-xs text-muted-foreground">&middot;</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(event.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---- Right Column ---- */}
        <div className="flex flex-col gap-6">
          {/* Stage Card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-4">
                Pipeline Stage
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={cn("size-3 rounded-full", stageColors[lead.stage])} />
                <span className="text-lg font-bold text-[#1A2B3E] dark:text-foreground">
                  {lead.stage}
                </span>
              </div>

              {/* Stage progress */}
              <div className="flex gap-1 mb-4">
                {STAGES.map((stage, idx) => (
                  <div
                    key={stage}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      idx <= currentStageIndex ? stageColors[lead.stage] : "bg-muted"
                    )}
                    title={stage}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={currentStageIndex === 0}
                  onClick={() => moveStage("prev")}
                >
                  <ArrowLeft className="size-3.5" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
                  disabled={currentStageIndex === STAGES.length - 1}
                  onClick={() => moveStage("next")}
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Value Display */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-2">
                Lead Value
              </h3>
              <p className="text-3xl font-bold text-[#FF6B2C]">
                {formatCurrency(lead.value)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Estimated deal value
              </p>
            </CardContent>
          </Card>

          {/* Convert to Order */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-[#1A2B3E] dark:text-foreground mb-3">
                Actions
              </h3>
              <Button
                className="w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
                onClick={() => router.push(ROUTES.ORDERS)}
              >
                <ShoppingCart className="size-4" />
                Convert to Order
              </Button>
              <Separator className="my-3" />
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Send className="size-4" />
                  Send Message
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="size-4" />
                  Log Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
