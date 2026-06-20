import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: () => api.get("/analytics/dashboard").then((r: any) => r.data),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useRevenueAnalytics(days = 30) {
  return useQuery({
    queryKey: ["analytics", "revenue", days],
    queryFn: () => api.get(`/analytics/revenue?days=${days}`).then((r: any) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useConversationAnalytics() {
  return useQuery({
    queryKey: ["analytics", "conversations"],
    queryFn: () => api.get("/analytics/conversations").then((r: any) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductAnalytics() {
  return useQuery({
    queryKey: ["analytics", "products"],
    queryFn: () => api.get("/analytics/products").then((r: any) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}
