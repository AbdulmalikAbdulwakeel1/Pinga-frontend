"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageCircle, TrendingUp, Users } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const stats = [
  { label: "Businesses trust Pinga", value: "2,000+", icon: Users },
  { label: "Messages handled monthly", value: "500K+", icon: MessageCircle },
  { label: "Revenue generated", value: "₦2B+", icon: TrendingUp },
];

const floatingMessages = [
  { text: "Hi! Do you have this in size M?", position: "top-20 left-8", delay: 0 },
  { text: "Yes we do! ₦15,000. Want to order?", position: "top-36 right-6", delay: 1.5 },
  { text: "How much is delivery to Lagos?", position: "bottom-40 left-6", delay: 3 },
  { text: "Delivery is free for orders above ₦10K!", position: "bottom-24 right-8", delay: 4.5 },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Hidden on mobile */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#1A2B3E] lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A2B3E] via-[#2A3F56] to-[#1A2B3E]" />

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[#FF6B2C]/5" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#FF6B2C]/5" />
        <div className="absolute top-1/3 right-10 h-40 w-40 rounded-full bg-[#FF6B2C]/3" />

        {/* Content */}
        <div className="relative z-10 flex max-w-md flex-col items-center px-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Image
              src="/images/Logo.png"
              alt="Pinga"
              width={140}
              height={45}
              className="brightness-0 invert"
              style={{ width: "auto", height: "auto", maxHeight: "2.75rem" }}
              priority
            />
          </motion.div>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-3 font-heading text-2xl font-bold text-white"
          >
            Your AI Sales Agent
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 text-sm leading-relaxed text-gray-400"
          >
            Auto-reply to DMs, manage products, capture leads, and track orders
            across Instagram, Facebook &amp; WhatsApp.
          </motion.p>

          {/* Chat bubble illustrations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative mb-12 h-48 w-full"
          >
            {floatingMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.8 + msg.delay * 0.3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 5,
                }}
                className={`absolute ${msg.position} max-w-[200px]`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-lg ${
                    i % 2 === 0
                      ? "rounded-bl-sm bg-white/10 text-white backdrop-blur-sm"
                      : "rounded-br-sm bg-[#FF6B2C] text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated social proof stats */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStatIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-2"
              >
                {(() => {
                  const stat = stats[currentStatIndex];
                  const Icon = stat.icon;
                  return (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B2C]/20">
                        <Icon className="h-5 w-5 text-[#FF6B2C]" />
                      </div>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                      <span className="text-sm text-gray-400">{stat.label}</span>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            {/* Stat indicators */}
            <div className="mt-4 flex justify-center gap-2">
              {stats.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStatIndex ? "w-6 bg-[#FF6B2C]" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col bg-background lg:w-1/2">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden">
            <Image
              src="/images/Logo.png"
              alt="Pinga"
              width={80}
              height={26}
              style={{ width: "auto", height: "auto", maxHeight: "1.75rem" }}
            />
          </div>

          {/* Spacer for alignment */}
          <div className="w-20 lg:hidden" />
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-8 lg:px-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
