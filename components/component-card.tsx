"use client";

import { useMemo, useState } from "react";
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
    estimated_setup_time?: number;
    default_pins?: Record<string, string | number>;
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
  const detailedDescription = useMemo(() => {
    const parts: string[] = [component.description.trim()];

    parts.push(`This component belongs to the ${component.category} category and is intended for practical Round 2 scenario implementation.`);

    if (component.setup_instructions) {
      const workflow = component.setup_instructions
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 6)
        .join(" ");
      parts.push(`Typical workflow: ${workflow}`);
    }

    if (component.complexity_level) {
      parts.push(`Complexity level: ${component.complexity_level}.`);
    }

    if (component.estimated_setup_time) {
      parts.push(`Typical preparation time is around ${component.estimated_setup_time} minutes before integration and testing.`);
    }

    if (component.required_libraries && component.required_libraries.length > 0) {
      parts.push(`Commonly used Arduino libraries: ${component.required_libraries.join(", ")}.`);
    }

    if (component.warnings && component.warnings.length > 0) {
      parts.push(`Important notes: ${component.warnings.join(" ")}`);
    }

    return parts.join("\n\n");
  }, [component.category, component.complexity_level, component.description, component.estimated_setup_time, component.required_libraries, component.warnings]);

  const fallbackSnippet = useMemo(() => {
    const pinEntries = Object.entries(component.default_pins || {}).slice(0, 5);
    const constLines = pinEntries
      .map(([label, value]) => {
        if (typeof value !== "number") return null;
        const normalized = label.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
        return `const int ${normalized || "PIN"}_PIN = ${value};`;
      })
      .filter(Boolean)
      .join("\n");

    return `// ${component.name} - Starter Snippet
${constLines}

void setup() {
  Serial.begin(9600);
  // TODO: set pinMode(...) as needed
}

void loop() {
  // TODO: implement ${component.name.toLowerCase()} logic
}`;
  }, [component.default_pins, component.name]);

  const [isUnlocked, setIsUnlocked] = useState(!!component.is_unlocked);
  const [snippet, setSnippet] = useState<string | null>(
    component.is_unlocked ? (component.code_snippet || fallbackSnippet) : null
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const effectiveSnippet = (snippet && snippet.trim())
    ? snippet
    : (component.code_snippet && component.code_snippet.trim())
      ? component.code_snippet
      : fallbackSnippet;

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
        setSnippet(data.snippet || component.code_snippet || fallbackSnippet);
        await onUnlock(component.id);
      }
    } catch (error) {
      console.error("Failed to unlock snippet:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(effectiveSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <div className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-4 shadow-inner shadow-cyan-950/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">
            Detailed Description
          </p>
          <div className="space-y-3 text-xs">
            <div className="rounded-lg border border-cyan-200/15 bg-slate-900/55 p-3">
              <div className="max-h-44 overflow-y-auto pr-1">
                <p className="text-sm leading-relaxed text-cyan-100/85 whitespace-pre-wrap">{detailedDescription}</p>
              </div>
            </div>
          </div>
        </div>

        <Badge variant="outline" className="text-xs border-cyan-200/30 text-cyan-100">
          {component.category}
        </Badge>
        {component.complexity_level && (
          <Badge variant="outline" className="text-xs border-violet-300/35 text-violet-100">
            Complexity: {component.complexity_level}
          </Badge>
        )}
        {component.estimated_setup_time && (
          <Badge variant="outline" className="text-xs border-cyan-300/35 text-cyan-100">
            Setup: ~{component.estimated_setup_time} min
          </Badge>
        )}
        {typeof component.component_hint_penalty === "number" && (
          <Badge variant="outline" className="text-xs border-amber-300/35 text-amber-100">
            Penalty on access: {component.component_hint_penalty}
          </Badge>
        )}

        {isUnlocked ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Unlock className="mr-2 h-3 w-3" />
                View Code Snippet
              </Button>
            </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl border-cyan-200/20 bg-slate-950/95 text-cyan-50">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  {component.name} - Starter Guidance Pack
                </DialogTitle>
                <DialogDescription>
                  Use this as a basic reference. Final implementation logic must be written by the participant.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-xs text-cyan-100/85 md:grid-cols-2">
                <div className="rounded-lg border border-cyan-200/20 bg-slate-900/70 p-3">
                  <p className="mb-2 font-semibold text-cyan-100">Detailed Description</p>
                  <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    <p className="leading-relaxed whitespace-pre-wrap">{detailedDescription}</p>
                    {component.complexity_level && <p>Complexity: {component.complexity_level}</p>}
                    {component.estimated_setup_time && <p>Setup Time: ~{component.estimated_setup_time} min</p>}
                    {component.required_libraries && component.required_libraries.length > 0 && (
                      <p>Libraries: {component.required_libraries.join(", ")}</p>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-3">
                  <p className="mb-2 font-semibold text-amber-100">Warnings</p>
                  {component.warnings && component.warnings.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-4 text-amber-100/90">
                      {component.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-amber-100/80">No critical warnings listed.</p>
                  )}
                </div>
              </div>
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
                <pre className="max-h-[50vh] overflow-auto rounded-lg border border-cyan-200/20 bg-slate-900 p-4 text-xs text-cyan-100">
                  <code>{effectiveSnippet}</code>
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
                Unlock Starter Hint Pack
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
