"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Unplug,
  Loader2,
  Send,
  Eye,
  EyeOff,
  Wifi,
  ExternalLink,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { MessageCircle } from "lucide-react";
import { Instagram, Facebook, Twitter } from "@/components/icons/brand-icons";
import { cn, formatDate } from "@/lib/utils";
import {
  useIntegrations,
  useDisconnectPlatform,
  useConnectInstagram,
  useConnectFacebook,
  useConnectWhatsApp,
  type PlatformIntegration,
} from "@/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
const META_CONFIGURED = META_APP_ID && META_APP_ID !== "placeholder";

// ---------------------------------------------------------------------------
// OAuth helpers
// ---------------------------------------------------------------------------
function getRedirectUri() {
  return `${window.location.origin}/owner/integrations`;
}

function buildMetaOAuthUrl(platform: "instagram" | "facebook") {
  const redirectUri = getRedirectUri();
  const scope =
    platform === "instagram"
      ? "pages_show_list,pages_manage_metadata,pages_messaging,pages_read_engagement,business_management"
      : "pages_show_list,pages_manage_metadata,pages_messaging,pages_read_engagement";

  return (
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${META_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&response_type=code` +
    `&state=${platform}`
  );
}

// ---------------------------------------------------------------------------
// Platform config
// ---------------------------------------------------------------------------
const PLATFORM_CONFIG = {
  instagram: {
    name: "Instagram Business",
    description: "Auto-reply to DMs, share products in chat",
    icon: Instagram,
    gradient: "from-pink-500 to-purple-600",
    buttonClass: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white",
    type: "oauth" as const,
  },
  facebook: {
    name: "Facebook Messenger",
    description: "Handle customer messages from your Facebook page",
    icon: Facebook,
    gradient: "from-blue-500 to-blue-700",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
    type: "oauth" as const,
  },
  whatsapp: {
    name: "WhatsApp Business",
    description: "Send and receive messages via WhatsApp Business API",
    icon: MessageCircle,
    gradient: "from-green-500 to-green-700",
    buttonClass: "bg-green-600 hover:bg-green-700 text-white",
    type: "credentials" as const,
  },
};

const COMING_SOON = [
  { id: "telegram", name: "Telegram", icon: Send, description: "Manage bots and channels" },
  { id: "twitter", name: "Twitter / X", icon: Twitter, description: "Reply to DMs and mentions" },
];

// ---------------------------------------------------------------------------
// WhatsApp credential form
// ---------------------------------------------------------------------------
function WhatsAppDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [wabaId, setWabaId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const connect = useConnectWhatsApp();

  const handleSubmit = () => {
    if (!phoneNumberId.trim() || !wabaId.trim() || !accessToken.trim()) return;
    connect.mutate(
      { phoneNumberId: phoneNumberId.trim(), wabaId: wabaId.trim(), accessToken: accessToken.trim() },
      { onSuccess: () => { onClose(); setPhoneNumberId(""); setWabaId(""); setAccessToken(""); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!connect.isPending && !o) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="size-5 text-green-600" />
            Connect WhatsApp Business
          </DialogTitle>
          <DialogDescription>
            Get your credentials from the{" "}
            <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer"
              className="text-[#FF6B2C] underline underline-offset-2 inline-flex items-center gap-1">
              Meta Developer Dashboard <ExternalLink className="size-3" />
            </a>
          </DialogDescription>
        </DialogHeader>

        {/* Step guide */}
        <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-4">
          <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">
            Where to find these credentials:
          </p>
          <ol className="text-xs text-green-700 dark:text-green-400 space-y-1.5 list-decimal pl-4">
            <li>Open Meta Developers → Your App → <strong>WhatsApp → Getting Started</strong></li>
            <li>Copy the <strong>Phone Number ID</strong></li>
            <li>Copy the <strong>WhatsApp Business Account ID</strong></li>
            <li>Go to System Users → create a System User → generate a <strong>permanent token</strong> with <code className="bg-green-100 dark:bg-green-900 px-1 rounded">whatsapp_business_messaging</code> permission</li>
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wa-phone-id">Phone Number ID <span className="text-destructive">*</span></Label>
            <Input id="wa-phone-id" placeholder="e.g. 123456789012345" value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wa-waba-id">WhatsApp Business Account ID <span className="text-destructive">*</span></Label>
            <Input id="wa-waba-id" placeholder="e.g. 987654321098765" value={wabaId} onChange={(e) => setWabaId(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wa-token">Access Token <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Input id="wa-token" type={showToken ? "text" : "password"} placeholder="EAAxxxxxxx..." value={accessToken} onChange={(e) => setAccessToken(e.target.value)} className="pr-10" />
              <button type="button" onClick={() => setShowToken((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={connect.isPending}>Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={!phoneNumberId.trim() || !wabaId.trim() || !accessToken.trim() || connect.isPending}>
            {connect.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Connect WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Platform card
// ---------------------------------------------------------------------------
function PlatformCard({
  integration,
  onConnect,
  onDisconnect,
  isConnecting,
  isDisconnecting,
}: {
  integration: PlatformIntegration;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting?: boolean;
  isDisconnecting: boolean;
}) {
  const config = PLATFORM_CONFIG[integration.platform];
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {/* Gradient header */}
      <div className={cn("flex items-center gap-4 bg-gradient-to-r px-6 py-5", config.gradient)}>
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon className="size-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white">{config.name}</h3>
          <p className="text-sm text-white/80 truncate">{config.description}</p>
        </div>
      </div>

      <CardContent className="flex flex-col gap-4 pt-5">
        {/* Status */}
        <div className="flex items-center gap-2 flex-wrap">
          {integration.connected ? (
            <>
              <CheckCircle2 className="size-4 text-green-500 shrink-0" />
              <Badge variant="outline" className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-800 dark:text-green-400">
                Connected
              </Badge>
              {integration.accountName && (
                <span className="text-sm text-muted-foreground">
                  @{integration.accountName}
                </span>
              )}
            </>
          ) : (
            <>
              <XCircle className="size-4 text-muted-foreground shrink-0" />
              <Badge variant="outline" className="text-muted-foreground">Not Connected</Badge>
            </>
          )}
        </div>

        {/* Connected details */}
        {integration.connected && integration.connectedAt && (
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>Connected {formatDate(integration.connectedAt)}</span>
            {integration.webhookVerified && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="size-3" /> Webhook active
              </span>
            )}
          </div>
        )}

        <Separator />

        {/* Action button */}
        <div className="flex justify-end">
          {integration.connected ? (
            <Button variant="outline" size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
              onClick={onDisconnect} disabled={isDisconnecting}>
              {isDisconnecting ? <Loader2 className="size-4 animate-spin" /> : <Unplug className="size-4" />}
              Disconnect
            </Button>
          ) : (
            <Button size="sm" className={config.buttonClass} onClick={onConnect} disabled={isConnecting}>
              {isConnecting ? <Loader2 className="size-4 animate-spin" /> : null}
              {config.type === "oauth" ? `Connect with Facebook` : `Connect ${config.name.split(" ")[0]}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ConnectAppsPage() {
  const router = useRouter();
  const { data: integrations = [], isLoading, refetch } = useIntegrations();
  const disconnect = useDisconnectPlatform();
  const connectIG = useConnectInstagram();
  const connectFB = useConnectFacebook();

  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [processingOAuth, setProcessingOAuth] = useState<string | null>(null);

  // ── Handle OAuth redirect callback ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const platform = params.get("state"); // passed via OAuth state param
    const error = params.get("error");

    // Clean up URL immediately
    if (code || error) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (error) {
      toast.error("Connection cancelled or failed.");
      return;
    }

    if (!code || !platform) return;

    const redirectUri = getRedirectUri();

    if (platform === "instagram") {
      setProcessingOAuth("instagram");
      connectIG.mutate(
        { code, redirectUri },
        { onSettled: () => setProcessingOAuth(null) }
      );
    } else if (platform === "facebook") {
      setProcessingOAuth("facebook");
      connectFB.mutate(
        { code, redirectUri },
        { onSettled: () => setProcessingOAuth(null) }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOAuthConnect = (platform: "instagram" | "facebook") => {
    if (!META_CONFIGURED) {
      toast.error("META_APP_ID is not configured. See the setup guide below.");
      return;
    }
    window.location.href = buildMetaOAuthUrl(platform);
  };

  const handleConnect = (platform: PlatformIntegration["platform"]) => {
    if (platform === "whatsapp") {
      setWhatsappOpen(true);
    } else {
      handleOAuthConnect(platform);
    }
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Connect Apps"
        description="Link your social platforms so Pinga's AI agent can manage conversations for you."
      />

      {/* No platform connected banner */}
      {!isLoading && connectedCount === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-[#FF6B2C]/30 bg-[#FF6B2C]/5 px-5 py-4">
          <Wifi className="size-5 text-[#FF6B2C] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#FF6B2C]">No platforms connected yet</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Connect at least one platform below. Once connected, your AI agent automatically handles conversations.
            </p>
          </div>
        </div>
      )}

      {/* Meta App not configured warning */}
      {!META_CONFIGURED && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30 px-5 py-4">
          <AlertCircle className="size-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              Meta App not configured yet
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-0.5">
              Instagram and Facebook OAuth won't work until you set <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">NEXT_PUBLIC_META_APP_ID</code> in your frontend <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">.env.local</code> and <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">META_APP_ID</code> + <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">META_APP_SECRET</code> in your backend <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">.env</code>.
            </p>
          </div>
          <a href="#setup-guide">
            <Button variant="outline" size="sm" className="shrink-0 border-yellow-400 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300">
              Setup Guide <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </a>
        </div>
      )}

      {/* OAuth processing overlay */}
      {processingOAuth && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 px-5 py-4">
          <Loader2 className="size-5 text-blue-600 animate-spin shrink-0" />
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Connecting {processingOAuth === "instagram" ? "Instagram" : "Facebook"}…
          </p>
        </div>
      )}

      {/* Platform cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin mr-2" />
          Loading connections...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <PlatformCard
              key={integration.platform}
              integration={integration}
              onConnect={() => handleConnect(integration.platform)}
              onDisconnect={() => disconnect.mutate(integration.platform)}
              isConnecting={processingOAuth === integration.platform}
              isDisconnecting={disconnect.isPending && disconnect.variables === integration.platform}
            />
          ))}
        </div>
      )}

      {/* Coming Soon */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coming Soon</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {COMING_SOON.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.id} className="opacity-55">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">Soon</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Setup Guide — only visible until Meta App is configured ── */}
      {!META_CONFIGURED && (
      <div id="setup-guide" className="flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-6">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#FF6B2C]" />
          <h2 className="text-base font-semibold">Developer Setup Guide (one time)</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          You only need to do this once. After this, your users connect their accounts with a single click.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Step 1 */}
          <div className="flex flex-col gap-2 rounded-lg border bg-background p-4">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#FF6B2C]/10 text-xs font-bold text-[#FF6B2C]">1</div>
            <p className="text-sm font-semibold">Create a Meta App</p>
            <p className="text-xs text-muted-foreground">
              Go to{" "}
              <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer"
                className="text-[#FF6B2C] underline underline-offset-2">
                developers.facebook.com
              </a>{" "}
              → Create App → <strong>Business</strong> type. Add the Instagram, Messenger, and WhatsApp products.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-2 rounded-lg border bg-background p-4">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#FF6B2C]/10 text-xs font-bold text-[#FF6B2C]">2</div>
            <p className="text-sm font-semibold">Add your credentials</p>
            <p className="text-xs text-muted-foreground mb-2">
              Copy App ID and App Secret from <strong>Settings → Basic</strong>, then add to both <code className="bg-muted px-1 rounded">.env</code> files:
            </p>
            <div className="rounded-md bg-muted p-3 font-mono text-[11px] space-y-1 text-muted-foreground">
              <p className="text-foreground"># Backend .env</p>
              <p>META_APP_ID=<span className="text-[#FF6B2C]">your_app_id</span></p>
              <p>META_APP_SECRET=<span className="text-[#FF6B2C]">your_secret</span></p>
              <p className="mt-2 text-foreground"># Frontend .env.local</p>
              <p>NEXT_PUBLIC_META_APP_ID=<span className="text-[#FF6B2C]">your_app_id</span></p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col gap-2 rounded-lg border bg-background p-4">
            <div className="flex size-7 items-center justify-center rounded-full bg-[#FF6B2C]/10 text-xs font-bold text-[#FF6B2C]">3</div>
            <p className="text-sm font-semibold">Whitelist your redirect URI</p>
            <p className="text-xs text-muted-foreground mb-2">
              In your Meta App → <strong>Facebook Login → Settings</strong>, add these as Valid OAuth Redirect URIs:
            </p>
            <div className="rounded-md bg-muted p-3 font-mono text-[11px] space-y-1 text-muted-foreground break-all">
              <p>http://localhost:3000/owner/integrations</p>
              <p className="mt-1 text-foreground"># In production also add:</p>
              <p>https://yourdomain.com/owner/integrations</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-green-500" />
          After setting these, restart both servers. Instagram and Facebook will connect with one click. WhatsApp still needs API credentials from Meta.
        </p>
      </div>
      )}

      <WhatsAppDialog open={whatsappOpen} onClose={() => setWhatsappOpen(false)} />
    </div>
  );
}
