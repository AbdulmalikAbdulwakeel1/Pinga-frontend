import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export function useOrders(filters?: { status?: string; payment_status?: string; platform?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.payment_status) params.set("payment_status", filters.payment_status);
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.search) params.set("search", filters.search);

  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => api.get(`/orders?${params.toString()}`).then((r: any) => r.data),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => api.get(`/orders/${id}`).then((r: any) => r.data),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, description }: { id: string; status: string; description?: string }) =>
      api.patch(`/orders/${id}/status`, { status, description }),
    onSuccess: (_: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated!");
    },
    onError: (error: any) => toast.error(error.message || "Failed to update order"),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/orders", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created!");
    },
  });
}
