"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageCircle } from "lucide-react";
import { Instagram, Facebook, Twitter, Linkedin, TikTok, Reddit } from "@/components/icons/brand-icons";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "./ConversationItem";
import type { ComponentType } from "react";

interface PlatformFilter {
  label: string;
  value: string;
  color: string;
  icon: ComponentType<{ className?: string }> | null;
}

const PLATFORM_FILTERS: PlatformFilter[] = [
  { label: "All",       value: "all",       color: "#1A2B3E", icon: null },
  { label: "Instagram", value: "instagram", color: "#E1306C", icon: Instagram },
  { label: "Facebook",  value: "facebook",  color: "#1877F2", icon: Facebook },
  { label: "WhatsApp",  value: "whatsapp",  color: "#25D366", icon: MessageCircle },
  { label: "Twitter",   value: "twitter",   color: "#000000", icon: Twitter },
  { label: "LinkedIn",  value: "linkedin",  color: "#0A66C2", icon: Linkedin },
  { label: "TikTok",    value: "tiktok",    color: "#010101", icon: TikTok },
  { label: "Reddit",    value: "reddit",    color: "#FF4500", icon: Reddit },
];

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}: ConversationListProps) {
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" || c.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="flex h-full flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4">
        <h2 className="mb-3 text-lg font-semibold text-[#1A2B3E] dark:text-foreground">
          Conversations
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>

        {/* Platform filters */}
        <div className="flex flex-wrap gap-1.5">
          {PLATFORM_FILTERS.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.value}
                title={filter.label}
                onClick={() => setPlatformFilter(filter.value)}
                className={cn(
                  "flex items-center justify-center rounded-full transition-colors",
                  Icon ? "size-7" : "px-3 py-1 text-[11px] font-semibold",
                  platformFilter === filter.value
                    ? "text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
                style={
                  platformFilter === filter.value
                    ? { backgroundColor: filter.color }
                    : undefined
                }
              >
                {Icon ? <Icon className="size-3.5" /> : filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="mb-2 size-8 opacity-40" />
              <span className="text-sm">No conversations found</span>
            </div>
          ) : (
            filtered.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onClick={() => onSelect(conversation.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer count */}
      <div className="shrink-0 border-t border-border px-4 py-2">
        <span className="text-xs text-muted-foreground">
          {filtered.length} conversation{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
