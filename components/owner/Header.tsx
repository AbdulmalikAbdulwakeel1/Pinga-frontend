"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import {
  Bell,
  Menu,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
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
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { Sidebar } from "@/components/owner/Sidebar";
import { useProfile } from "@/hooks";

const routeTitles: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.CONVERSATIONS]: "Conversations",
  [ROUTES.PRODUCTS]: "Products",
  [ROUTES.CATEGORIES]: "Categories",
  [ROUTES.LEADS]: "Leads",
  [ROUTES.ORDERS]: "Orders",
  [ROUTES.AI_AGENT]: "AI Agent",
  [ROUTES.AI_PLAYGROUND]: "AI Playground",
  [ROUTES.BROADCASTS]: "Broadcasts",
  [ROUTES.ANALYTICS]: "Analytics",
  [ROUTES.INTEGRATIONS]: "Connect Apps",
  [ROUTES.TEAM]: "Team",
  [ROUTES.SETTINGS]: "Settings",
  [ROUTES.ACTIVITY]: "Activity Log",
  [ROUTES.NOTIFICATIONS]: "Notifications",
};

function getPageTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];

  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname.startsWith(route) && route !== ROUTES.DASHBOARD) {
      return title;
    }
  }
  return "Dashboard";
}

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [];

  if (segments[0] === "owner") {
    crumbs.push({ label: "Home", href: ROUTES.DASHBOARD });
    const pageTitle = getPageTitle(pathname);
    if (pageTitle !== "Dashboard") {
      crumbs.push({ label: pageTitle });
    }
  }

  return crumbs;
}

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", emoji: "sunrise" };
  if (hour < 17) return { text: "Good afternoon", emoji: "sun" };
  if (hour < 21) return { text: "Good evening", emoji: "sunset" };
  return { text: "Working late", emoji: "moon" };
}

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);
  const breadcrumbs = getBreadcrumbs(pathname);
  const isDashboard = pathname === ROUTES.DASHBOARD;
  const greeting = useMemo(() => getGreeting(), []);
  const { data: profile } = useProfile();
  const firstName = profile?.firstName ?? "";
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "";
  const email = profile?.email ?? "";
  const initials = profile ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}` : "?";

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

        {/* Page title / breadcrumbs */}
        <div className="flex flex-1 flex-col justify-center">
          {isDashboard ? (
            <>
              <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                {greeting.text}{firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Here&apos;s what&apos;s happening with your business today
              </p>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                {pageTitle}
              </h1>
              {breadcrumbs.length > 1 && (
                <nav className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                  {breadcrumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i > 0 && <ChevronRight className="size-3" />}
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className="hover:text-foreground transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-foreground font-medium">
                          {crumb.label}
                        </span>
                      )}
                    </span>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Command palette trigger */}
          <Button
            variant="outline"
            size="sm"
            className="hidden h-8 gap-2 text-muted-foreground sm:flex"
            onClick={() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              )
            }
          >
            <Search className="size-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none ml-2 hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
              ⌘K
            </kbd>
          </Button>

          {/* Notification bell */}
          <NotificationBell />

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
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{fullName}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.SETTINGS}>
                    <User className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.SETTINGS}>
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  Cookies.remove("accessToken");
                  Cookies.remove("refreshToken");
                  Cookies.remove("userRole");
                  window.location.href = "/auth/login";
                }}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[260px] gap-0 bg-sidebar p-0"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar
            className="border-r-0"
            mobile
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
