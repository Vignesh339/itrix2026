"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    component_hint_penalty?: number;
    setup_instructions?: string;
    connection_diagram?: string;
    warnings?: string[];
    required_libraries?: string[];
    complexity_level?: "Beginner" | "Intermediate" | "Advanced";
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

  const setupSteps = (component.setup_instructions || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
    <Card className="relative overflow-hidden border-cyan-200/20 bg-slate-950/60 backdrop-blur-lg transition-colors hover:border-cyan-300/45">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10">
              <Cpu className="h-4 w-4 text-cyan-200" />
            </div>
            <CardTitle className="text-sm font-medium leading-tight text-cyan-50">
              {component.name}
            </CardTitle>
          </div>
          <Badge
            variant={isUnlocked ? "default" : "secondary"}
            className={`shrink-0 text-xs ${isUnlocked ? "bg-emerald-400/20 text-emerald-100" : "bg-slate-800 text-cyan-100/80"}`}
          >
            {isUnlocked ? "Unlocked" : "Locked"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-cyan-100/75">{component.description}</p>

        <div className="rounded-lg border border-cyan-200/15 bg-slate-900/55 p-3">
          <p className="mb-1 text-xs font-medium text-cyan-100/70">
            Pin Configuration
          </p>
          <p className="text-xs font-mono text-cyan-50">{component.pinout}</p>
        </div>

        <Badge variant="outline" className="text-xs border-cyan-200/30 text-cyan-100">
          {component.category}
        </Badge>
        {typeof component.component_hint_penalty === "number" && (
          <Badge variant="outline" className="text-xs border-amber-300/35 text-amber-100">
            Penalty on access: {component.component_hint_penalty}
          </Badge>
        )}

        {isUnlocked && snippet ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full border-cyan-300/30 bg-slate-900/60 hover:bg-slate-900/80">
                <Unlock className="mr-2 h-3 w-3" />
                View Code Snippet
              </Button>
            </DialogTrigger>
              <DialogContent className="max-h-[92vh] w-[96vw] max-w-[96vw] sm:!max-w-[96vw] xl:!max-w-6xl overflow-hidden border-cyan-200/20 bg-slate-950/95 text-cyan-50">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  {component.name} - Component Reference
                </DialogTitle>
                <DialogDescription>
                  Review the original component code first, then follow the documentation checklist.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
                <div className="relative min-h-0 rounded-lg border border-cyan-200/20 bg-slate-900/90 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-cyan-100">Original Component Code</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-300/30 bg-slate-800/70"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <pre className="max-h-[60vh] overflow-auto rounded-md border border-cyan-200/20 bg-slate-950 p-3 text-xs leading-relaxed text-cyan-100">
                    <code>{snippet}</code>
                  </pre>
                </div>

                <div className="min-h-0 space-y-3 rounded-lg border border-cyan-200/20 bg-slate-900/60 p-4">
                  <h4 className="text-sm font-semibold text-cyan-100">Component Documentation</h4>
                  <div className="max-h-[60vh] space-y-3 overflow-auto pr-1 text-xs leading-relaxed text-cyan-100/90">
                    {component.complexity_level ? (
                      <p><span className="font-semibold">Complexity:</span> {component.complexity_level}</p>
                    ) : null}

                    <p><span className="font-semibold">Description:</span> {component.description}</p>
                    <p className="break-words"><span className="font-semibold">Pin Configuration:</span> {component.pinout}</p>

                    {component.required_libraries && component.required_libraries.length > 0 ? (
                      <p><span className="font-semibold">Libraries:</span> {component.required_libraries.join(", ")}</p>
                    ) : null}

                    {component.connection_diagram ? (
                      <p className="break-words"><span className="font-semibold">Connection Diagram:</span> {component.connection_diagram}</p>
                    ) : null}

                    {setupSteps.length > 0 ? (
                      <div className="space-y-1">
                        <p className="font-semibold">Setup Steps</p>
                        <ul className="list-disc space-y-1 pl-4">
                          {setupSteps.map((step, index) => (
                            <li key={`${component.id}-setup-${index}`}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {component.warnings && component.warnings.length > 0 ? (
                      <div className="space-y-1">
                        <p className="font-semibold text-amber-200">Warnings</p>
                        <ul className="list-disc space-y-1 pl-4 text-amber-100">
                          {component.warnings.map((warning, index) => (
                            <li key={`${component.id}-warn-${index}`}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
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
                Unlock Starter Hint Pack
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
