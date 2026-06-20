"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";

const mobileNavItems = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  {
    label: "Chats",
    href: ROUTES.CONVERSATIONS,
    icon: MessageSquare,
    badge: 5,
  },
  { label: "Products", href: ROUTES.PRODUCTS, icon: Package },
  { label: "Leads", href: ROUTES.LEADS, icon: Users },
  { label: "Orders", href: ROUTES.ORDERS, icon: ShoppingCart },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80 md:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                active
                  ? "text-pinga-orange"
                  : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "size-5",
                    active ? "text-pinga-orange" : "text-muted-foreground"
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-pinga-orange text-[8px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>

              {active && (
                <span className="absolute -top-[1px] left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-pinga-orange" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area bottom padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
