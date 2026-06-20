import type { AnalyticsData } from "@/lib/types";

function generateLast30Days() {
  const days = [];
  const now = new Date("2026-05-17");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

const days = generateLast30Days();

export const mockAnalyticsData: AnalyticsData = {
  revenueByDay: days.map((date) => ({
    date,
    revenue: Math.floor(50000 + Math.random() * 100000),
    orders: Math.floor(1 + Math.random() * 6),
  })),
  revenueByPlatform: [
    { platform: "instagram", revenue: 1_080_000, percentage: 45 },
    { platform: "whatsapp", revenue: 840_000, percentage: 35 },
    { platform: "facebook", revenue: 480_000, percentage: 20 },
  ],
  conversationsByDay: days.map((date) => {
    const total = Math.floor(20 + Math.random() * 25);
    const ai = Math.floor(total * (0.7 + Math.random() * 0.15));
    return { date, total, ai, human: total - ai };
  }),
  topProducts: [
    { id: "prod_009", name: "Gele & Aso Oke Set", revenue: 385_000, sales: 11 },
    { id: "prod_002", name: "Adire Agbada", revenue: 325_000, sales: 13 },
    { id: "prod_010", name: "Lace Fabric (5 yards)", revenue: 270_000, sales: 15 },
    { id: "prod_001", name: "Ankara Maxi Set", revenue: 240_000, sales: 16 },
    { id: "prod_007", name: "Jollof Rice Platter", revenue: 192_000, sales: 24 },
    { id: "prod_008", name: "Small Chops Tray", revenue: 168_000, sales: 14 },
    { id: "prod_005", name: "Shea Butter 500g", revenue: 126_000, sales: 28 },
    { id: "prod_019", name: "Power Bank 20000mAh", revenue: 114_000, sales: 12 },
    { id: "prod_004", name: "Samsung Charger (25W)", revenue: 95_000, sales: 19 },
    { id: "prod_003", name: "iPhone 15 Case", revenue: 84_000, sales: 24 },
  ],
  conversionFunnel: [
    { stage: "DMs Received", count: 847, rate: 100 },
    { stage: "Leads Captured", count: 340, rate: 40.1 },
    { stage: "Qualified Leads", count: 156, rate: 45.9 },
    { stage: "Orders Placed", count: 105, rate: 67.3 },
  ],
  platformBreakdown: [
    { platform: "instagram", conversations: 380, leads: 152, orders: 47 },
    { platform: "whatsapp", conversations: 296, leads: 119, orders: 37 },
    { platform: "facebook", conversations: 171, leads: 69, orders: 21 },
  ],
};

export const mockMoneySaved = {
  hoursPerWeek: 32,
  revenueFromAI: 1_800_000,
  monthlyValue: 180_000,
  conversationsHandled: 663,
  avgResponseTime: "12s",
  humanResponseTime: "4m 30s",
};
