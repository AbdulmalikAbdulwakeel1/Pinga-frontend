"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ROUTES } from "@/lib/routes";

function usePlatform() {
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    setIsMac(navigator.platform?.toLowerCase().includes("mac") ?? true);
  }, []);
  return isMac;
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
    {children}
  </kbd>
);

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; macKeys?: string[]; label: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["G", "D"], label: "Go to Dashboard" },
      { keys: ["G", "C"], label: "Go to Conversations" },
      { keys: ["G", "P"], label: "Go to Products" },
      { keys: ["G", "L"], label: "Go to Leads" },
      { keys: ["G", "O"], label: "Go to Orders" },
      { keys: ["G", "A"], label: "Go to Analytics" },
      { keys: ["G", "S"], label: "Go to Settings" },
      { keys: ["G", "I"], label: "Go to AI Playground" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { keys: ["N"], label: "New Product" },
      { keys: ["B"], label: "New Broadcast" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["Ctrl", "K"], macKeys: ["⌘", "K"], label: "Open Command Palette" },
      { keys: ["?"], label: "Show Keyboard Shortcuts" },
      { keys: ["Esc"], label: "Close Dialog / Dismiss" },
    ],
  },
];

const navShortcuts: Record<string, string> = {
  d: ROUTES.DASHBOARD,
  c: ROUTES.CONVERSATIONS,
  p: ROUTES.PRODUCTS,
  l: ROUTES.LEADS,
  o: ROUTES.ORDERS,
  a: ROUTES.ANALYTICS,
  s: ROUTES.SETTINGS,
  i: ROUTES.AI_PLAYGROUND,
};

const actionShortcuts: Record<string, string> = {
  n: ROUTES.PRODUCT_ADD,
  b: ROUTES.BROADCASTS,
};

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const isMac = usePlatform();
  const router = useRouter();
  const gPrefixRef = useRef(false);
  const gTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInputFocused = useCallback(() => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      (el as HTMLElement).isContentEditable
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return;

      // ? key - show shortcuts
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // G prefix for navigation
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey && !gPrefixRef.current) {
        gPrefixRef.current = true;
        if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);
        gTimeoutRef.current = setTimeout(() => {
          gPrefixRef.current = false;
        }, 1000);
        return;
      }

      // Navigation shortcuts (G + key)
      if (gPrefixRef.current) {
        const route = navShortcuts[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
        gPrefixRef.current = false;
        if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);
        return;
      }

      // Action shortcuts (single key)
      if (!e.metaKey && !e.ctrlKey) {
        const route = actionShortcuts[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (gTimeoutRef.current) clearTimeout(gTimeoutRef.current);
    };
  }, [isInputFocused, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-4" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate faster with keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              <div className="flex flex-col gap-1.5">
                {group.shortcuts.map((shortcut) => {
                  const keys = isMac && shortcut.macKeys ? shortcut.macKeys : shortcut.keys;
                  return (
                    <div
                      key={shortcut.label}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50"
                    >
                      <span className="text-sm">{shortcut.label}</span>
                      <div className="flex items-center gap-1">
                        {keys.map((key, i) => (
                          <span key={i} className="flex items-center gap-0.5">
                            {i > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                then
                              </span>
                            )}
                            <Kbd>{key}</Kbd>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
