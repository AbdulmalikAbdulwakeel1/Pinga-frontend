"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Clock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AIPersonality, Platform } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTestAI } from "@/hooks";
import { testScenarios } from "@/lib/mock/ai-playground";

interface PlaygroundMessage {
  id: string;
  role: "customer" | "ai";
  content: string;
  timestamp: string;
  responseTime?: number;
  personality?: AIPersonality;
  platform?: Platform;
}

const personalities: { value: AIPersonality; label: string; description: string }[] = [
  { value: "friendly", label: "Friendly", description: "Warm, emoji-rich, approachable" },
  { value: "professional", label: "Professional", description: "Formal, structured, business-like" },
  { value: "casual", label: "Casual", description: "Relaxed, brief, conversational" },
  { value: "pidgin", label: "Pidgin", description: "Nigerian Pidgin English" },
];

const platforms: { value: Platform; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
];

const personalityColors: Record<AIPersonality, string> = {
  friendly: "bg-green-500/10 text-green-600 border-green-500/20",
  professional: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  casual: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  pidgin: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export default function AIPlaygroundPage() {
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [input, setInput] = useState("");
  const [personality, setPersonality] = useState<AIPersonality>("friendly");
  const [platform, setPlatform] = useState<Platform>("whatsapp");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const testAI = useTestAI();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (content: string) => {
    if (!content.trim() || isTyping) return;

    const customerMsg: PlaygroundMessage = {
      id: `msg_${Date.now()}`,
      role: "customer",
      content: content.trim(),
      timestamp: new Date().toISOString(),
      platform,
    };

    setMessages((prev) => [...prev, customerMsg]);
    setInput("");
    setIsTyping(true);

    const startTime = Date.now();

    testAI.mutate(
      { message: content.trim(), platform },
      {
        onSuccess: (result: any) => {
          const responseTime = Date.now() - startTime;
          const aiMsg: PlaygroundMessage = {
            id: `msg_${Date.now()}_ai`,
            role: "ai",
            content: result?.data?.response || "Sorry, I couldn't generate a response.",
            timestamp: new Date().toISOString(),
            responseTime,
            personality,
            platform,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsTyping(false);
        },
        onError: () => {
          setIsTyping(false);
          toast.error("AI response failed. Check your AI settings.");
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">AI Chat Playground</h2>
        <p className="text-sm text-muted-foreground">
          Test how your AI agent responds to customers before going live.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat simulator - left 2/3 */}
        <div className="lg:col-span-2">
          <Card className="flex h-[600px] flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-pinga-orange/10">
                  <Bot className="size-4 text-pinga-orange" />
                </div>
                <div>
                  <CardTitle className="text-sm">Pinga AI</CardTitle>
                  <CardDescription className="text-xs">
                    Simulated {platform} conversation
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={personalityColors[personality]}>
                  {personality}
                </Badge>
                <Button variant="ghost" size="icon-sm" onClick={clearChat}>
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 overflow-hidden p-0">
              {/* Messages area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                      <Sparkles className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Start a test conversation</p>
                      <p className="text-xs text-muted-foreground">
                        Type a message or pick a scenario from the right panel
                      </p>
                    </div>
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "mb-3 flex gap-2",
                        msg.role === "customer" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "ai" && (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pinga-orange/10">
                          <Bot className="size-3.5 text-pinga-orange" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3.5 py-2.5",
                          msg.role === "customer"
                            ? "bg-pinga-orange text-white"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.role === "ai" && (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {msg.responseTime && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Clock className="size-3" />
                                {msg.responseTime}ms
                              </span>
                            )}
                            {msg.personality && (
                              <Badge
                                variant="outline"
                                className={cn("h-4 text-[10px] px-1.5", personalityColors[msg.personality])}
                              >
                                {msg.personality}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {msg.role === "customer" && (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                          <User className="size-3.5 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-3 flex items-center gap-2"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pinga-orange/10">
                      <Bot className="size-3.5 text-pinga-orange" />
                    </div>
                    <div className="rounded-2xl bg-muted px-4 py-3">
                      <div className="flex gap-1">
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input area */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a customer message..."
                    className="min-h-[40px] max-h-[100px] resize-none"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isTyping}
                    className="shrink-0 bg-pinga-orange hover:bg-pinga-orange/90"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Config panel - right 1/3 */}
        <div className="flex flex-col gap-4">
          {/* Personality */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Personality</CardTitle>
              <CardDescription className="text-xs">
                How the AI responds to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {personalities.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPersonality(p.value)}
                  className={cn(
                    "rounded-lg border p-2.5 text-left transition-all",
                    personality === p.value
                      ? "border-pinga-orange bg-pinga-orange/5 ring-1 ring-pinga-orange"
                      : "border-border hover:border-pinga-orange/50"
                  )}
                >
                  <p className="text-xs font-medium">{p.label}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {p.description}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Platform */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Platform</CardTitle>
              <CardDescription className="text-xs">
                Simulated messaging platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              {platforms.map((p) => (
                <Button
                  key={p.value}
                  variant={platform === p.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlatform(p.value)}
                  className={cn(
                    "flex-1",
                    platform === p.value && "bg-pinga-orange hover:bg-pinga-orange/90"
                  )}
                >
                  {p.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Test Scenarios */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Test Scenarios</CardTitle>
              <CardDescription className="text-xs">
                Pre-built messages to test common situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="flex flex-col gap-2 pr-3">
                  {testScenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => sendMessage(scenario.message)}
                      disabled={isTyping}
                      className="rounded-lg border border-border p-3 text-left transition-all hover:border-pinga-orange/50 hover:bg-muted/50 disabled:opacity-50"
                    >
                      <p className="text-xs font-medium">{scenario.label}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                        &ldquo;{scenario.message}&rdquo;
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
