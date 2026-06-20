"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  ShoppingBag,
  Package,
  HandCoins,
  Globe,
  Bot,
  BarChart3,
  Shield,
  Languages,
  Megaphone,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const DETAILED_FEATURES = [
  {
    icon: MessageSquare,
    title: "Auto-Reply AI",
    description:
      "Never miss a DM again. Pinga reads and responds to customer messages instantly with context-aware replies.",
    capabilities: [
      "Understands customer intent from messages",
      "Responds with product details automatically",
      "Handles FAQs without human intervention",
      "Escalates complex issues to you",
      "Works 24/7 including holidays",
      "Learns your brand tone over time",
    ],
  },
  {
    icon: Users,
    title: "Lead Pipeline & CRM",
    description:
      "Every DM inquiry becomes a tracked lead. Watch potential buyers move through your funnel.",
    capabilities: [
      "Automatic lead capture from DMs",
      "Stage tracking: New, Contacted, Qualified, Won",
      "Lead scoring and prioritization",
      "Follow-up reminders and automation",
      "Contact details collection",
      "Conversion analytics per channel",
    ],
  },
  {
    icon: ShoppingBag,
    title: "Product Catalog",
    description:
      "Your complete product catalogue in one place. AI shares products when customers ask.",
    capabilities: [
      "Upload products with images and descriptions",
      "Set prices, sizes, and variants",
      "Categorize and organize your inventory",
      "AI shares relevant products in conversations",
      "Stock tracking and low-stock alerts",
      "Bulk import via spreadsheet",
    ],
  },
  {
    icon: Package,
    title: "Order Tracking",
    description:
      "From confirmation to delivery, manage every step of the order lifecycle.",
    capabilities: [
      "Automatic order creation from DM conversations",
      "Status tracking: Pending, Confirmed, Shipped, Delivered",
      "Customer delivery notifications",
      "Order history and repeat customer detection",
      "Integration with delivery services",
      "Revenue tracking per order",
    ],
  },
  {
    icon: HandCoins,
    title: "Price Negotiation AI",
    description:
      "Customers love to bargain. Pinga negotiates within your set margins so everyone wins.",
    capabilities: [
      "Set minimum and maximum price ranges",
      "AI negotiates naturally in conversations",
      "Culturally-aware bargaining strategies",
      "Automatic discount thresholds",
      "Bundle deal suggestions",
      "Negotiation analytics and insights",
    ],
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description:
      "Connect Instagram, Facebook, and WhatsApp. Manage all conversations from one dashboard.",
    capabilities: [
      "Instagram DM integration",
      "Facebook Messenger integration",
      "WhatsApp Business API",
      "Unified inbox for all platforms",
      "Platform-specific response formatting",
      "Cross-platform customer profiles",
    ],
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description:
      "Speak your customers' language. Pinga replies in English, Pidgin, Yoruba, Hausa, and Igbo.",
    capabilities: [
      "Auto-detects customer language",
      "Replies in matching language",
      "Pidgin English for casual conversations",
      "Yoruba, Hausa, and Igbo support",
      "Language preference per customer",
      "Custom vocabulary training",
    ],
  },
  {
    icon: Bot,
    title: "Custom AI Training",
    description:
      "Train the AI on your unique products, policies, and brand personality.",
    capabilities: [
      "Custom knowledge base upload",
      "Brand voice and personality settings",
      "FAQ and policy training",
      "Product-specific responses",
      "Continuous learning from corrections",
      "Multiple AI personality modes",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Deep insights into your social sales performance with actionable data.",
    capabilities: [
      "Revenue tracking and trends",
      "Conversation volume analytics",
      "Response time metrics",
      "Top-selling products",
      "Lead conversion rates",
      "Platform comparison reports",
    ],
  },
  {
    icon: Megaphone,
    title: "Broadcast Messaging",
    description:
      "Send targeted messages to your customer segments for promotions and announcements.",
    capabilities: [
      "Segment customers by purchase history",
      "Schedule broadcast messages",
      "Personalized message templates",
      "Delivery and read tracking",
      "A/B testing for messages",
      "Compliance with platform policies",
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Enterprise-grade security with full NDPR compliance for Nigerian data protection.",
    capabilities: [
      "End-to-end encryption",
      "NDPR compliant data handling",
      "Role-based access control",
      "Audit logs for all actions",
      "Data export and deletion tools",
      "Regular security audits",
    ],
  },
  {
    icon: Clock,
    title: "Team Collaboration",
    description:
      "Add team members, assign conversations, and collaborate on sales together.",
    capabilities: [
      "Invite team members with roles",
      "Assign conversations to agents",
      "Internal notes on conversations",
      "Team performance tracking",
      "Shift scheduling support",
      "Handoff between AI and human agents",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6B2C]/10 via-background to-background py-20 lg:py-28">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[#FF6B2C]/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs font-semibold">
              All Features
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Powerful features for <span className="text-[#FF6B2C]">social selling</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Everything you need to turn DMs into sales, manage products, capture leads, and grow
              your business on social media.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {DETAILED_FEATURES.map(({ icon: Icon, title, description, capabilities }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="group h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-[#FF6B2C]/5">
                  <CardHeader>
                    <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-[#FF6B2C]/10 transition-colors group-hover:bg-[#FF6B2C]">
                      <Icon className="size-6 text-[#FF6B2C] transition-colors group-hover:text-white" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2">
                          <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#FF6B2C]" />
                          <span className="text-sm text-muted-foreground">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Ready to unlock all these features?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free and upgrade as your business grows.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href={ROUTES.REGISTER}>Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href={ROUTES.PRICING}>View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
