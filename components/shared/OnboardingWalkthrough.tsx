"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Bot,
  BarChart3,
  Package,
  ArrowRight,
  Check,
  X,
  Zap,
  Users,
  Settings,
} from "lucide-react";

import { useProfile } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ONBOARDING_COOKIE = "pinga_onboarded";

// ─── Step definitions ────────────────────────────────────

const PLATFORM_STEPS = [
  {
    id: "welcome",
    title: (name: string) => `Welcome to Pinga, ${name}!`,
    description:
      "You're about to supercharge your business with AI-powered customer engagement. Let's take a quick tour.",
    visual: (
      <div className="flex items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#FF6B2C]/10">
          <Zap className="h-12 w-12 text-[#FF6B2C]" />
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white">
            ✓
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "how-it-works",
    title: () => "How Pinga works",
    description: "Here's the simple 3-step flow that turns DMs into sales automatically.",
    visual: null,
    custom: (
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: MessageSquare, label: "Customer messages", color: "bg-blue-500/10 text-blue-500" },
          { icon: Bot, label: "AI handles & qualifies", color: "bg-[#FF6B2C]/10 text-[#FF6B2C]" },
          { icon: Users, label: "You close the deal", color: "bg-green-500/10 text-green-500" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", item.color)}>
              <item.icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium text-foreground">{item.label}</p>
            {i < 2 && (
              <ArrowRight className="absolute hidden text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "features",
    title: () => "Everything you need",
    description: "From conversations to analytics — it's all here.",
    visual: null,
    custom: (
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: MessageSquare, label: "Conversations", desc: "Manage all chats in one inbox", color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: Bot, label: "AI Agent", desc: "Configure your AI personality", color: "text-[#FF6B2C]", bg: "bg-[#FF6B2C]/10" },
          { icon: BarChart3, label: "Analytics", desc: "Track performance & growth", color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: Package, label: "Products", desc: "Sync your product catalog", color: "text-green-500", bg: "bg-green-500/10" },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3 rounded-xl border p-3">
            <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", item.bg)}>
              <item.icon className={cn("h-4 w-4", item.color)} />
            </div>
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "connect",
    title: () => "Connect your platforms",
    description:
      "Connect WhatsApp, Instagram, or Facebook to start receiving messages. You can do this from Settings anytime.",
    visual: null,
    custom: (
      <div className="space-y-3">
        {[
          { name: "WhatsApp Business", color: "#25D366", bg: "bg-green-500/10", emoji: "💬" },
          { name: "Instagram DMs", color: "#E1306C", bg: "bg-pink-500/10", emoji: "📸" },
          { name: "Facebook Messenger", color: "#1877F2", bg: "bg-blue-500/10", emoji: "👍" },
        ].map((p) => (
          <div key={p.name} className="flex items-center justify-between rounded-xl border p-3">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-lg", p.bg)}>
                {p.emoji}
              </div>
              <span className="text-sm font-medium">{p.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">Set up in Settings</span>
          </div>
        ))}
        <p className="text-center text-xs text-muted-foreground">
          You can connect platforms anytime from{" "}
          <span className="font-medium text-foreground">Settings → Integrations</span>
        </p>
      </div>
    ),
  },
  {
    id: "done",
    title: () => "You're all set!",
    description: "Your Pinga dashboard is ready. Start by exploring conversations or setting up your AI agent.",
    visual: (
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10"
        >
          <Check className="h-12 w-12 text-green-500" />
        </motion.div>
      </div>
    ),
  },
];

// ─── Main component ──────────────────────────────────────

export function OnboardingWalkthrough() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const { data: user } = useProfile();

  useEffect(() => {
    if (!user) return;
    const done = Cookies.get(ONBOARDING_COOKIE);
    if (!done) setOpen(true);
  }, [user]);

  const handleDismiss = () => {
    Cookies.set(ONBOARDING_COOKIE, "1", { expires: 365 });
    setOpen(false);
  };

  const current = PLATFORM_STEPS[step];
  const isLast = step === PLATFORM_STEPS.length - 1;
  const firstName = user?.firstName || "there";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex gap-1.5">
            {PLATFORM_STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === step
                    ? "w-6 bg-[#FF6B2C]"
                    : i < step
                      ? "w-3 bg-[#FF6B2C]/40"
                      : "w-3 bg-border"
                )}
              />
            ))}
          </div>
          <button
            onClick={handleDismiss}
            className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Visual */}
              {current.visual && (
                <div className="flex justify-center py-2">{current.visual}</div>
              )}

              {/* Text */}
              <div className="space-y-2 text-center">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {current.title(firstName)}
                </h2>
                <p className="text-sm text-muted-foreground">{current.description}</p>
              </div>

              {/* Custom content */}
              {"custom" in current && current.custom && (
                <div>{current.custom}</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={handleDismiss}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip tour
          </button>
          <Button
            onClick={() => {
              if (isLast) {
                handleDismiss();
              } else {
                setStep((s) => s + 1);
              }
            }}
            className="bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
          >
            {isLast ? (
              <>
                Go to Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
