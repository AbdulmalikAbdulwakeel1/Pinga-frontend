import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export function useConversations(filters?: { platform?: string; status?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.search) params.set("search", filters.search);

  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: () => api.get(`/conversations?${params.toString()}`).then((r: any) => r.data),
    staleTime: 30 * 1000, // 30s - conversations change frequently
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => api.get(`/conversations/${id}`).then((r: any) => r.data),
    enabled: !!id,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => api.get(`/conversations/${conversationId}/messages`).then((r: any) => r.data),
    enabled: !!conversationId,
    refetchInterval: 5000, // poll every 5s for new messages
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content, messageType = "text" }: { conversationId: string; content: string; messageType?: string }) =>
      api.post(`/conversations/${conversationId}/messages`, { content, messageType }),
    onSuccess: (_: any, { conversationId }: any) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to send message"),
  });
}

export function useToggleAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      api.patch(`/conversations/${conversationId}/ai-toggle`, {}),
    onSuccess: (_: any, conversationId: string) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.patch(`/conversations/${id}`, data),
    onSuccess: (_: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
