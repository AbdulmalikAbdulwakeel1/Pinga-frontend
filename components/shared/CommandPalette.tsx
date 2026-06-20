"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Megaphone,
  Bot,
  LayoutDashboard,
  MessageSquare,
  Users,
  ShoppingCart,
  BarChart3,
  Plug,
  UserPlus,
  Settings,
  FileText,
  Search,
  Plus,
  Beaker,
  Bell,
} from "lucide-react";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { ROUTES } from "@/lib/routes";
import { mockProducts } from "@/lib/mock/products";
import { mockLeads } from "@/lib/mock/leads";
import { mockOrders } from "@/lib/mock/orders";

const quickActions = [
  { label: "Add Product", icon: Plus, href: ROUTES.PRODUCT_ADD },
  { label: "New Broadcast", icon: Megaphone, href: ROUTES.BROADCASTS },
  { label: "Test AI", icon: Beaker, href: ROUTES.AI_PLAYGROUND },
  { label: "View Notifications", icon: Bell, href: ROUTES.NOTIFICATIONS },
];

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { label: "Conversations", icon: MessageSquare, href: ROUTES.CONVERSATIONS },
  { label: "Products", icon: Package, href: ROUTES.PRODUCTS },
  { label: "Leads", icon: Users, href: ROUTES.LEADS },
  { label: "Orders", icon: ShoppingCart, href: ROUTES.ORDERS },
  { label: "AI Agent", icon: Bot, href: ROUTES.AI_AGENT },
  { label: "AI Playground", icon: Beaker, href: ROUTES.AI_PLAYGROUND },
  { label: "Broadcasts", icon: Megaphone, href: ROUTES.BROADCASTS },
  { label: "Analytics", icon: BarChart3, href: ROUTES.ANALYTICS },
  { label: "Integrations", icon: Plug, href: ROUTES.INTEGRATIONS },
  { label: "Team", icon: UserPlus, href: ROUTES.TEAM },
  { label: "Settings", icon: Settings, href: ROUTES.SETTINGS },
  { label: "Activity Log", icon: FileText, href: ROUTES.ACTIVITY },
  { label: "Notifications", icon: Bell, href: ROUTES.NOTIFICATIONS },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-xl border border-border shadow-lg">
        <CommandInput placeholder="Search pages, products, leads, orders..." />
        <CommandList className="max-h-80">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            {quickActions.map((item) => (
              <CommandItem
                key={item.href + item.label}
                onSelect={() => runCommand(item.href)}
              >
                <item.icon className="size-4 text-pinga-orange" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(item.href)}
              >
                <item.icon className="size-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Products">
            {mockProducts.slice(0, 8).map((product) => (
              <CommandItem
                key={product.id}
                value={`product ${product.name} ${product.category}`}
                onSelect={() => runCommand(ROUTES.PRODUCT_DETAIL(product.id))}
              >
                <Package className="size-4 text-muted-foreground" />
                <span>{product.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  NGN {product.price.toLocaleString()}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Leads">
            {mockLeads.slice(0, 6).map((lead) => (
              <CommandItem
                key={lead.id}
                value={`lead ${lead.name} ${lead.stage} ${lead.platform}`}
                onSelect={() => runCommand(ROUTES.LEAD_DETAIL(lead.id))}
              >
                <Users className="size-4 text-muted-foreground" />
                <span>{lead.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {lead.stage}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Orders">
            {mockOrders.slice(0, 6).map((order) => (
              <CommandItem
                key={order.id}
                value={`order ${order.orderNumber} ${order.customerName} ${order.status}`}
                onSelect={() => runCommand(ROUTES.ORDER_DETAIL(order.id))}
              >
                <ShoppingCart className="size-4 text-muted-foreground" />
                <span>{order.orderNumber}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {order.customerName}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {order.status}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
