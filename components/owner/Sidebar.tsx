"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  LayoutDashboard,
  MessageSquare,
  Package,
  FolderOpen,
  Users,
  ShoppingCart,
  Wifi,
  Bell,
  Bot,
  Beaker,
  Megaphone,
  BarChart3,
  UserPlus,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useProfile } from "@/hooks";

const STORAGE_KEY = "pinga-sidebar-collapsed";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "Conversations", href: ROUTES.CONVERSATIONS, icon: MessageSquare, badge: 5 },
      { label: "Products", href: ROUTES.PRODUCTS, icon: Package },
      { label: "Categories", href: ROUTES.CATEGORIES, icon: FolderOpen },
      { label: "Leads", href: ROUTES.LEADS, icon: Users },
      { label: "Orders", href: ROUTES.ORDERS, icon: ShoppingCart },
      { label: "Connect Apps", href: ROUTES.INTEGRATIONS, icon: Wifi },
      { label: "Mentions", href: ROUTES.MENTIONS, icon: Bell },
    ],
  },
  {
    title: "AI & MARKETING",
    items: [
      { label: "AI Agent", href: ROUTES.AI_AGENT, icon: Bot },
      { label: "AI Playground", href: ROUTES.AI_PLAYGROUND, icon: Beaker },
      { label: "Broadcasts", href: ROUTES.BROADCASTS, icon: Megaphone },
      { label: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
    ],
  },
  {
    title: "MANAGE",
    items: [
      { label: "Team", href: ROUTES.TEAM, icon: UserPlus },
      { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
      { label: "Activity Log", href: ROUTES.ACTIVITY, icon: FileText },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
  /** When true, sidebar is always expanded with no width animation (for mobile sheet) */
  mobile?: boolean;
}

export function Sidebar({ className, onNavigate, mobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const isCollapsed = mobile ? false : collapsed;
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (mobile) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, [mobile]);

  // Track route changes: show spinner when navigating, hide when pathname updates
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      setIsNavigating(false);
    }
  }, [pathname]);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  const { data: profile } = useProfile();
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "…";
  const initials = profile ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}` : "?";
  const role = profile?.role ?? "owner";

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    onNavigate?.();
    router.push("/auth/login");
  };

  // Collect all sidebar hrefs to resolve conflicts when one route is a prefix of another
  const allHrefs = navGroups.flatMap((g) => g.items.map((i) => i.href));

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) {
      return pathname === href;
    }
    if (pathname.startsWith(href)) {
      const moreSpecific = allHrefs.some(
        (other) => other !== href && other.startsWith(href) && pathname.startsWith(other)
      );
      return !moreSpecific;
    }
    return false;
  };

  const asideProps = mobile
    ? { className: cn("relative flex h-screen w-full flex-col bg-sidebar", className) }
    : {
        className: cn(
          "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar",
          className
        ),
      };

  const Wrapper = mobile ? "aside" : motion.aside;
  const wrapperMotionProps = mobile
    ? {}
    : {
        initial: false,
        animate: { width: isCollapsed ? 72 : 260 },
        transition: { type: "spring", stiffness: 300, damping: 30 },
      };

  return (
    // @ts-expect-error -- motion.aside and aside have compatible props for our usage
    <Wrapper {...wrapperMotionProps} {...asideProps}>
      {/* Logo */}
      <div className="flex h-18 items-center justify-between px-4">
        <Link
          href={ROUTES.DASHBOARD}
          onClick={() => onNavigate?.()}
          className="flex items-center gap-2"
        >
          {isCollapsed ? (
            <Image
              src="/images/Favicon.jpg"
              alt="Pinga"
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-lg"
            />
          ) : (
            <Image
              src="/images/Logo.png"
              alt="Pinga"
              width={200}
              height={56}
              style={{ width: "auto", height: "56px" }}
            />
          )}
        </Link>

        <div className="flex items-center gap-1">
          <AnimatePresence>
            {isNavigating && !mobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <Loader2 className="size-4 animate-spin text-pinga-orange" />
              </motion.div>
            )}
          </AnimatePresence>

          {!mobile && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleCollapsed}
              className={cn(
                "shrink-0 text-muted-foreground hover:text-foreground",
                isCollapsed && "mx-auto"
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
              <span className="sr-only">
                {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </span>
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {navGroups.map((group) => (
            <div key={group.title} className="mt-4 first:mt-2">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {group.title}
                  </motion.p>
                )}
              </AnimatePresence>

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                const handleNavClick = () => {
                  if (item.href !== pathname) {
                    setIsNavigating(true);
                  }
                  onNavigate?.();
                };

                const linkContent = (
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-pinga-orange-light text-pinga-orange"
                        : "text-sidebar-foreground hover:bg-pinga-orange-light/50 hover:text-pinga-orange",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 shrink-0",
                        active
                          ? "text-pinga-orange"
                          : "text-muted-foreground group-hover:text-pinga-orange"
                      )}
                    />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {item.badge && !isCollapsed && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-pinga-orange text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}

                    {item.badge && isCollapsed && (
                      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-pinga-orange text-[9px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}

                    {active && (
                      <motion.div
                        layoutId={mobile ? "sidebar-active-mobile" : "sidebar-active"}
                        className="absolute inset-0 rounded-lg bg-pinga-orange-light"
                        style={{ zIndex: -1 }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <div key={item.href}>{linkContent}</div>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User section */}
      <div className="p-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="mx-auto flex items-center justify-center">
                  <Avatar size="sm">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p className="font-medium">{fullName}</p>
                <p className="text-xs text-muted-foreground">Owner</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">Owner</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
