export type Platform = "instagram" | "facebook" | "whatsapp";
export type LeadStage = "New" | "Contacted" | "Qualified" | "Negotiating" | "Won" | "Lost";
export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
export type ConversationStatus = "active" | "waiting" | "resolved" | "archived";
export type LeadScore = "hot" | "warm" | "cold";
export type AIPersonality = "friendly" | "professional" | "casual" | "pidgin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "owner" | "agent";
  businessId: string;
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  size: string;
  city: string;
  logo?: string;
  connectedPlatforms: Platform[];
  subscription: "starter" | "growth" | "pro";
  createdAt: string;
}

export interface Conversation {
  id: string;
  contactName: string;
  contactAvatar?: string;
  platform: Platform;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isAIEnabled: boolean;
  assignedTo?: string;
  leadId?: string;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: "customer" | "business" | "ai";
  platform: Platform;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
  productShare?: ProductShare;
}

export interface Attachment {
  id: string;
  type: "image" | "video" | "voice" | "document";
  url: string;
  name: string;
  size?: number;
}

export interface ProductShare {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  stock: number;
  sku?: string;
  variants?: ProductVariant[];
  platforms: Platform[];
  isActive: boolean;
  salesCount: number;
  viewCount: number;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: "size" | "color" | "style";
  options: string[];
  priceAdjustment?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  image?: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  platform: Platform;
  stage: LeadStage;
  score: LeadScore;
  value: number;
  source: string;
  lastInteraction: string;
  notes?: string;
  conversationId?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  platform: Platform;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "transfer" | "cod" | "card";
  paymentStatus: "pending" | "paid" | "failed";
  deliveryAddress: string;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface OrderTimeline {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "agent";
  status: "active" | "inactive";
  assignedConversations: number;
  resolvedToday: number;
  avgResponseTime: string;
  satisfaction: number;
  joinedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  language: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  revenue: { value: number; change: number; period: string };
  conversations: { value: number; change: number; period: string };
  leads: { value: number; change: number; period: string };
  orders: { value: number; change: number; period: string };
  aiResponseRate: { value: number; change: number; period: string };
}

export interface AnalyticsData {
  revenueByDay: { date: string; revenue: number; orders: number }[];
  revenueByPlatform: { platform: Platform; revenue: number; percentage: number }[];
  conversationsByDay: { date: string; total: number; ai: number; human: number }[];
  topProducts: { id: string; name: string; revenue: number; sales: number }[];
  conversionFunnel: { stage: string; count: number; rate: number }[];
  platformBreakdown: { platform: Platform; conversations: number; leads: number; orders: number }[];
}

export type NotificationCategory = "orders" | "leads" | "ai" | "system";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: NotificationCategory;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  audience: Platform[];
  recipientCount: number;
  sentCount: number;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  actor: string;
  actorAvatar?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AISettings {
  personality: AIPersonality;
  languages: string[];
  greetingMessage: string;
  awayMessage: string;
  minPrice: number;
  maxDiscount: number;
  maxNegotiationRounds: number;
  handoffKeywords: string[];
  businessHours: { day: string; open: string; close: string; enabled: boolean }[];
  autoFollowUp: boolean;
  followUpDelay: number;
}
