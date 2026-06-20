import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useNotifications(filters?: { is_read?: boolean; category?: string }) {
  const params = new URLSearchParams();
  if (filters?.is_read !== undefined) params.set("is_read", String(filters.is_read));
  if (filters?.category) params.set("category", filters.category);

  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () => api.get(`/notifications?${params.toString()}`).then((r: any) => r.data),
    refetchInterval: 30 * 1000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => api.get("/notifications/unread-count").then((r: any) => r.data.count),
    refetchInterval: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch("/notifications/read-all", {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
