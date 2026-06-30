import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export type MonitorPlatform = "twitter" | "reddit" | "instagram" | "facebook" | "linkedin" | "tiktok";

export interface KeywordMonitor {
  id: string;
  platform: MonitorPlatform;
  name: string;
  keywords: string[];
  context?: string;
  ai_prompt?: string;
  is_active: boolean;
  last_polled_at?: string;
  created_at: string;
}

export interface KeywordMention {
  id: string;
  platform: MonitorPlatform;
  title?: string;
  content?: string;
  url?: string;
  author?: string;
  matched_keywords: string[];
  is_read: boolean;
  created_at: string;
  monitor_name: string;
  context?: string;
}

export interface MentionsMeta {
  total: number;
  page: number;
  limit: number;
}

// ─── Monitors ─────────────────────────────────────────────────

export function useKeywordMonitors() {
  return useQuery({
    queryKey: ["keyword-monitors"],
    queryFn: () => api.get("/monitoring/monitors").then((r: any) => (r.data ?? r) as KeywordMonitor[]),
    staleTime: 60 * 1000,
  });
}

export function useCreateMonitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      platform: MonitorPlatform;
      name: string;
      keywords: string[];
      context?: string;
      ai_prompt?: string;
    }) => api.post("/monitoring/monitors", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keyword-monitors"] });
      toast.success("Monitor created!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to create monitor"),
  });
}

export function useUpdateMonitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<KeywordMonitor> & { id: string }) =>
      api.put(`/monitoring/monitors/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keyword-monitors"] });
      toast.success("Monitor updated");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update monitor"),
  });
}

export function useDeleteMonitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/monitoring/monitors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keyword-monitors"] });
      toast.success("Monitor deleted");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete monitor"),
  });
}

export function useSyncMonitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/monitoring/monitors/${id}/sync`, {}),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["keyword-monitors"] });
      queryClient.invalidateQueries({ queryKey: ["keyword-mentions"] });
      const n = data?.data?.newMentions ?? 0;
      toast.success(n > 0 ? `Synced! Found ${n} new mention(s).` : "Synced — no new mentions.");
    },
    onError: (err: any) => toast.error(err.message || "Sync failed"),
  });
}

// ─── Mentions ─────────────────────────────────────────────────

export function useKeywordMentions(filters?: {
  platform?: string;
  monitor_id?: string;
  is_read?: boolean;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.monitor_id) params.set("monitor_id", filters.monitor_id);
  if (filters?.is_read !== undefined) params.set("is_read", String(filters.is_read));
  if (filters?.page) params.set("page", String(filters.page));

  return useQuery({
    queryKey: ["keyword-mentions", filters],
    queryFn: () =>
      api.get(`/monitoring/mentions?${params.toString()}`).then((r: any) => r as { data: KeywordMention[]; meta: MentionsMeta }),
    staleTime: 30 * 1000,
  });
}

export function useMarkMentionRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/monitoring/mentions/${id}/read`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["keyword-mentions"] }),
  });
}

export function useMarkAllMentionsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch("/monitoring/mentions/read-all", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["keyword-mentions"] });
      toast.success("All mentions marked as read");
    },
  });
}
