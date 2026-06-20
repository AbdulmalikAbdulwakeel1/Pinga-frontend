"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Smile, Briefcase, HandMetal, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types & Mock State
// ---------------------------------------------------------------------------

type Personality = "friendly" | "professional" | "casual" | "pidgin";

const personalities: {
  id: Personality;
  icon: React.ReactNode;
  name: string;
  sample: string;
}[] = [
  {
    id: "friendly",
    icon: <Smile className="size-5 text-[#FF6B2C]" />,
    name: "Friendly",
    sample:
      "Hello! Welcome to our store. How can I help you today? Feel free to ask me anything!",
  },
  {
    id: "professional",
    icon: <Briefcase className="size-5 text-[#1877F2]" />,
    name: "Professional",
    sample:
      "Good day. Thank you for contacting us. How may I assist you with your inquiry today?",
  },
  {
    id: "casual",
    icon: <HandMetal className="size-5 text-[#25D366]" />,
    name: "Casual",
    sample:
      "Hey there! What's up? Looking for something cool? Just let me know what you need!",
  },
  {
    id: "pidgin",
    icon: <Globe className="size-5 text-[#8B5CF6]" />,
    name: "Pidgin",
    sample:
      "Hey! How you dey? Welcome to our shop o. Wetin you dey find? We get everything for you!",
  },
];

const languageOptions = [
  { id: "english", label: "English" },
  { id: "pidgin", label: "Pidgin" },
  { id: "yoruba", label: "Yoruba" },
  { id: "hausa", label: "Hausa" },
  { id: "igbo", label: "Igbo" },
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ---------------------------------------------------------------------------
// AI Settings Page
// ---------------------------------------------------------------------------

export default function AISettingsPage() {
  const [personality, setPersonality] = useState<Personality>("friendly");
  const [selectedLangs, setSelectedLangs] = useState<string[]>([
    "english",
    "pidgin",
  ]);
  const [greetingMessage, setGreetingMessage] = useState(
    "Hello! Welcome to our store. How can I help you today?"
  );
  const [awayMessage, setAwayMessage] = useState(
    "Thanks for your message! We're currently away but will get back to you as soon as possible."
  );
  const [negotiationEnabled, setNegotiationEnabled] = useState(true);
  const [minPrice, setMinPrice] = useState("5000");
  const [maxDiscount, setMaxDiscount] = useState([15]);
  const [maxRounds, setMaxRounds] = useState(3);
  const [businessHours, setBusinessHours] = useState(
    days.map((day) => ({
      day,
      enabled: !["Saturday", "Sunday"].includes(day),
      open: "09:00",
      close: "18:00",
    }))
  );

  function toggleLanguage(langId: string) {
    setSelectedLangs((prev) =>
      prev.includes(langId)
        ? prev.filter((l) => l !== langId)
        : [...prev, langId]
    );
  }

  function toggleDayEnabled(index: number) {
    setBusinessHours((prev) =>
      prev.map((bh, i) => (i === index ? { ...bh, enabled: !bh.enabled } : bh))
    );
  }

  function updateHour(index: number, field: "open" | "close", value: string) {
    setBusinessHours((prev) =>
      prev.map((bh, i) => (i === index ? { ...bh, [field]: value } : bh))
    );
  }

  function handleSave() {
    toast.success("Settings saved successfully!", {
      description: "Your AI agent configuration has been updated.",
    });
  }

  const selectedPersonality = personalities.find((p) => p.id === personality);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={ROUTES.AI_AGENT}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your AI agent behavior and personality
          </p>
        </div>
      </div>

      {/* Personality Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personality</CardTitle>
          <CardDescription>
            Choose how your AI agent communicates with customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {personalities.map((p) => (
              <div
                key={p.id}
                onClick={() => setPersonality(p.id)}
                className={cn(
                  "flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition-all",
                  personality === p.id
                    ? "border-[#FF6B2C] bg-[#FF6B2C]/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">{p.icon}</div>
                  <span className="font-semibold">{p.name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {p.sample}
                </p>
                <div
                  className={cn(
                    "mt-auto flex size-5 items-center justify-center rounded-full border-2",
                    personality === p.id
                      ? "border-[#FF6B2C]"
                      : "border-muted-foreground/30"
                  )}
                >
                  {personality === p.id && (
                    <div className="size-2.5 rounded-full bg-[#FF6B2C]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Languages Section */}
      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
          <CardDescription>
            Select languages your AI agent can respond in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {languageOptions.map((lang) => (
              <label
                key={lang.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selectedLangs.includes(lang.id)}
                  onCheckedChange={() => toggleLanguage(lang.id)}
                />
                <span className="text-sm">{lang.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Greeting & Away Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            Set greeting and away messages for your AI agent
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Greeting */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="greeting">Greeting Message</Label>
              <Textarea
                id="greeting"
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                rows={3}
              />
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Preview
                </p>
                <p className="text-sm">{greetingMessage}</p>
              </div>
            </div>

            {/* Away */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="away">Away Message</Label>
              <Textarea
                id="away"
                value={awayMessage}
                onChange={(e) => setAwayMessage(e.target.value)}
                rows={3}
              />
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Preview
                </p>
                <p className="text-sm">{awayMessage}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Negotiation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>Price Negotiation</CardTitle>
              <CardDescription>
                Let your AI negotiate prices within limits
              </CardDescription>
            </div>
            <Switch
              checked={negotiationEnabled}
              onCheckedChange={setNegotiationEnabled}
            />
          </div>
        </CardHeader>
        {negotiationEnabled && (
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Min Price */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="min-price">Minimum Price (NGN)</Label>
                <Input
                  id="min-price"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="5000"
                />
                <p className="text-xs text-muted-foreground">
                  AI won&apos;t go below this price
                </p>
              </div>

              {/* Max Discount */}
              <div className="flex flex-col gap-2">
                <Label>Max Discount: {maxDiscount[0]}%</Label>
                <Slider
                  value={maxDiscount}
                  onValueChange={setMaxDiscount}
                  min={0}
                  max={50}
                  step={5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum discount AI can offer
                </p>
              </div>

              {/* Max Rounds */}
              <div className="flex flex-col gap-2">
                <Label>Max Negotiation Rounds</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      key={n}
                      variant={maxRounds === n ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMaxRounds(n)}
                      style={
                        maxRounds === n
                          ? { backgroundColor: "#FF6B2C" }
                          : undefined
                      }
                    >
                      {n}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Rounds before final offer
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>
            Set when your AI agent is active. Outside these hours, the away
            message is used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {businessHours.map((bh, index) => (
              <div
                key={bh.day}
                className={cn(
                  "flex items-center gap-4 rounded-lg border p-3",
                  !bh.enabled && "opacity-50"
                )}
              >
                <Switch
                  checked={bh.enabled}
                  onCheckedChange={() => toggleDayEnabled(index)}
                  size="sm"
                />
                <span className="w-24 text-sm font-medium">{bh.day}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={bh.open}
                    onChange={(e) => updateHour(index, "open", e.target.value)}
                    disabled={!bh.enabled}
                    className="w-[120px]"
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={bh.close}
                    onChange={(e) => updateHour(index, "close", e.target.value)}
                    disabled={!bh.enabled}
                    className="w-[120px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="gap-2"
          size="lg"
          style={{ backgroundColor: "#FF6B2C" }}
        >
          <Save className="size-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
