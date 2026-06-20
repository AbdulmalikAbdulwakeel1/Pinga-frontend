import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export function useAISettings() {
  return useQuery({
    queryKey: ["ai-agent", "settings"],
    queryFn: () => api.get("/ai-agent/settings").then((r: any) => r.data),
  });
}

export function useUpdateAISettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.put("/ai-agent/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent", "settings"] });
      toast.success("AI settings saved!");
    },
    onError: (error: any) => toast.error(error.message || "Failed to save settings"),
  });
}

export function useTemplates(category?: string) {
  return useQuery({
    queryKey: ["ai-agent", "templates", category],
    queryFn: () => api.get(`/ai-agent/templates${category ? `?category=${category}` : ""}`).then((r: any) => r.data),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/ai-agent/templates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent", "templates"] });
      toast.success("Template created!");
    },
  });
}

export function useTestAI() {
  return useMutation({
    mutationFn: (data: { message: string; platform: string }) =>
      api.post("/ai-agent/test", data),
  });
}

export function useTrainAI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { question: string; answer: string }) =>
      api.post("/ai-agent/train", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent", "settings"] });
      toast.success("Training data added!");
    },
  });
}
