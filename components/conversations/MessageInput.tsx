"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { QuickReplyPicker } from "./QuickReplyPicker";
import { ProductShareCard } from "./ProductShareCard";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = 4 * 24; // ~4 rows
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  const handleQuickReply = (content: string) => {
    setMessage(content);
    textareaRef.current?.focus();
  };

  const handleProductShare = (product: { name: string; price: number }) => {
    const msg = `Check out this product: ${product.name} - NGN ${product.price.toLocaleString()}`;
    onSend(msg);
  };

  return (
    <div className="shrink-0 border-t border-border bg-background p-3">
      {/* Textarea */}
      <div className="mb-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={
            disabled
              ? "Select a conversation to start messaging..."
              : "Type a message..."
          }
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
            "outline-none transition-colors placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            title="Attach file"
            disabled={disabled}
          >
            <Paperclip className="size-4" />
          </Button>

          {!disabled && (
            <>
              <QuickReplyPicker onSelect={handleQuickReply} />
              <ProductShareCard onShareProduct={handleProductShare} />
            </>
          )}
        </div>

        <Button
          size="sm"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
        >
          <Send className="mr-1.5 size-3.5" />
          Send
        </Button>
      </div>
    </div>
  );
}
