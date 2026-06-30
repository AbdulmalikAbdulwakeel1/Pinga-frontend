"use client";

import { useState } from "react";
import {
  Plus, RefreshCw, Check, CheckCheck, ExternalLink, Trash2, Loader2,
  Bell, Search, Info,
} from "lucide-react";
import {
  Twitter, Reddit, Instagram, Facebook, Linkedin, TikTok,
} from "@/components/icons/brand-icons";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useKeywordMonitors,
  useCreateMonitor,
  useDeleteMonitor,
  useSyncMonitor,
  useKeywordMentions,
  useMarkMentionRead,
  useMarkAllMentionsRead,
  type KeywordMonitor,
  type KeywordMention,
  type MonitorPlatform,
} from "@/hooks";

// ---------------------------------------------------------------------------
// Platform metadata
// ---------------------------------------------------------------------------
const PLATFORM_META: Record<
  MonitorPlatform,
  {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    badgeClass: string;
    contextLabel?: string;
    contextPlaceholder?: string;
    contextRequired?: boolean;
    note?: string;
  }
> = {
  twitter: {
    label: "Twitter / X",
    icon: Twitter,
    badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    note: "Searches all public tweets matching your keywords in real time.",
  },
  reddit: {
    label: "Reddit",
    icon: Reddit,
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    contextLabel: "Subreddit",
    contextPlaceholder: "e.g. lagos  (no r/)",
    contextRequired: true,
    note: "Watches new posts in the specified subreddit for keyword matches.",
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
    badgeClass: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    note: "Searches public posts via Instagram hashtag API. Each keyword is treated as a hashtag (#keyword). Requires your Instagram Business account to be connected.",
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    note: "Scans posts on your connected Facebook Page for keyword mentions. Facebook's API does not allow searching all public posts.",
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    note: "Monitors comments on your LinkedIn company page posts for keyword mentions.",
  },
  tiktok: {
    label: "TikTok",
    icon: TikTok,
    badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
    note: "Searches public TikTok videos via the Research API. Requires TikTok Research API approval — contact TikTok Developers if not yet enabled.",
  },
};

// ---------------------------------------------------------------------------
// Keyword tag input
// ---------------------------------------------------------------------------
function KeywordInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput("");
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input placeholder="e.g. barbing" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} className="flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={add} disabled={!input.trim()}>Add</Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(kw => (
            <Badge key={kw} variant="secondary" className="gap-1 cursor-pointer" onClick={() => onChange(value.filter(k => k !== kw))}>
              {kw} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create monitor dialog
// ---------------------------------------------------------------------------
function MonitorDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [platform, setPlatform] = useState<MonitorPlatform>("twitter");
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const create = useCreateMonitor();

  const meta = PLATFORM_META[platform];
  const contextRequired = meta.contextRequired ?? false;
  const canSubmit = name.trim() && keywords.length > 0 && (!contextRequired || context.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;
    create.mutate(
      { platform, name: name.trim(), keywords, context: context.trim() || undefined, ai_prompt: aiPrompt.trim() || undefined },
      {
        onSuccess: () => {
          onClose();
          setName(""); setKeywords([]); setContext(""); setAiPrompt(""); setPlatform("twitter");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!create.isPending && !o) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Keyword Monitor</DialogTitle>
          <DialogDescription>
            Get notified whenever someone mentions your keywords on the selected platform.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Platform */}
          <div className="flex flex-col gap-1.5">
            <Label>Platform</Label>
            <Select value={platform} onValueChange={v => { setPlatform(v as MonitorPlatform); setContext(""); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.entries(PLATFORM_META) as [MonitorPlatform, typeof PLATFORM_META[MonitorPlatform]][]).map(([key, m]) => {
                  const Icon = m.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <Icon className="size-4" /> {m.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {meta.note && (
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="size-3 mt-0.5 shrink-0" /> {meta.note}
              </p>
            )}
          </div>

          {/* Context field (subreddit / optional hashtag context) */}
          {meta.contextLabel && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ctx">
                {meta.contextLabel}
                {contextRequired ? <span className="text-destructive"> *</span> : <span className="text-muted-foreground text-xs"> (optional)</span>}
              </Label>
              <Input id="ctx" placeholder={meta.contextPlaceholder} value={context} onChange={e => setContext(e.target.value)} />
            </div>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mon-name">Monitor name <span className="text-destructive">*</span></Label>
            <Input id="mon-name" placeholder="e.g. Barbershop leads" value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Keywords */}
          <div className="flex flex-col gap-1.5">
            <Label>Keywords <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground">Press Enter or click Add after each keyword.</p>
            <KeywordInput value={keywords} onChange={setKeywords} />
          </div>

          {/* AI prompt */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ai-prompt">AI filter prompt <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea id="ai-prompt" rows={3}
              placeholder="Describe what a relevant post looks like. e.g. 'Return true only if someone is looking for a barber or asking about hair cutting services.'"
              value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={create.isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || create.isPending}
            className="bg-[#FF6B2C] hover:bg-[#e55a1c] text-white">
            {create.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Create monitor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Monitor card
// ---------------------------------------------------------------------------
function MonitorCard({ monitor }: { monitor: KeywordMonitor }) {
  const meta = PLATFORM_META[monitor.platform];
  const Icon = meta.icon;
  const del = useDeleteMonitor();
  const sync = useSyncMonitor();

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">{monitor.name}</CardTitle>
          </div>
          <Badge variant="outline" className={cn("text-xs shrink-0", meta.badgeClass)}>{meta.label}</Badge>
        </div>
        {monitor.context && (
          <p className="text-xs text-muted-foreground ml-6">
            {monitor.platform === "reddit" ? `r/${monitor.context}` : `#${monitor.context}`}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        <div className="flex flex-wrap gap-1">
          {monitor.keywords.map(kw => <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>)}
        </div>
        {monitor.last_polled_at && (
          <p className="text-xs text-muted-foreground">Last synced {new Date(monitor.last_polled_at).toLocaleString()}</p>
        )}
        <Separator />
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-1.5"
            onClick={() => sync.mutate(monitor.id)} disabled={sync.isPending && (sync.variables as string) === monitor.id}>
            {sync.isPending && (sync.variables as string) === monitor.id
              ? <Loader2 className="size-3 animate-spin" />
              : <RefreshCw className="size-3" />}
            Sync now
          </Button>
          <Button variant="ghost" size="icon-sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => del.mutate(monitor.id)} disabled={del.isPending}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Mention row
// ---------------------------------------------------------------------------
function MentionRow({ mention }: { mention: KeywordMention }) {
  const meta = PLATFORM_META[mention.platform];
  const Icon = meta.icon;
  const markRead = useMarkMentionRead();

  return (
    <div className={cn("flex gap-3 rounded-lg border p-4 transition-colors", !mention.is_read && "border-[#FF6B2C]/30 bg-[#FF6B2C]/3")}>
      {!mention.is_read && <div className="mt-2 size-2 shrink-0 rounded-full bg-[#FF6B2C]" />}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{mention.monitor_name}</span>
          {mention.context && mention.platform === "reddit" && (
            <span className="text-xs text-muted-foreground">r/{mention.context}</span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            {new Date(mention.created_at).toLocaleDateString()}
          </span>
        </div>
        {mention.title && <p className="text-sm font-medium leading-snug">{mention.title}</p>}
        {mention.content && <p className="text-sm text-muted-foreground line-clamp-2">{mention.content}</p>}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {mention.matched_keywords.map(kw => (
            <Badge key={kw} variant="secondary" className="text-[10px] px-1.5">{kw}</Badge>
          ))}
          {mention.author && <span className="text-xs text-muted-foreground">by {mention.author}</span>}
        </div>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        {mention.url && (
          <a href={mention.url} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="icon-sm"><ExternalLink className="size-3.5" /></Button>
          </a>
        )}
        {!mention.is_read && (
          <Button variant="ghost" size="icon-sm" onClick={() => markRead.mutate(mention.id)}>
            <Check className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MentionsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { data: monitors = [], isLoading: monitorsLoading } = useKeywordMonitors();
  const { data: mentionsData, isLoading: mentionsLoading } = useKeywordMentions({
    platform: filterPlatform || undefined,
    is_read: showUnreadOnly ? false : undefined,
    page,
  });
  const markAllRead = useMarkAllMentionsRead();

  const mentions: KeywordMention[] = mentionsData?.data ?? [];
  const meta = mentionsData?.meta;
  const unreadCount = mentions.filter(m => !m.is_read).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Mention Monitors"
        description="Track keywords across Twitter, Reddit, Instagram, Facebook, LinkedIn, and TikTok. Get notified when your keywords are mentioned."
      />

      {/* Monitors */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Monitors</h2>
          <Button size="sm" className="bg-[#FF6B2C] hover:bg-[#e55a1c] text-white gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> New Monitor
          </Button>
        </div>

        {monitorsLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4 text-sm">
            <Loader2 className="size-4 animate-spin" /> Loading monitors…
          </div>
        ) : monitors.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Search className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">No monitors yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create a monitor to start tracking keywords on any connected platform.
                </p>
              </div>
              <Button size="sm" className="bg-[#FF6B2C] hover:bg-[#e55a1c] text-white" onClick={() => setCreateOpen(true)}>
                <Plus className="size-4 mr-1" /> Create your first monitor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {monitors.map(m => <MonitorCard key={m.id} monitor={m} />)}
          </div>
        )}
      </div>

      <Separator />

      {/* Mentions feed */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mentions Feed</h2>
            {unreadCount > 0 && <Badge className="bg-[#FF6B2C] text-white text-xs">{unreadCount} new</Badge>}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={filterPlatform || "all"} onValueChange={v => { setFilterPlatform(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All platforms" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                {(Object.entries(PLATFORM_META) as [MonitorPlatform, typeof PLATFORM_META[MonitorPlatform]][]).map(([key, m]) => (
                  <SelectItem key={key} value={key}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showUnreadOnly ? "default" : "outline"} size="sm"
              className={cn("h-8 text-xs", showUnreadOnly && "bg-[#FF6B2C] hover:bg-[#e55a1c] text-white")}
              onClick={() => { setShowUnreadOnly(v => !v); setPage(1); }}>
              <Bell className="size-3 mr-1" /> Unread only
            </Button>

            {unreadCount > 0 && (
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"
                onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending}>
                <CheckCheck className="size-3" /> Mark all read
              </Button>
            )}
          </div>
        </div>

        {mentionsLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-8 text-sm">
            <Loader2 className="size-4 animate-spin" /> Loading mentions…
          </div>
        ) : mentions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Bell className="size-8 opacity-30" />
            <p className="text-sm">No mentions yet</p>
            <p className="text-xs">
              {monitors.length === 0
                ? "Create a monitor above to start tracking keywords."
                : "Mentions appear here when your keywords are detected. Click 'Sync now' on a monitor to check immediately."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mentions.map(m => <MentionRow key={m.id} mention={m} />)}
            {meta && meta.total > meta.limit && (
              <div className="flex justify-center gap-2 pt-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="text-sm text-muted-foreground self-center">Page {page} of {Math.ceil(meta.total / meta.limit)}</span>
                <Button variant="outline" size="sm" disabled={page >= Math.ceil(meta.total / meta.limit)} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </div>
        )}
      </div>

      <MonitorDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
