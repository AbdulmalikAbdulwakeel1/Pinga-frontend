import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export interface PlatformIntegration {
  platform: "instagram" | "facebook" | "whatsapp";
  connected: boolean;
  accountName?: string;
  accountId?: string;
  phoneNumberId?: string;
  wabaId?: string;
  webhookVerified?: boolean;
  connectedAt?: string;
}

export function useIntegrations() {
  return useQuery({
    queryKey: ["integrations"],
    queryFn: () =>
      api.get("/integrations").then((r: any) => {
        const list: PlatformIntegration[] = r.data ?? r ?? [];
        return list;
      }),
    staleTime: 60 * 1000,
  });
}

export function useDisconnectPlatform() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (platform: string) => api.delete(`/integrations/${platform}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Platform disconnected");
    },
    onError: (err: any) => toast.error(err.message || "Failed to disconnect"),
  });
}

export function useConnectInstagram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { code: string; redirectUri: string }) =>
      api.post("/integrations/instagram/connect", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Instagram connected!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to connect Instagram"),
  });
}

export function useConnectFacebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { code: string; redirectUri: string }) =>
      api.post("/integrations/facebook/connect", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Facebook connected!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to connect Facebook"),
  });
}

export function useConnectWhatsApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { phoneNumberId: string; wabaId: string; accessToken: string }) =>
      api.post("/integrations/whatsapp/connect", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("WhatsApp connected successfully!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to connect WhatsApp"),
  });
}
