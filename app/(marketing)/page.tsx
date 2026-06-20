"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Users,
  ShoppingBag,
  Package,
  HandCoins,
  Globe,
  MessageCircle,
  ArrowRight,
  Check,
  X,
  Zap,
  Star,
  Play,
} from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { cn, formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { PRICING_TIERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6B2C]/5 via-background to-background py-20 lg:py-28">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[#FF6B2C]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[30rem] rounded-full bg-[#FF6B2C]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div variants={fadeUp}>
              <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs font-semibold">
                <Zap className="size-3 text-[#FF6B2C]" />
                AI-Powered Sales Agent
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Your AI Sales Agent for{" "}
              <span className="text-[#FF6B2C]">Instagram, Facebook & WhatsApp</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg leading-relaxed text-muted-foreground"
            >
              Pinga auto-replies to DMs, captures leads, manages your product catalog, negotiates
              prices, and closes sales -- all while you sleep. Built for Nigerian small businesses.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 gap-2 px-6 text-base">
                <Link href={ROUTES.REGISTER}>
                  Start Free <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 gap-2 px-6 text-base">
                <Play className="size-4" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column - Chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-[#FF6B2C]/10">
              {/* Chat header */}
              <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#FF6B2C]/10">
                  <MessageSquare className="size-5 text-[#FF6B2C]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Pinga AI Agent</p>
                  <p className="text-xs text-muted-foreground">Online - replying instantly</p>
                </div>
                <Badge className="ml-auto bg-green-500/10 text-green-600 dark:text-green-400 border-0">Live</Badge>
              </div>

              {/* Messages */}
              <div className="space-y-3">
                <ChatBubble from="customer" delay={0.5}>
                  Hi! How much is the ankara dress in your post?
                </ChatBubble>
                <ChatBubble from="ai" delay={1}>
                  Hello! The ankara dress is {formatCurrency(15000)}. We have sizes S-XXL. Want me
                  to check availability in your size?
                </ChatBubble>
                <ChatBubble from="customer" delay={1.5}>
                  Yes! I want size L. Can you do {formatCurrency(13000)}?
                </ChatBubble>
                <ChatBubble from="ai" delay={2}>
                  I can do {formatCurrency(14000)} for you! That includes free delivery in Lagos.
                  Should I create your order?
                </ChatBubble>
                <ChatBubble from="customer" delay={2.5}>
                  Deal! Let me pay now
                </ChatBubble>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute -right-4 -bottom-4 rounded-xl border border-border bg-card px-4 py-2.5 shadow-lg"
            >
              <p className="text-xs text-muted-foreground">Order created</p>
              <p className="text-sm font-bold text-green-600">{formatCurrency(14000)} sale!</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({
  from,
  delay,
  children,
}: {
  from: "customer" | "ai";
  delay: number;
  children: React.ReactNode;
}) {
  const isAi = from === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn("flex", isAi ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAi
            ? "rounded-bl-md bg-[#FF6B2C]/10 text-foreground"
            : "rounded-br-md bg-[#FF6B2C] text-white"
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Platform logos                                                     */
/* ------------------------------------------------------------------ */

function PlatformLogos() {
  const platforms = [
    { icon: Instagram, label: "Instagram", color: "#E1306C" },
    { icon: Facebook, label: "Facebook", color: "#1877F2" },
    { icon: MessageCircle, label: "WhatsApp", color: "#25D366" },
  ];

  return (
    <section className="border-y border-border bg-muted/40 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Works seamlessly with
          </p>
          <div className="flex items-center gap-8 sm:gap-12">
            {platforms.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div
                  className="flex size-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="size-5" style={{ color }} />
                </div>
                <span className="hidden text-sm font-semibold text-foreground sm:block">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Before / After                                                     */
/* ------------------------------------------------------------------ */

function BeforeAfter() {
  const beforeItems = [
    "Missed messages from potential buyers",
    "Lost sales while you are sleeping or busy",
    "No time to reply to every DM manually",
    "Customers get frustrated waiting for replies",
    "No system to track orders and leads",
  ];

  const afterItems = [
    "AI replies instantly, 24/7 -- even on weekends",
    "Every lead is captured and added to your pipeline",
    "Automated product info, pricing & negotiations",
    "Customers love the fast, helpful responses",
    "Full order tracking and analytics dashboard",
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Stop losing sales in your DMs
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            See the difference Pinga makes for your business
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Before */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <Card className="h-full border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-red-700">
                  <X className="size-5" />
                  Without Pinga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {beforeItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <X className="mt-0.5 size-4 shrink-0 text-red-500" />
                      <span className="text-sm text-red-700 dark:text-red-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* After */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <Card className="h-full border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-green-700">
                  <Check className="size-5" />
                  With Pinga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {afterItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features grid                                                      */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Auto-Reply AI",
    description:
      "Instantly responds to DMs with context-aware messages in English, Pidgin, Yoruba, Hausa & Igbo.",
  },
  {
    icon: Users,
    title: "Lead Pipeline",
    description:
      "Automatically captures every potential buyer, tracks their journey from inquiry to purchase.",
  },
  {
    icon: ShoppingBag,
    title: "Product Catalog",
    description:
      "Upload your products with photos, pricing, sizes and variants. AI shares them automatically.",
  },
  {
    icon: Package,
    title: "Order Tracking",
    description:
      "From confirmation to delivery, manage every order and keep customers updated automatically.",
  },
  {
    icon: HandCoins,
    title: "Price Negotiation",
    description:
      "AI negotiates within your set margins. No more losing deals over slow haggling in DMs.",
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    description:
      "Connect Instagram, Facebook & WhatsApp. One dashboard to manage all your social sales channels.",
  },
];

function FeaturesGrid() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need to sell on social media
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Powerful features built specifically for Nigerian businesses
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <motion.div key={title} variants={fadeUp}>
              <Card className="group h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-[#FF6B2C]/5">
                <CardHeader>
                  <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-[#FF6B2C]/10 transition-colors group-hover:bg-[#FF6B2C] group-hover:text-white">
                    <Icon className="size-6 text-[#FF6B2C] transition-colors group-hover:text-white" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How it works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Connect your accounts",
      description:
        "Link your Instagram, Facebook, and WhatsApp business accounts in just a few clicks. No technical skills needed.",
    },
    {
      num: 2,
      title: "Set up your products",
      description:
        "Add your products, set prices and negotiation ranges. Train the AI on your brand voice and FAQs.",
    },
    {
      num: 3,
      title: "Watch AI sell for you",
      description:
        "Pinga handles DM replies, answers questions, negotiates prices, creates orders, and captures leads -- all automatically.",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Up and running in 3 simple steps
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Get started in under 10 minutes -- no technical setup required
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {steps.map(({ num, title, description }) => (
            <motion.div key={num} variants={fadeUp} className="relative text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[#FF6B2C] text-2xl font-bold text-white shadow-lg shadow-[#FF6B2C]/30">
                {num}
              </div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

function Stats() {
  const stats = [
    { value: "2,000+", label: "Businesses using Pinga" },
    { value: "1M+", label: "Messages handled" },
    { value: formatCurrency(500_000_000), label: "In sales generated" },
  ];

  return (
    <section className="bg-[#1A2B3E] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 text-center sm:grid-cols-3"
        >
          {stats.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp}>
              <p className="text-4xl font-extrabold text-[#FF6B2C] sm:text-5xl">{value}</p>
              <p className="mt-2 text-sm font-medium text-white/60">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing preview                                                    */
/* ------------------------------------------------------------------ */

function PricingPreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Start free. Upgrade when you are ready to grow.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {PRICING_TIERS.map((tier) => (
            <motion.div key={tier.name} variants={fadeUp}>
              <Card
                className={cn(
                  "relative h-full transition-shadow duration-300 hover:shadow-lg",
                  tier.popular && "border-2 border-[#FF6B2C] shadow-lg shadow-[#FF6B2C]/10"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#FF6B2C] text-white px-3 py-0.5 text-xs border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-foreground">
                      {tier.price === 0 ? "Free" : formatCurrency(tier.price)}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-sm text-muted-foreground">/{tier.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-[#FF6B2C]" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                  >
                    <Link href={ROUTES.REGISTER}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            href={ROUTES.PRICING}
            className="text-sm font-medium text-[#FF6B2C] hover:underline"
          >
            Compare all features &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

function Testimonials() {
  const testimonials = [
    {
      name: "Chioma Adeyemi",
      role: "Fashion Store Owner, Lagos",
      quote:
        "Pinga doubled my sales in the first month. I used to miss so many DMs when I was busy, but now every customer gets a reply instantly. My customers think I hired a whole team!",
      rating: 5,
    },
    {
      name: "Emeka Okafor",
      role: "Electronics Dealer, Aba",
      quote:
        "The price negotiation feature is genius. My customers love to haggle and Pinga handles it perfectly. I set my margins and the AI does the rest. I have saved hours every day.",
      rating: 5,
    },
    {
      name: "Aisha Bello",
      role: "Skincare Brand, Abuja",
      quote:
        "Managing three social media platforms was killing me. Now I have one dashboard for everything. The lead tracking alone has helped me follow up on sales I would have lost.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Loved by Nigerian business owners
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Join thousands of SMBs already selling smarter with Pinga
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-[#FF6B2C] text-[#FF6B2C]"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#FF6B2C]/10 text-sm font-bold text-[#FF6B2C]">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Banner                                                         */
/* ------------------------------------------------------------------ */

function CTABanner() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B2C] to-[#E55A1F] px-8 py-16 text-center shadow-2xl shadow-[#FF6B2C]/20 sm:px-16"
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-white/5" />

          <div className="relative">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to automate your DM sales?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
              Join 2,000+ Nigerian businesses already using Pinga to sell more and reply faster.
              Start free today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 gap-2 bg-white px-8 text-base font-semibold text-[#FF6B2C] hover:bg-white/90"
              >
                <Link href={ROUTES.REGISTER}>
                  Get Started Free <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={ROUTES.CONTACT}>Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <>
      <Hero />
      <PlatformLogos />
      <BeforeAfter />
      <FeaturesGrid />
      <HowItWorks />
      <Stats />
      <PricingPreview />
      <Testimonials />
      <CTABanner />
    </>
  );
}
