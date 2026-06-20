import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, joinConversation, getSocket } from "@/lib/socket";

/**
 * Connects to the Socket.io server for a given business, joins the business room,
 * and wires up global real-time events (new messages, conversation updates, notifications).
 * Call once at layout level after the user is authenticated.
 */
export function useBusinessSocket(businessId: string | undefined) {
  const queryClient = useQueryClient();
  const joined = useRef(false);

  useEffect(() => {
    if (!businessId || joined.current) return;
    joined.current = true;

    const socket = connectSocket(businessId);

    // New message in any conversation → refetch that conversation's messages + conversation list
    socket.on("message:new", ({ conversationId }: { conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // Conversation updated (AI toggle, status change, etc.)
    socket.on("conversation:updated", ({ conversationId }: { conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // AI handoff triggered
    socket.on("conversation:handoff", ({ conversationId }: { conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // New notification → refetch notification count + list
    socket.on("notification:new", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socket.off("message:new");
      socket.off("conversation:updated");
      socket.off("conversation:handoff");
      socket.off("notification:new");
      joined.current = false;
    };
  }, [businessId, queryClient]);
}

/**
 * Joins a specific conversation room so real-time messages are delivered
 * without relying on the business-level broadcast.
 */
export function useConversationSocket(conversationId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    joinConversation(conversationId);

    const socket = getSocket();

    const handler = ({ conversationId: id }: { conversationId: string }) => {
      if (id === conversationId) {
        queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      }
    };

    socket.on("message:new", handler);

    return () => {
      socket.off("message:new", handler);
    };
  }, [conversationId, queryClient]);
}
