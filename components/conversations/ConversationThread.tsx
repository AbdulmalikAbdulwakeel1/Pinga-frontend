"use client";

import { useRef, useEffect } from "react";
import { cn, getPlatformColor, getInitials, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  MessageSquare,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import { AITakeoverToggle } from "./AITakeoverToggle";
import { MessageInput } from "./MessageInput";
import type { Conversation, Message } from "./ConversationItem";

interface ConversationThreadProps {
  conversation: Conversation | null;
  onToggleAI: (enabled: boolean) => void;
  onSendMessage: (message: string) => void;
  onBack?: () => void;
}

function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDateLabel(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(timestamp);
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = "";

  for (const msg of messages) {
    const dateLabel = getDateLabel(msg.timestamp);
    if (dateLabel !== currentDate) {
      currentDate = dateLabel;
      groups.push({ date: dateLabel, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }

  return groups;
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
};

export function ConversationThread({
  conversation,
  onToggleAI,
  onSendMessage,
  onBack,
}: ConversationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  // Empty state
  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-muted/20">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="size-7 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Select a conversation
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a conversation from the list to start messaging
        </p>
      </div>
    );
  }

  const platformColor = getPlatformColor(conversation.platform);
  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Mobile back button */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}

          <Avatar className="size-9">
            <AvatarFallback className="bg-[#1A2B3E]/10 text-xs font-semibold text-[#1A2B3E]">
              {getInitials(conversation.name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{conversation.name}</span>
              <Badge
                variant="secondary"
                className="h-4 px-1.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: `${platformColor}15`,
                  color: platformColor,
                }}
              >
                {PLATFORM_LABELS[conversation.platform]}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {conversation.platform === "whatsapp" && conversation.phone
                ? conversation.phone
                : `via ${PLATFORM_LABELS[conversation.platform]}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AITakeoverToggle
            enabled={conversation.aiEnabled ?? false}
            onToggle={onToggleAI}
            compact
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
          >
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages area — only this section scrolls */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 px-4 py-4">
          {messageGroups.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="shrink-0 rounded-full bg-muted px-3 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {group.date}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Messages in this group */}
              <div className="space-y-3">
                {group.messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    customerName={conversation.name}
                  />
                ))}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message Bubble
// ---------------------------------------------------------------------------

function MessageBubble({
  message,
  customerName,
}: {
  message: Message;
  customerName: string;
}) {
  const isCustomer = message.sender === "customer";
  const isAI = message.sender === "ai";
  const isAgent = message.sender === "agent";

  return (
    <div
      className={cn("flex", isCustomer ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[75%] space-y-1",
          isCustomer ? "items-start" : "items-end"
        )}
      >
        {/* Sender label */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-1",
            isCustomer ? "justify-start" : "justify-end"
          )}
        >
          {isAI && <Bot className="size-3 text-blue-500" />}
          <span className="text-[10px] font-medium text-muted-foreground">
            {isCustomer
              ? customerName
              : isAI
                ? "Pinga AI"
                : message.senderName || "You"}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
            isCustomer &&
              "rounded-bl-sm bg-muted text-foreground",
            isAgent &&
              "rounded-br-sm bg-[#FF6B2C] text-white",
            isAI &&
              "rounded-br-sm bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100"
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Time */}
        <p
          className={cn(
            "px-1 text-[10px] text-muted-foreground",
            isCustomer ? "text-left" : "text-right"
          )}
        >
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
