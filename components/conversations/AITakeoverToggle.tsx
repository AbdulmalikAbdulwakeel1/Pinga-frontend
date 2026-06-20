"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface AITakeoverToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  compact?: boolean;
}

export function AITakeoverToggle({
  enabled,
  onToggle,
  compact = false,
}: AITakeoverToggleProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggle = (checked: boolean) => {
    if (!checked) {
      setShowConfirm(true);
    } else {
      onToggle(true);
    }
  };

  const confirmDisable = () => {
    onToggle(false);
    setShowConfirm(false);
  };

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onCheckedChange={handleToggle} size="sm" />
          <Bot
            className={cn(
              "size-3.5",
              enabled ? "text-emerald-500" : "text-muted-foreground"
            )}
          />
        </div>

        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disable AI Auto-Reply?</DialogTitle>
              <DialogDescription>
                The AI will stop responding to this conversation. You will need
                to manually reply to all incoming messages.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDisable}>
                Disable AI
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              enabled ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-muted"
            )}
          >
            <Bot
              className={cn(
                "size-4",
                enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              )}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">AI Auto-Reply</span>
            <span className="text-xs text-muted-foreground">
              {enabled ? (
                <span className="flex items-center gap-1">
                  <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                  AI is handling this conversation
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className="inline-block size-1.5 rounded-full bg-muted-foreground" />
                  Manual mode
                </span>
              )}
            </span>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable AI Auto-Reply?</DialogTitle>
            <DialogDescription>
              The AI will stop responding to this conversation. You will need to
              manually reply to all incoming messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDisable}>
              Disable AI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
