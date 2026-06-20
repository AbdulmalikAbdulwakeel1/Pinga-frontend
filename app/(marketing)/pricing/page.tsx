"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, HelpCircle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Feature comparison data                                            */
/* ------------------------------------------------------------------ */

const COMPARISON_SECTIONS = [
  {
    title: "Messaging & AI",
    features: [
      { name: "AI auto-replies", starter: "100/month", growth: "Unlimited", pro: "Unlimited" },
      { name: "Connected platforms", starter: "1", growth: "3 (IG, FB, WA)", pro: "3 (IG, FB, WA)" },
      { name: "Price negotiation AI", starter: false, growth: true, pro: true },
      { name: "Custom AI training", starter: false, growth: false, pro: true },
      { name: "Multi-language support", starter: "English only", growth: "All 5 languages", pro: "All 5 languages" },
      { name: "Broadcast messaging", starter: false, growth: false, pro: true },
    ],
  },
  {
    title: "Products & Orders",
    features: [
      { name: "Products in catalog", starter: "10", growth: "100", pro: "Unlimited" },
      { name: "Order management", starter: true, growth: true, pro: true },
      { name: "Bulk product import", starter: false, growth: true, pro: true },
      { name: "Inventory tracking", starter: false, growth: true, pro: true },
    ],
  },
  {
    title: "Leads & CRM",
    features: [
      { name: "Lead capture", starter: true, growth: true, pro: true },
      { name: "Lead pipeline stages", starter: false, growth: true, pro: true },
      { name: "Lead scoring", starter: false, growth: true, pro: true },
      { name: "Follow-up automation", starter: false, growth: true, pro: true },
    ],
  },
  {
    title: "Analytics & Team",
    features: [
      { name: "Basic analytics", starter: true, growth: true, pro: true },
      { name: "Advanced analytics", starter: false, growth: true, pro: true },
      { name: "Team members", starter: "1 (you)", growth: "Up to 3", pro: "Unlimited" },
      { name: "Role-based access", starter: false, growth: false, pro: true },
      { name: "API access", starter: false, growth: false, pro: true },
    ],
  },
  {
    title: "Support",
    features: [
      { name: "Email support", starter: true, growth: true, pro: true },
      { name: "Priority support", starter: false, growth: true, pro: true },
      { name: "Dedicated account manager", starter: false, growth: false, pro: true },
      { name: "White-label options", starter: false, growth: false, pro: true },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    question: "Can I try Pinga for free before committing?",
    answer:
      "Absolutely! Our Starter plan is completely free and lets you connect one platform with 100 AI replies per month. You can upgrade anytime as your business grows. No credit card required to get started.",
  },
  {
    question: "How does billing work? Can I cancel anytime?",
    answer:
      "We bill monthly in Naira (NGN). You can upgrade, downgrade, or cancel your plan at any time from your account settings. When you cancel, you will retain access until the end of your current billing period. No hidden fees or long-term contracts.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept payments through bank transfers, debit cards (Visa, Mastercard, Verve), and popular Nigerian payment platforms including Paystack and Flutterwave. All transactions are processed securely in Nigerian Naira.",
  },
  {
    question: "What happens when I exceed my plan limits?",
    answer:
      "On the Starter plan, once you reach 100 AI replies, your AI agent will pause until the next month. You will always be notified before reaching your limits. We recommend upgrading to Growth for unlimited replies so you never miss a sale.",
  },
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. When upgrading, the new features are available immediately and we will prorate the charge. When downgrading, the change takes effect at the start of your next billing cycle.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, we offer a 20% discount when you choose annual billing. That means the Growth plan drops to NGN 12,000/month and the Pro plan to NGN 36,000/month when paid annually. Contact our sales team to set up annual billing.",
  },
];

/* ------------------------------------------------------------------ */
/*  Comparison cell renderer                                           */
/* ------------------------------------------------------------------ */

function ComparisonCell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto size-5 text-[#FF6B2C]" />
    ) : (
      <X className="mx-auto size-5 text-muted-foreground/40" />
    );
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
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
              Pricing
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Choose Your <span className="text-[#FF6B2C]">Plan</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Start free and scale as you grow. Simple pricing in Naira with no hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                      <Badge className="border-0 bg-[#FF6B2C] px-3 py-0.5 text-xs text-white">
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
        </div>
      </section>

      {/* Feature comparison */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Compare all features
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              See exactly what you get with each plan
            </p>
          </motion.div>

          {/* Desktop comparison table header */}
          <div className="hidden rounded-t-xl bg-[#1A2B3E] px-6 py-4 md:grid md:grid-cols-4">
            <div className="text-sm font-semibold text-white/60">Feature</div>
            <div className="text-center text-sm font-semibold text-white">Starter</div>
            <div className="text-center text-sm font-semibold text-[#FF6B2C]">Growth</div>
            <div className="text-center text-sm font-semibold text-white">Pro</div>
          </div>

          {/* Desktop accordion sections */}
          <Accordion type="multiple" defaultValue={["Messaging & AI"]} className="hidden md:flex md:flex-col">
            {COMPARISON_SECTIONS.map((section) => (
              <AccordionItem key={section.title} value={section.title} className="border-x border-b border-border">
                <AccordionTrigger className="px-6 text-base font-semibold text-foreground">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <div className="divide-y divide-border">
                    {section.features.map((feature) => (
                      <div key={feature.name} className="grid grid-cols-4 items-center px-6 py-3">
                        <span className="text-sm text-muted-foreground">{feature.name}</span>
                        <div className="text-center">
                          <ComparisonCell value={feature.starter} />
                        </div>
                        <div className="text-center">
                          <ComparisonCell value={feature.growth} />
                        </div>
                        <div className="text-center">
                          <ComparisonCell value={feature.pro} />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Mobile accordion sections */}
          <Accordion type="multiple" defaultValue={["Messaging & AI"]} className="md:hidden">
            {COMPARISON_SECTIONS.map((section) => (
              <AccordionItem key={section.title} value={section.title}>
                <AccordionTrigger className="text-base font-semibold text-foreground">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {section.features.map((feature) => (
                      <div key={feature.name} className="rounded-lg border border-border bg-card p-4">
                        <p className="mb-2 text-sm font-medium text-foreground">{feature.name}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <p className="mb-1 text-muted-foreground">Starter</p>
                            <ComparisonCell value={feature.starter} />
                          </div>
                          <div>
                            <p className="mb-1 font-medium text-[#FF6B2C]">Growth</p>
                            <ComparisonCell value={feature.growth} />
                          </div>
                          <div>
                            <p className="mb-1 text-muted-foreground">Pro</p>
                            <ComparisonCell value={feature.pro} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mb-14 text-center"
          >
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-[#FF6B2C]/10">
              <HelpCircle className="size-6 text-[#FF6B2C]" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left text-base font-medium text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
              Ready to start selling smarter?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join 2,000+ Nigerian businesses already growing with Pinga.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href={ROUTES.REGISTER}>Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href={ROUTES.CONTACT}>Talk to Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
