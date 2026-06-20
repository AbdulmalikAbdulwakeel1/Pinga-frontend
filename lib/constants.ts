export const APP_NAME = "Pinga";
export const APP_TAGLINE = "Your AI Social Sales Agent";
export const APP_DESCRIPTION = "AI-powered social sales agent that auto-replies to Instagram, Facebook, and WhatsApp DMs, manages product catalogs, captures leads, and tracks orders for Nigerian small businesses.";

export const PLATFORMS = {
  INSTAGRAM: "instagram",
  FACEBOOK: "facebook",
  WHATSAPP: "whatsapp",
} as const;

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
};

export const LEAD_STAGES = ["New", "Contacted", "Qualified", "Negotiating", "Won", "Lost"] as const;

export const ORDER_STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const;

export const CONVERSATION_STATUSES = ["active", "waiting", "resolved", "archived"] as const;

export const AI_PERSONALITIES = ["friendly", "professional", "casual", "pidgin"] as const;

export const LANGUAGES = ["English", "Pidgin", "Yoruba", "Hausa", "Igbo"] as const;

export const BUSINESS_CATEGORIES = [
  "Fashion & Clothing",
  "Beauty & Cosmetics",
  "Food & Catering",
  "Electronics & Gadgets",
  "Home & Living",
  "Health & Wellness",
  "Art & Crafts",
  "Services",
  "Other",
] as const;

export const BUSINESS_SIZES = ["Just me", "2-5 employees", "6-20 employees", "21-50 employees", "50+"] as const;

export const NIGERIAN_CITIES = [
  "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano",
  "Benin City", "Enugu", "Kaduna", "Warri", "Abeokuta",
  "Owerri", "Uyo", "Calabar", "Jos", "Ilorin",
] as const;

export const PRICING_TIERS = [
  {
    name: "Starter",
    price: 0,
    period: "forever",
    description: "Perfect for trying out Pinga",
    features: [
      "1 connected platform",
      "100 AI replies/month",
      "10 products",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Growth",
    price: 15000,
    period: "month",
    description: "For growing businesses",
    features: [
      "All 3 platforms (IG, FB, WA)",
      "Unlimited AI replies",
      "100 products",
      "Lead pipeline & CRM",
      "Team members (up to 3)",
      "Advanced analytics",
      "Priority support",
      "Price negotiation AI",
    ],
    cta: "Start Growing",
    popular: true,
  },
  {
    name: "Pro",
    price: 45000,
    period: "month",
    description: "For established businesses",
    features: [
      "Everything in Growth",
      "Unlimited products",
      "Unlimited team members",
      "Broadcast messaging",
      "Custom AI training",
      "API access",
      "Dedicated account manager",
      "White-label options",
    ],
    cta: "Go Pro",
    popular: false,
  },
] as const;
