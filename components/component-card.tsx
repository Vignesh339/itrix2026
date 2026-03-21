"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock, Unlock, Cpu, Copy, Check } from "lucide-react";

interface ComponentCardProps {
  component: {
    id: number;
    name: string;
    description: string;
    pinout: string;
    category: string;
    code_snippet: string;
    is_unlocked?: number;
  };
  participantId: string;
  isLocked: boolean;
  onUnlock: (componentId: number) => Promise<void>;
}

export function ComponentCard({
  component,
  participantId,
  isLocked,
  onUnlock,
}: ComponentCardProps) {
  const [isUnlocked, setIsUnlocked] = useState(!!component.is_unlocked);
  const [snippet, setSnippet] = useState<string | null>(
    component.is_unlocked ? component.code_snippet : null
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUnlock = async () => {
    if (isLocked || isUnlocked) return;

    setLoading(true);
    try {
      const res = await fetch("/api/snippets/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          componentId: component.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsUnlocked(true);
        setSnippet(data.snippet || component.code_snippet);
        await onUnlock(component.id);
      }
    } catch (error) {
      console.error("Failed to unlock snippet:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (snippet) {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium leading-tight">
              {component.name}
            </CardTitle>
          </div>
          <Badge
            variant={isUnlocked ? "default" : "secondary"}
            className="shrink-0 text-xs"
          >
            {isUnlocked ? "Unlocked" : "Locked"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{component.description}</p>

        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Pin Configuration
          </p>
          <p className="text-xs font-mono">{component.pinout}</p>
        </div>

        <Badge variant="outline" className="text-xs">
          {component.category}
        </Badge>

        {isUnlocked && snippet ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Unlock className="mr-2 h-3 w-3" />
                View Code Snippet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  {component.name} - Code Snippet
                </DialogTitle>
              </DialogHeader>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2 z-10"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs max-h-[50vh]">
                  <code>{snippet}</code>
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={handleUnlock}
            disabled={isLocked || loading}
          >
            {loading ? (
              "Unlocking..."
            ) : isLocked ? (
              <>
                <Lock className="mr-2 h-3 w-3" />
                Dashboard Locked
              </>
            ) : (
              <>
                <Lock className="mr-2 h-3 w-3" />
                Unlock Code Snippet
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
