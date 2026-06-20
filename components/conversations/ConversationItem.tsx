"use client";

import { cn, getInitials, getPlatformColor, timeAgo } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface Conversation {
  id: string;
  name: string;
  platform: "instagram" | "facebook" | "whatsapp";
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  leadStage?: string;
  leadScore?: number;
  assignedAgent?: string;
  aiEnabled?: boolean;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "customer" | "agent" | "ai";
  senderName?: string;
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const hasUnread = conversation.unread > 0;
  const platformColor = getPlatformColor(conversation.platform);

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
        isSelected
          ? "bg-[#FF6B2C]/10 border border-[#FF6B2C]/20"
          : "hover:bg-muted/60 border border-transparent",
        hasUnread && !isSelected && "bg-muted/30"
      )}
    >
      {/* Avatar */}
      <Avatar className="size-10 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-semibold",
            isSelected
              ? "bg-[#FF6B2C]/20 text-[#FF6B2C]"
              : "bg-[#1A2B3E]/10 text-[#1A2B3E]"
          )}
        >
          {getInitials(conversation.name)}
        </AvatarFallback>
      </Avatar>

      {/* Center: name + message */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block size-2 shrink-0 rounded-full"
            style={{ backgroundColor: platformColor }}
          />
          <span
            className={cn(
              "truncate text-sm",
              hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground"
            )}
          >
            {conversation.name}
          </span>
        </div>
        <p
          className={cn(
            "mt-0.5 truncate text-xs",
            hasUnread ? "font-medium text-foreground/80" : "text-muted-foreground"
          )}
        >
          {conversation.lastMessage}
        </p>
      </div>

      {/* Right: time + unread */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(conversation.lastMessageTime)}
        </span>
        {hasUnread && (
          <span className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
            {conversation.unread > 9 ? "9+" : conversation.unread}
          </span>
        )}
      </div>
    </button>
  );
}
