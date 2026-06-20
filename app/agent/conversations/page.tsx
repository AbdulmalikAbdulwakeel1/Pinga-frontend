"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ConversationThread } from "@/components/conversations/ConversationThread";
import { ConversationSidebar } from "@/components/conversations/ConversationSidebar";
import type { Conversation, Message } from "@/components/conversations/ConversationItem";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useToggleAI,
  useConversationSocket,
} from "@/hooks";

export default function AgentConversationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: convData, isLoading: convLoading } = useConversations(
    searchQuery ? { search: searchQuery } : undefined
  );
  const rawConversations: any[] = convData?.conversations || [];

  const { data: messagesData } = useMessages(selectedId || "");
  const rawMessages: any[] = messagesData?.messages || [];

  // Join the selected conversation's socket room for real-time delivery
  useConversationSocket(selectedId ?? undefined);

  const sendMessage = useSendMessage();
  const toggleAI = useToggleAI();

  // Map API conversations → component Conversation shape
  const conversations: Conversation[] = rawConversations.map((c) => ({
    id: c.id,
    name: c.contact?.name || "Unknown",
    platform: c.platform as Conversation["platform"],
    lastMessage: c.lastMessage || "",
    lastMessageTime: c.lastMessageAt || c.updatedAt || c.createdAt,
    unread: c.unreadCount || 0,
    avatarUrl: c.contact?.avatarUrl,
    phone: c.contact?.phone,
    email: c.contact?.email,
    aiEnabled: c.isAiEnabled,
    assignedAgent: c.assignedTo?.name,
    messages: [],
  }));

  // Map API messages → component Message shape
  const mappedMessages: Message[] = rawMessages.map((m) => ({
    id: m.id,
    content: m.content,
    timestamp: m.timestamp || m.created_at,
    sender: (m.sender === "business" ? "agent" : m.sender) as Message["sender"],
    senderName: m.sender === "ai" ? "Pinga AI" : m.sender === "business" || m.sender === "agent" ? "Agent" : undefined,
  }));

  // Selected conversation merged with real messages
  const selectedRaw = rawConversations.find((c) => c.id === selectedId);
  const selectedConversation: Conversation | null = selectedRaw
    ? {
        id: selectedRaw.id,
        name: selectedRaw.contact?.name || "Unknown",
        platform: selectedRaw.platform as Conversation["platform"],
        lastMessage: selectedRaw.lastMessage || "",
        lastMessageTime: selectedRaw.lastMessageAt || selectedRaw.createdAt,
        unread: selectedRaw.unreadCount || 0,
        avatarUrl: selectedRaw.contact?.avatarUrl,
        phone: selectedRaw.contact?.phone,
        email: selectedRaw.contact?.email,
        aiEnabled: selectedRaw.isAiEnabled,
        assignedAgent: selectedRaw.assignedTo?.name,
        messages: mappedMessages,
      }
    : null;

  const handleToggleAI = useCallback(() => {
    if (!selectedId) return;
    toggleAI.mutate(selectedId);
  }, [selectedId, toggleAI]);

  const handleSendMessage = useCallback(
    (message: string) => {
      if (!selectedId) return;
      sendMessage.mutate({ conversationId: selectedId, content: message });
    },
    [selectedId, sendMessage]
  );

  return (
    <div className="-mx-4 -my-6 md:-mx-6 lg:-mx-8">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left: Conversation list */}
        <div
          className={cn(
            "w-full shrink-0 md:w-80 lg:w-96",
            selectedId && "hidden md:block"
          )}
        >
          {convLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-6 animate-spin rounded-full border-2 border-pinga-orange border-t-transparent" />
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </div>

        {/* Center: Thread */}
        <div className={cn("flex-1", !selectedId && "hidden md:block")}>
          <ConversationThread
            conversation={selectedConversation}
            onToggleAI={handleToggleAI}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedId(null)}
          />
        </div>

        {/* Right: Contact sidebar (desktop only) */}
        <div className="hidden w-72 shrink-0 lg:block xl:w-80">
          <ConversationSidebar conversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
}
