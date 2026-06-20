"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Bell,
  Menu,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { SocketInitializer } from "@/components/shared/SocketInitializer";

// ---------------------------------------------------------------------------
// Sidebar nav items (6 items for agent)
// ---------------------------------------------------------------------------
const navItems = [
  { label: "Dashboard", href: ROUTES.AGENT_HOME, icon: LayoutDashboard },
  { label: "Conversations", href: ROUTES.AGENT_CONVERSATIONS, icon: MessageSquare, badge: 3 },
  { label: "Leads", href: ROUTES.AGENT_LEADS, icon: Users },
  { label: "Orders", href: ROUTES.AGENT_ORDERS, icon: ShoppingCart },
  { label: "Products", href: ROUTES.AGENT_PRODUCTS, icon: Package },
  { label: "Performance", href: ROUTES.AGENT_PERFORMANCE, icon: BarChart3 },
];

// Mobile bottom nav (5 items)
const mobileNavItems = [
  { label: "Dashboard", href: ROUTES.AGENT_HOME, icon: LayoutDashboard },
  { label: "Chats", href: ROUTES.AGENT_CONVERSATIONS, icon: MessageSquare, badge: 3 },
  { label: "Leads", href: ROUTES.AGENT_LEADS, icon: Users },
  { label: "Orders", href: ROUTES.AGENT_ORDERS, icon: ShoppingCart },
  { label: "Products", href: ROUTES.AGENT_PRODUCTS, icon: Package },
];

const STORAGE_KEY = "pinga-agent-sidebar-collapsed";

// ---------------------------------------------------------------------------
// Agent route title map
// ---------------------------------------------------------------------------
const routeTitles: Record<string, string> = {
  [ROUTES.AGENT_HOME]: "Dashboard",
  [ROUTES.AGENT_CONVERSATIONS]: "Conversations",
  [ROUTES.AGENT_LEADS]: "Leads",
  [ROUTES.AGENT_ORDERS]: "Orders",
  [ROUTES.AGENT_PRODUCTS]: "Products",
  [ROUTES.AGENT_PERFORMANCE]: "Performance",
  [ROUTES.AGENT_PROFILE]: "Profile",
};

function getPageTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];
  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname.startsWith(route) && route !== ROUTES.AGENT_HOME) {
      return title;
    }
  }
  return "Dashboard";
}

// ---------------------------------------------------------------------------
// Agent Sidebar
// ---------------------------------------------------------------------------
function handleLogout() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("userRole");
  window.location.href = "/auth/login";
}

function AgentSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  const isActive = (href: string) => {
    if (href === ROUTES.AGENT_HOME) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-18 items-center justify-between px-4">
        <Link href={ROUTES.AGENT_HOME} className="flex items-center gap-2">
          {collapsed ? (
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

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={toggleCollapsed}
          className={cn(
            "shrink-0 text-muted-foreground hover:text-foreground",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
          <span className="sr-only">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-2 mt-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                MENU
              </motion.p>
            )}
          </AnimatePresence>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-pinga-orange-light text-pinga-orange"
                    : "text-sidebar-foreground hover:bg-pinga-orange-light/50 hover:text-pinga-orange",
                  collapsed && "justify-center px-0"
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
                  {!collapsed && (
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

                {item.badge && !collapsed && (
                  <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-pinga-orange text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}

                {item.badge && collapsed && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-pinga-orange text-[9px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}

                {active && (
                  <motion.div
                    layoutId="agent-sidebar-active"
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

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User section */}
      <div className="p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="mx-auto flex items-center justify-center">
                  <Avatar size="sm">
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                <p className="font-medium">Chidi Nwosu</p>
                <p className="text-xs text-muted-foreground">Agent</p>
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
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                Chidi Nwosu
              </p>
              <p className="truncate text-xs text-muted-foreground">Agent</p>
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
    </motion.aside>
  );
}

// ---------------------------------------------------------------------------
// Agent Header
// ---------------------------------------------------------------------------
function AgentHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const pageTitle = getPageTitle(pathname);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60 md:px-6",
          className
        )}
      >
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Open navigation</span>
        </Button>

        {/* Page title */}
        <div className="flex flex-1 flex-col justify-center">
          <h1 className="text-lg font-semibold tracking-tight md:text-xl">
            {pageTitle}
          </h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-48 pl-9 lg:w-64"
              />
            </div>
          </div>

          {/* Notification bell */}
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-pinga-orange text-[9px] font-semibold text-white">
              2
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative rounded-full"
              >
                <Avatar size="sm">
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Chidi Nwosu</p>
                  <p className="text-xs text-muted-foreground">
                    chidi@pinga.ng
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.AGENT_PROFILE}>
                    <User className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.AGENT_PERFORMANCE}>
                    <BarChart3 className="size-4" />
                    My Performance
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AgentSidebar className="border-r-0" />
        </SheetContent>
      </Sheet>
    </>
  );
}

// ---------------------------------------------------------------------------
// Agent Mobile Nav
// ---------------------------------------------------------------------------
function AgentMobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === ROUTES.AGENT_HOME) return pathname === href;
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

// ---------------------------------------------------------------------------
// Agent Layout
// ---------------------------------------------------------------------------
export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Real-time socket connection */}
      <SocketInitializer />

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AgentSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AgentHeader />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <AgentMobileNav />
      </div>
    </div>
  );
}
