import type { User, Business } from "@/lib/types";

export const mockBusiness: Business = {
  id: "biz_001",
  name: "Amaka's Closet & More",
  category: "Fashion & Lifestyle",
  size: "small",
  city: "Lagos",
  logo: "/images/logos/amakas-closet.jpg",
  connectedPlatforms: ["instagram", "whatsapp", "facebook"],
  subscription: "growth",
  createdAt: "2025-09-15T10:00:00Z",
};

export const mockUser: User = {
  id: "user_001",
  firstName: "Amaka",
  lastName: "Obi",
  email: "amaka@amakascloset.ng",
  phone: "+2348034567890",
  avatar: "/images/avatars/amaka.jpg",
  role: "owner",
  businessId: "biz_001",
  createdAt: "2025-09-15T10:00:00Z",
};

export const mockAgents: User[] = [
  {
    id: "user_002",
    firstName: "Chidi",
    lastName: "Nwosu",
    email: "chidi@amakascloset.ng",
    phone: "+2348091234567",
    avatar: "/images/avatars/chidi.jpg",
    role: "agent",
    businessId: "biz_001",
    createdAt: "2025-11-01T09:00:00Z",
  },
  {
    id: "user_003",
    firstName: "Funke",
    lastName: "Adeyemi",
    email: "funke@amakascloset.ng",
    phone: "+2348076543210",
    avatar: "/images/avatars/funke.jpg",
    role: "agent",
    businessId: "biz_001",
    createdAt: "2026-01-10T09:00:00Z",
  },
];
