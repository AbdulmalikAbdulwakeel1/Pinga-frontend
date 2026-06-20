import { Sidebar } from "@/components/owner/Sidebar";
import { Header } from "@/components/owner/Header";
import { MobileNav } from "@/components/owner/MobileNav";
import { CommandPalette } from "@/components/shared/CommandPalette";
import { SpeedDial } from "@/components/shared/SpeedDial";
import { KeyboardShortcuts } from "@/components/shared/KeyboardShortcuts";
import { RouteProgressBar } from "@/components/shared/RouteProgressBar";
import { SocketInitializer } from "@/components/shared/SocketInitializer";
import { OnboardingWalkthrough } from "@/components/shared/OnboardingWalkthrough";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Top loading bar */}
      <RouteProgressBar />

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </div>

      {/* Real-time socket connection */}
      <SocketInitializer />

      {/* First-login onboarding walkthrough */}
      <OnboardingWalkthrough />

      {/* Global overlays */}
      <CommandPalette />
      <SpeedDial />
      <KeyboardShortcuts />
    </div>
  );
}
