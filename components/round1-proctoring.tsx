"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Round1ProctoringProps {
  participantId: string;
  enabled: boolean;
}

export function Round1Proctoring({ participantId, enabled }: Round1ProctoringProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningType, setWarningType] = useState<"fullscreen" | "tab" | null>(null);
  const [violationCount, setViolationCount] = useState(0);
  const lastViolationTime = useRef<Record<string, number>>({});

  const logViolation = useCallback(
    async (type: string, details: string, severity: "warning" | "critical" = "critical") => {
      const now = Date.now();
      const lastTime = lastViolationTime.current[type] || 0;
      if (now - lastTime < 3000) return;
      lastViolationTime.current[type] = now;

      setViolationCount((prev) => prev + 1);
      try {
        await fetch(`/api/participants/${participantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "log_violation", violationType: type, details, severity }),
        });
      } catch (e) {
        console.error("Failed to log violation:", e);
      }
    },
    [participantId]
  );

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setWarningType(null);
    } catch (e) {
      // Fullscreen may be blocked in iframe/embedded contexts — not critical
    }
  }, []);

  // Enter fullscreen when quiz becomes enabled
  useEffect(() => {
    if (!enabled) return;
    const timeout = setTimeout(() => {
      enterFullscreen();
    }, 500);
    return () => clearTimeout(timeout);
  }, [enabled, enterFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    if (!enabled) return;
    const handleFSChange = () => {
      const inFS = !!document.fullscreenElement;
      setIsFullscreen(inFS);
      if (!inFS) {
        setWarningType("fullscreen");
        logViolation(
          "fullscreen_exit",
          "Participant exited fullscreen mode during Round 1. Only this quiz site is permitted — no external applications allowed.",
          "critical"
        );
      }
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, [enabled, logViolation]);

  // Tab visibility change listener
  useEffect(() => {
    if (!enabled) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setWarningType("tab");
        logViolation(
          "tab_switch",
          "Participant switched to another browser tab during Round 1.",
          "critical"
        );
      } else {
        if (warningType === "tab") setWarningType(null);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, logViolation, warningType]);

  // Window blur — switching to another app
  useEffect(() => {
    if (!enabled) return;
    const handleBlur = () => {
      logViolation(
        "window_blur",
        "Participant switched away from the quiz window. Only this quiz site is permitted during Round 1 — no external applications are allowed.",
        "critical"
      );
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [enabled, logViolation]);

  // Keyboard shortcuts — block and log
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Tab / Cmd+Tab
      if ((e.altKey || e.metaKey) && e.key === "Tab") {
        e.preventDefault();
        logViolation("alt_tab", "Participant attempted to switch windows via Alt+Tab / Cmd+Tab.", "critical");
        return;
      }
      // Ctrl/Cmd + T, N, W (new tab / new window / close tab)
      if ((e.ctrlKey || e.metaKey) && ["t", "n", "w"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        logViolation(
          "browser_shortcut",
          `Participant attempted browser shortcut: ${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key.toUpperCase()}`,
          "critical"
        );
        return;
      }
      // Escape key — will trigger fullscreen exit; log proactively
      if (e.key === "Escape") {
        logViolation(
          "escape_key",
          "Participant pressed Escape (attempted to exit fullscreen).",
          "critical"
        );
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [enabled, logViolation]);

  if (!enabled) return null;

  // Fullscreen entry prompt (before fullscreen is active, no violation yet)
  if (!isFullscreen && warningType === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-primary/10">
            <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Fullscreen Required</h1>
            <p className="text-muted-foreground text-sm">
              Round 1 requires fullscreen mode. Only this quiz site is permitted during the exam — no other applications are allowed.
            </p>
          </div>
          <button
            onClick={enterFullscreen}
            className="w-full bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Enter Fullscreen & Begin
          </button>
        </div>
      </div>
    );
  }

  // Violation warning overlay
  if (warningType !== null) {
    const messages = {
      fullscreen: {
        title: "FULLSCREEN VIOLATION",
        body: "You have exited fullscreen mode. This is not permitted during Round 1.",
      },
      tab: {
        title: "TAB SWITCH DETECTED",
        body: "You have switched to another browser tab. This is not permitted during Round 1.",
      },
    };
    const msg = messages[warningType];
    return (
      <div className="fixed inset-0 z-[9999] bg-red-600/95 flex flex-col items-center justify-center p-8 text-white text-center">
        <div className="max-w-lg space-y-6">
          <div className="text-7xl">⚠️</div>
          <div>
            <h1 className="text-3xl font-bold mb-3">{msg.title}</h1>
            <p className="text-lg opacity-90 mb-2">{msg.body}</p>
            <p className="text-sm opacity-80">
              This incident has been recorded and sent to the invigilator. Only this quiz site is permitted during Round 1 — no other applications are allowed.
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
            <span className="text-sm font-medium">Violations recorded this session: {violationCount}</span>
          </div>
          <button
            onClick={enterFullscreen}
            className="w-full bg-white text-red-600 font-bold px-8 py-4 rounded-lg text-lg hover:bg-white/90 transition-colors"
          >
            Return to Fullscreen
          </button>
        </div>
      </div>
    );
  }

  return null;
}
