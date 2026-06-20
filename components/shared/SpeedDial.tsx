"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Package,
  Megaphone,
  MessageSquare,
  BarChart3,
  Beaker,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

const actions = [
  { label: "Test AI", icon: Beaker, href: ROUTES.AI_PLAYGROUND, color: "bg-purple-500" },
  { label: "Analytics", icon: BarChart3, href: ROUTES.ANALYTICS, color: "bg-blue-500" },
  { label: "Conversations", icon: MessageSquare, href: ROUTES.CONVERSATIONS, color: "bg-green-500" },
  { label: "Broadcast", icon: Megaphone, href: ROUTES.BROADCASTS, color: "bg-yellow-500" },
  { label: "Add Product", icon: Package, href: ROUTES.PRODUCT_ADD, color: "bg-pink-500" },
];

export function SpeedDial() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAction = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB container */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
        {/* Action items */}
        <AnimatePresence>
          {open &&
            actions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.3, y: 20 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center gap-2"
              >
                <span className="rounded-lg bg-popover px-2.5 py-1 text-xs font-medium shadow-md">
                  {action.label}
                </span>
                <button
                  onClick={() => handleAction(action.href)}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110",
                    action.color
                  )}
                >
                  <action.icon className="size-4" />
                </button>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Main FAB button */}
        <motion.button
          onClick={() => setOpen((prev) => !prev)}
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex size-12 items-center justify-center rounded-full bg-pinga-orange text-white shadow-lg transition-colors hover:bg-pinga-orange/90 md:size-14"
        >
          {open ? <X className="size-5 md:size-6" /> : <Plus className="size-5 md:size-6" />}
        </motion.button>
      </div>
    </>
  );
}
