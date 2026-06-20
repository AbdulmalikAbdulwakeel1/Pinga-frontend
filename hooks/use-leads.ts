import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export function useLeads(filters?: { stage?: string; score?: string; platform?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.stage) params.set("stage", filters.stage);
  if (filters?.score) params.set("score", filters.score);
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.search) params.set("search", filters.search);

  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => api.get(`/leads?${params.toString()}`).then((r: any) => r.data),
  });
}

export function useLeadKanban() {
  return useQuery({
    queryKey: ["leads", "kanban"],
    queryFn: () => api.get("/leads/kanban").then((r: any) => r.data),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => api.get(`/leads/${id}`).then((r: any) => r.data),
    enabled: !!id,
  });
}

export function useUpdateLeadStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api.patch(`/leads/${id}/stage`, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error: any) => toast.error(error.message || "Failed to update stage"),
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/leads", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created!");
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.put(`/leads/${id}`, data),
    onSuccess: (_: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: ["leads", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated!");
    },
  });
}
