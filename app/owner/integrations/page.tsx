"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Unplug,
  Loader2,
  Eye,
  EyeOff,
  Wifi,
  ExternalLink,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { MessageCircle } from "lucide-react";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  TikTok,
  Reddit,
} from "@/components/icons/brand-icons";
import { cn, formatDate } from "@/lib/utils";
import {
  useIntegrations,
  useDisconnectPlatform,
  useConnectInstagram,
  useConnectFacebook,
  useConnectWhatsApp,
  useConnectTwitter,
  useConnectLinkedIn,
  useConnectTikTok,
  useConnectReddit,
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

// ---------------------------------------------------------------------------
// Env vars
// ---------------------------------------------------------------------------
const META_APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
const META_CONFIGURED = !!META_APP_ID && META_APP_ID !== "placeholder";

const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
const TWITTER_CONFIGURED = !!TWITTER_CLIENT_ID && TWITTER_CLIENT_ID !== "placeholder";

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const LINKEDIN_CONFIGURED = !!LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_ID !== "placeholder";

const TIKTOK_CLIENT_KEY = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
const TIKTOK_CONFIGURED = !!TIKTOK_CLIENT_KEY && TIKTOK_CLIENT_KEY !== "placeholder";

const REDDIT_CLIENT_ID = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID;
const REDDIT_CONFIGURED = !!REDDIT_CLIENT_ID && REDDIT_CLIENT_ID !== "placeholder";

// ---------------------------------------------------------------------------
// PKCE helpers (for Twitter and TikTok)
// ---------------------------------------------------------------------------
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// ---------------------------------------------------------------------------
// OAuth URL builders
// ---------------------------------------------------------------------------
function getRedirectUri() {
  return `${window.location.origin}/owner/integrations`;
}

function buildMetaOAuthUrl(platform: "instagram" | "facebook") {
  const scope =
    platform === "instagram"
      ? "pages_show_list,pages_manage_metadata,pages_messaging,pages_read_engagement,business_management"
      : "pages_show_list,pages_manage_metadata,pages_messaging,pages_read_engagement";
  return (
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${META_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(getRedirectUri())}` +
    `&scope=${scope}` +
    `&response_type=code` +
    `&state=${platform}`
  );
}

async function buildTwitterOAuthUrl(): Promise<string> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  sessionStorage.setItem("twitter_code_verifier", verifier);
  return (
    `https://twitter.com/i/oauth2/authorize` +
    `?client_id=${TWITTER_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(getRedirectUri())}` +
    `&scope=${encodeURIComponent("tweet.read users.read dm.read dm.write offline.access")}` +
    `&response_type=code` +
    `&state=twitter` +
    `&code_challenge=${challenge}` +
    `&code_challenge_method=S256`
  );
}

function buildLinkedInOAuthUrl(): string {
  return (
    `https://www.linkedin.com/oauth/v2/authorization` +
    `?client_id=${LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(getRedirectUri())}` +
    `&scope=${encodeURIComponent("openid profile email")}` +
    `&response_type=code` +
    `&state=linkedin`
  );
}

async function buildTikTokOAuthUrl(): Promise<string> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  sessionStorage.setItem("tiktok_code_verifier", verifier);
  return (
    `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${TIKTOK_CLIENT_KEY}` +
    `&redirect_uri=${encodeURIComponent(getRedirectUri())}` +
    `&scope=${encodeURIComponent("user.info.basic")}` +
    `&response_type=code` +
    `&state=tiktok` +
    `&code_challenge=${challenge}` +
    `&code_challenge_method=S256`
  );
}

function buildRedditOAuthUrl(): string {
  return (
    `https://www.reddit.com/api/v1/authorize` +
    `?client_id=${REDDIT_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(getRedirectUri())}` +
    `&scope=${encodeURIComponent("identity read privatemessages submit")}` +
    `&response_type=code` +
    `&state=reddit` +
    `&duration=permanent`
  );
}

// ---------------------------------------------------------------------------
// Platform config
// ---------------------------------------------------------------------------
const PLATFORM_CONFIG: Record<
  PlatformIntegration["platform"],
  {
    name: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    gradient: string;
    buttonClass: string;
    type: "oauth" | "credentials";
    connectLabel: string;
    configured: boolean;
    envKey: string;
  }
> = {
  instagram: {
    name: "Instagram Business",
    description: "Auto-reply to DMs, share products in chat",
    icon: Instagram,
    gradient: "from-pink-500 to-purple-600",
    buttonClass: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white",
    type: "oauth",
    connectLabel: "Connect with Facebook",
    configured: META_CONFIGURED,
    envKey: "NEXT_PUBLIC_META_APP_ID",
  },
  facebook: {
    name: "Facebook Messenger",
    description: "Handle customer messages from your Facebook page",
    icon: Facebook,
    gradient: "from-blue-500 to-blue-700",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
    type: "oauth",
    connectLabel: "Connect with Facebook",
    configured: META_CONFIGURED,
    envKey: "NEXT_PUBLIC_META_APP_ID",
  },
  whatsapp: {
    name: "WhatsApp Business",
    description: "Send and receive messages via WhatsApp Business API",
    icon: MessageCircle,
    gradient: "from-green-500 to-green-700",
    buttonClass: "bg-green-600 hover:bg-green-700 text-white",
    type: "credentials",
    connectLabel: "Connect WhatsApp",
    configured: true,
    envKey: "",
  },
  twitter: {
    name: "Twitter / X",
    description: "Reply to DMs and mentions automatically",
    icon: Twitter,
    gradient: "from-sky-400 to-sky-600",
    buttonClass: "bg-sky-500 hover:bg-sky-600 text-white",
    type: "oauth",
    connectLabel: "Connect with Twitter",
    configured: TWITTER_CONFIGURED,
    envKey: "NEXT_PUBLIC_TWITTER_CLIENT_ID",
  },
  linkedin: {
    name: "LinkedIn",
    description: "Post updates and manage professional connections",
    icon: Linkedin,
    gradient: "from-blue-600 to-blue-800",
    buttonClass: "bg-blue-700 hover:bg-blue-800 text-white",
    type: "oauth",
    connectLabel: "Connect with LinkedIn",
    configured: LINKEDIN_CONFIGURED,
    envKey: "NEXT_PUBLIC_LINKEDIN_CLIENT_ID",
  },
  tiktok: {
    name: "TikTok",
    description: "Reach your audience on TikTok",
    icon: TikTok,
    gradient: "from-gray-800 to-gray-950",
    buttonClass: "bg-gray-900 hover:bg-black text-white",
    type: "oauth",
    connectLabel: "Connect with TikTok",
    configured: TIKTOK_CONFIGURED,
    envKey: "NEXT_PUBLIC_TIKTOK_CLIENT_KEY",
  },
  reddit: {
    name: "Reddit",
    description: "Monitor subreddits and engage with communities",
    icon: Reddit,
    gradient: "from-orange-500 to-red-600",
    buttonClass: "bg-orange-600 hover:bg-orange-700 text-white",
    type: "oauth",
    connectLabel: "Connect with Reddit",
    configured: REDDIT_CONFIGURED,
    envKey: "NEXT_PUBLIC_REDDIT_CLIENT_ID",
  },
};

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

        {/* Warn if platform env not set */}
        {!integration.connected && !config.configured && config.type === "oauth" && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Set <code className="bg-muted px-1 rounded">{config.envKey}</code> to enable
          </p>
        )}

        <Separator />

        <div className="flex justify-end">
          {integration.connected ? (
            <Button variant="outline" size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
              onClick={onDisconnect} disabled={isDisconnecting}>
              {isDisconnecting ? <Loader2 className="size-4 animate-spin" /> : <Unplug className="size-4" />}
              Disconnect
            </Button>
          ) : (
            <Button size="sm" className={config.buttonClass} onClick={onConnect} disabled={isConnecting || (!config.configured && config.type === "oauth")}>
              {isConnecting ? <Loader2 className="size-4 animate-spin" /> : null}
              {config.connectLabel}
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
type OAuthPlatform = "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok" | "reddit";

export default function ConnectAppsPage() {
  const router = useRouter();
  const { data: integrations = [], isLoading, refetch } = useIntegrations();
  const disconnect = useDisconnectPlatform();
  const connectIG = useConnectInstagram();
  const connectFB = useConnectFacebook();
  const connectTW = useConnectTwitter();
  const connectLI = useConnectLinkedIn();
  const connectTK = useConnectTikTok();
  const connectRD = useConnectReddit();

  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [processingOAuth, setProcessingOAuth] = useState<OAuthPlatform | null>(null);

  // ── Handle OAuth redirect callback ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const platform = params.get("state") as OAuthPlatform | null;
    const error = params.get("error");

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
      connectIG.mutate({ code, redirectUri }, { onSettled: () => setProcessingOAuth(null) });
    } else if (platform === "facebook") {
      setProcessingOAuth("facebook");
      connectFB.mutate({ code, redirectUri }, { onSettled: () => setProcessingOAuth(null) });
    } else if (platform === "twitter") {
      const codeVerifier = sessionStorage.getItem("twitter_code_verifier") ?? "";
      sessionStorage.removeItem("twitter_code_verifier");
      setProcessingOAuth("twitter");
      connectTW.mutate({ code, redirectUri, codeVerifier }, { onSettled: () => setProcessingOAuth(null) });
    } else if (platform === "linkedin") {
      setProcessingOAuth("linkedin");
      connectLI.mutate({ code, redirectUri }, { onSettled: () => setProcessingOAuth(null) });
    } else if (platform === "tiktok") {
      const codeVerifier = sessionStorage.getItem("tiktok_code_verifier") ?? "";
      sessionStorage.removeItem("tiktok_code_verifier");
      setProcessingOAuth("tiktok");
      connectTK.mutate({ code, redirectUri, codeVerifier }, { onSettled: () => setProcessingOAuth(null) });
    } else if (platform === "reddit") {
      setProcessingOAuth("reddit");
      connectRD.mutate({ code, redirectUri }, { onSettled: () => setProcessingOAuth(null) });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async (platform: PlatformIntegration["platform"]) => {
    if (platform === "whatsapp") {
      setWhatsappOpen(true);
      return;
    }

    const config = PLATFORM_CONFIG[platform];
    if (!config.configured) {
      toast.error(`Set ${config.envKey} to enable ${config.name}.`);
      return;
    }

    let url: string;
    if (platform === "instagram" || platform === "facebook") {
      url = buildMetaOAuthUrl(platform);
    } else if (platform === "twitter") {
      url = await buildTwitterOAuthUrl();
    } else if (platform === "linkedin") {
      url = buildLinkedInOAuthUrl();
    } else if (platform === "tiktok") {
      url = await buildTikTokOAuthUrl();
    } else {
      url = buildRedditOAuthUrl();
    }
    window.location.href = url;
  };

  const connectedCount = integrations.filter((i) => i.connected).length;
  const unconfiguredCount = Object.values(PLATFORM_CONFIG).filter(
    (c) => c.type === "oauth" && !c.configured
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Connect Apps"
        description="Link your social platforms so Pinga's AI agent can manage conversations for you."
      />

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

      {unconfiguredCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30 px-5 py-4">
          <AlertCircle className="size-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
              Some platforms need configuration
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-0.5">
              {unconfiguredCount} platform{unconfiguredCount > 1 ? "s are" : " is"} missing environment variables. See the setup guide below.
            </p>
          </div>
          <a href="#setup-guide">
            <Button variant="outline" size="sm" className="shrink-0 border-yellow-400 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300">
              Setup Guide <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </a>
        </div>
      )}

      {processingOAuth && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 px-5 py-4">
          <Loader2 className="size-5 text-blue-600 animate-spin shrink-0" />
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Connecting {PLATFORM_CONFIG[processingOAuth].name}…
          </p>
        </div>
      )}

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


      <WhatsAppDialog open={whatsappOpen} onClose={() => setWhatsappOpen(false)} />
    </div>
  );
}
