import type { DashboardStats, Conversation, Platform } from "@/lib/types";

export const mockDashboardStats: DashboardStats = {
  revenue: { value: 2_400_000, change: 12.5, period: "vs last month" },
  conversations: { value: 34, change: 8.2, period: "vs last week" },
  leads: { value: 18, change: 15.3, period: "vs last week" },
  orders: { value: 12, change: 5.7, period: "vs last week" },
  aiResponseRate: { value: 94, change: 2.1, period: "vs last month" },
};

function generateRevenueChart() {
  const data: { date: string; revenue: number; orders: number }[] = [];
  const baseDate = new Date("2026-05-16T00:00:00Z");

  const dailyRevenues = [
    78500, 92300, 65400, 110200, 88700, 134500, 71200,
    95800, 142300, 56700, 103400, 119800, 87600, 68900,
    127500, 145200, 82300, 93600, 108400, 76500,
    131200, 99800, 54300, 112700, 138400, 85600,
    97200, 121500, 143800, 105600,
  ];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const revenue = dailyRevenues[29 - i];
    data.push({
      date: date.toISOString().split("T")[0],
      revenue,
      orders: Math.floor(revenue / 18000) + Math.floor(Math.random() * 3),
    });
  }

  return data;
}

export const mockRevenueChart = generateRevenueChart();

export const mockRecentConversations: {
  id: string;
  contactName: string;
  contactAvatar?: string;
  platform: Platform;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}[] = [
  {
    id: "conv_001",
    contactName: "Blessing Eze",
    contactAvatar: "/images/avatars/blessing.jpg",
    platform: "instagram",
    lastMessage: "Bros, how much for the Ankara?",
    lastMessageAt: "2026-05-16T09:15:00Z",
    unreadCount: 2,
  },
  {
    id: "conv_002",
    contactName: "Tunde Bakare",
    contactAvatar: "/images/avatars/tunde.jpg",
    platform: "whatsapp",
    lastMessage: "I don pay o, check your account",
    lastMessageAt: "2026-05-16T08:42:00Z",
    unreadCount: 1,
  },
  {
    id: "conv_003",
    contactName: "Chioma Adekunle",
    contactAvatar: "/images/avatars/chioma.jpg",
    platform: "facebook",
    lastMessage: "When will my order arrive?",
    lastMessageAt: "2026-05-16T07:30:00Z",
    unreadCount: 0,
  },
  {
    id: "conv_004",
    contactName: "Emeka Okafor",
    contactAvatar: "/images/avatars/emeka.jpg",
    platform: "instagram",
    lastMessage: "Sis, I wan order 2 of the shea butter",
    lastMessageAt: "2026-05-15T22:10:00Z",
    unreadCount: 3,
  },
  {
    id: "conv_005",
    contactName: "Aisha Mohammed",
    contactAvatar: "/images/avatars/aisha.jpg",
    platform: "whatsapp",
    lastMessage: "Thank you! The lace fabric is beautiful",
    lastMessageAt: "2026-05-15T18:45:00Z",
    unreadCount: 0,
  },
];

export const mockPlatformStatus: {
  platform: Platform;
  connected: boolean;
  followers?: number;
  lastSync?: string;
}[] = [
  {
    platform: "instagram",
    connected: true,
    followers: 12_400,
    lastSync: "2026-05-16T09:00:00Z",
  },
  {
    platform: "whatsapp",
    connected: true,
    followers: 3_200,
    lastSync: "2026-05-16T09:00:00Z",
  },
  {
    platform: "facebook",
    connected: false,
  },
];

export const mockTopProducts: {
  id: string;
  name: string;
  revenue: number;
  sales: number;
  image: string;
}[] = [
  {
    id: "prod_001",
    name: "Ankara Maxi Set",
    revenue: 450_000,
    sales: 30,
    image: "/images/products/ankara-set.jpg",
  },
  {
    id: "prod_010",
    name: "Lace Fabric (5 yards)",
    revenue: 378_000,
    sales: 21,
    image: "/images/products/lace-fabric.jpg",
  },
  {
    id: "prod_005",
    name: "Shea Butter 500g",
    revenue: 202_500,
    sales: 45,
    image: "/images/products/shea-butter.jpg",
  },
  {
    id: "prod_009",
    name: "Gele & Aso Oke Set",
    revenue: 315_000,
    sales: 9,
    image: "/images/products/gele-aso-oke.jpg",
  },
  {
    id: "prod_008",
    name: "Small Chops Tray",
    revenue: 168_000,
    sales: 14,
    image: "/images/products/small-chops.jpg",
  },
];

export const mockQuickActions: {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: string;
}[] = [
  {
    id: "qa_1",
    label: "View Conversations",
    icon: "MessageSquare",
    href: "/conversations",
    color: "blue",
  },
  {
    id: "qa_2",
    label: "Add Product",
    icon: "Package",
    href: "/products/new",
    color: "green",
  },
  {
    id: "qa_3",
    label: "Send Broadcast",
    icon: "Megaphone",
    href: "/broadcasts/new",
    color: "purple",
  },
  {
    id: "qa_4",
    label: "View Orders",
    icon: "ShoppingCart",
    href: "/orders",
    color: "orange",
  },
  {
    id: "qa_5",
    label: "AI Settings",
    icon: "Bot",
    href: "/settings/ai",
    color: "pink",
  },
  {
    id: "qa_6",
    label: "View Analytics",
    icon: "BarChart3",
    href: "/analytics",
    color: "teal",
  },
];
