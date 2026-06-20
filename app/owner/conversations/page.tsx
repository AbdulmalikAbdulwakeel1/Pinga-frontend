"use client";

import { useState, useCallback } from "react";
import { ConversationList } from "@/components/conversations/ConversationList";
import { ConversationThread } from "@/components/conversations/ConversationThread";
import { ConversationSidebar } from "@/components/conversations/ConversationSidebar";
import type { Conversation } from "@/components/conversations/ConversationItem";
import { cn } from "@/lib/utils";
import { useConversations, useSendMessage, useToggleAI } from "@/hooks";

// ---------------------------------------------------------------------------
// Main Conversations Page
// ---------------------------------------------------------------------------

export default function ConversationsPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  const { data: conversationsData, isLoading, isError } = useConversations({
    search: searchQuery || undefined,
  });
  const conversations: Conversation[] = (conversationsData as any)?.conversations ?? conversationsData ?? [];

  const sendMessage = useSendMessage();
  const toggleAI = useToggleAI();

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? null;

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedConversationId(id);
      setMobileView("thread");
    },
    []
  );

  const handleBack = useCallback(() => {
    setMobileView("list");
  }, []);

  const handleToggleAI = useCallback(
    (_enabled: boolean) => {
      if (!selectedConversationId) return;
      toggleAI.mutate(selectedConversationId);
    },
    [selectedConversationId, toggleAI]
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedConversationId) return;
      sendMessage.mutate({ conversationId: selectedConversationId, content });
    },
    [selectedConversationId, sendMessage]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading conversations...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive">
        Failed to load conversations. Please try again.
      </div>
    );
  }

  return (
    <div className="-mx-4 -my-6 md:-mx-6 lg:-mx-8">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left: Conversation List */}
        <div
          className={cn(
            "w-full shrink-0 md:w-80",
            mobileView === "thread" ? "hidden md:block" : "block"
          )}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={handleSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Center: Conversation Thread */}
        <div
          className={cn(
            "min-w-0 flex-1",
            mobileView === "list" ? "hidden md:block" : "block"
          )}
        >
          <ConversationThread
            conversation={selectedConversation}
            onToggleAI={handleToggleAI}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        </div>

        {/* Right: Sidebar */}
        <div className="hidden w-72 shrink-0 lg:block">
          <ConversationSidebar conversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
}
