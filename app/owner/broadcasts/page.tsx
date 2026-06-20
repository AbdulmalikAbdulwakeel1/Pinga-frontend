"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  MessageCircle,
  Send,
  Clock,
  Users,
  FileText,
  Calendar,
  Hash,
} from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn, formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BroadcastStatus = "Draft" | "Scheduled" | "Sent";

interface Broadcast {
  id: string;
  title: string;
  message: string;
  platforms: string[];
  sentCount: number;
  status: BroadcastStatus;
  date: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockBroadcasts: Broadcast[] = [
  {
    id: "1",
    title: "Weekend Flash Sale",
    message:
      "Hi {customer_name}! Get 30% off all ankara pieces this weekend only. Shop now!",
    platforms: ["instagram", "whatsapp"],
    sentCount: 1250,
    status: "Sent",
    date: "2026-05-15",
  },
  {
    id: "2",
    title: "New Collection Launch",
    message:
      "Hey {customer_name}, our new Summer 2026 collection just dropped! Be the first to shop the latest styles.",
    platforms: ["instagram", "facebook", "whatsapp"],
    sentCount: 2100,
    status: "Sent",
    date: "2026-05-10",
  },
  {
    id: "3",
    title: "Loyalty Discount",
    message:
      "Dear {customer_name}, as a valued customer, enjoy an exclusive 15% discount on your next order. Use code LOYAL15.",
    platforms: ["whatsapp"],
    sentCount: 450,
    status: "Sent",
    date: "2026-05-05",
  },
  {
    id: "4",
    title: "Eid Mubarak Promo",
    message:
      "Eid Mubarak, {customer_name}! Celebrate with 20% off all items. Offer valid till Friday.",
    platforms: ["instagram", "facebook", "whatsapp"],
    sentCount: 0,
    status: "Scheduled",
    date: "2026-05-20",
  },
  {
    id: "5",
    title: "Customer Feedback Request",
    message:
      "Hi {customer_name}, we'd love to hear your feedback! Rate your recent purchase and get a special surprise.",
    platforms: ["whatsapp"],
    sentCount: 0,
    status: "Draft",
    date: "2026-05-17",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusBadge(status: BroadcastStatus) {
  switch (status) {
    case "Sent":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-green-200 bg-green-500/10 text-green-700 dark:border-green-800 dark:text-green-400"
        >
          <Send className="size-3" />
          Sent
        </Badge>
      );
    case "Scheduled":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-800 dark:text-blue-400"
        >
          <Clock className="size-3" />
          Scheduled
        </Badge>
      );
    case "Draft":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-gray-200 bg-gray-500/10 text-gray-600 dark:border-gray-700 dark:text-gray-400"
        >
          <FileText className="size-3" />
          Draft
        </Badge>
      );
  }
}

function PlatformBadge({ platform }: { platform: string }) {
  const config: Record<
    string,
    { icon: React.ElementType; bg: string; color: string; label: string }
  > = {
    instagram: {
      icon: Instagram,
      bg: "bg-pink-500/10",
      color: "text-pink-600",
      label: "IG",
    },
    facebook: {
      icon: Facebook,
      bg: "bg-blue-500/10",
      color: "text-blue-600",
      label: "FB",
    },
    whatsapp: {
      icon: MessageCircle,
      bg: "bg-green-500/10",
      color: "text-green-600",
      label: "WA",
    },
  };

  const c = config[platform];
  if (!c) return null;
  const Icon = c.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        c.bg,
        c.color
      )}
    >
      <Icon className="size-3" />
      {c.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Broadcast Card
// ---------------------------------------------------------------------------

function BroadcastCard({ broadcast }: { broadcast: Broadcast }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold">{broadcast.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {broadcast.message}
            </p>
          </div>
          {getStatusBadge(broadcast.status)}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Platforms */}
          <div className="flex items-center gap-1">
            {broadcast.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>

          {/* Sent Count */}
          {broadcast.status === "Sent" && broadcast.sentCount > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="size-3.5" />
              <span className="text-xs">
                {broadcast.sentCount.toLocaleString()} sent
              </span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="size-3.5" />
            <span className="text-xs">{formatDate(broadcast.date)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BroadcastsPage() {
  const [broadcasts] = useState<Broadcast[]>(mockBroadcasts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const insertMergeTag = () => {
    setMessage((prev) => prev + "{customer_name}");
  };

  const handleReset = () => {
    setTitle("");
    setMessage("");
    setSelectedPlatforms([]);
    setDialogOpen(false);
  };

  const sentCount = broadcasts.filter((b) => b.status === "Sent").length;
  const scheduledCount = broadcasts.filter(
    (b) => b.status === "Scheduled"
  ).length;
  const draftCount = broadcasts.filter((b) => b.status === "Draft").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Broadcasts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send messages to your customers across platforms.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90">
              <Plus className="size-4" />
              New Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Broadcast</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="broadcast-title">Title</Label>
                <Input
                  id="broadcast-title"
                  placeholder="e.g. Weekend Sale Announcement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="broadcast-message">Message</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={insertMergeTag}
                  >
                    <Hash className="size-3" />
                    {"{customer_name}"}
                  </Button>
                </div>
                <Textarea
                  id="broadcast-message"
                  placeholder="Type your broadcast message here..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Audience Platforms */}
              <div className="flex flex-col gap-2">
                <Label>Audience Platforms</Label>
                <div className="flex flex-wrap gap-4">
                  {[
                    {
                      id: "instagram",
                      label: "Instagram",
                      icon: Instagram,
                    },
                    {
                      id: "facebook",
                      label: "Facebook",
                      icon: Facebook,
                    },
                    {
                      id: "whatsapp",
                      label: "WhatsApp",
                      icon: MessageCircle,
                    },
                  ].map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <label
                        key={platform.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Checkbox
                          checked={selectedPlatforms.includes(platform.id)}
                          onCheckedChange={() => togglePlatform(platform.id)}
                        />
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="text-sm">{platform.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <Clock className="size-4" />
                Schedule
              </Button>
              <Button
                className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
                onClick={handleReset}
              >
                <Send className="size-4" />
                Send Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-green-500/10">
              <Send className="size-4 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{sentCount}</p>
              <p className="text-xs text-muted-foreground">Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="size-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{scheduledCount}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gray-500/10">
              <FileText className="size-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{draftCount}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broadcast List */}
      <div className="flex flex-col gap-4">
        {broadcasts.map((broadcast) => (
          <BroadcastCard key={broadcast.id} broadcast={broadcast} />
        ))}
      </div>
    </div>
  );
}
