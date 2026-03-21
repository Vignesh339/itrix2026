"use client";

import { useEffect, useCallback, useRef } from "react";

// Whitelisted applications that are allowed during the competition
const WHITELISTED_APPS = [
  "Arduino IDE",
  "Visual Studio Code", 
  "Code",
  "Notepad++",
  "Code::Blocks",
  "PlatformIO",
  "Thonny",
  "IDLE",
];

interface ViolationTrackerProps {
  participantId: string;
  enabled: boolean;
  onViolation: (type: string, details: string, severity?: string) => void;
}

export function ViolationTracker({
  participantId,
  enabled,
  onViolation,
}: ViolationTrackerProps) {
  const lastViolationTime = useRef<number>(0);
  const lastViolationType = useRef<string>("");

  const logViolation = useCallback(
    async (
      type: string, 
      details: string, 
      severity: "permitted" | "warning" | "critical" = "warning"
    ) => {
      // Debounce violations (min 2 seconds apart for same type)
      const now = Date.now();
      if (now - lastViolationTime.current < 2000 && lastViolationType.current === type) return;
      lastViolationTime.current = now;
      lastViolationType.current = type;

      try {
        await fetch(`/api/participants/${participantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "log_violation",
            violationType: type,
            details,
            severity,
          }),
        });
        onViolation(type, details, severity);
      } catch (error) {
        console.error("Failed to log violation:", error);
      }
    },
    [participantId, onViolation]
  );

  useEffect(() => {
    if (!enabled) return;

    // Tab visibility change - CRITICAL violation (switching browser tabs)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation(
          "tab_switch", 
          "User switched to another browser tab", 
          "critical"
        );
      }
    };

    // Window blur - Check if it's a whitelisted app or suspicious
    // Note: Browser cannot detect which app gained focus, so window blur
    // is logged as a WARNING (not critical) to allow IDE usage
    const handleBlur = () => {
      // Window blur happens when user clicks outside browser
      // This could be Arduino IDE (allowed) or something else
      // We log it as a warning - admin can review
      logViolation(
        "window_blur", 
        "User focus left browser window (may be using local IDE)", 
        "warning"
      );
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation(
          "fullscreen_exit", 
          "User exited fullscreen mode", 
          "warning"
        );
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect suspicious key combinations - CRITICAL
      if (e.altKey && e.key === "Tab") {
        logViolation(
          "alt_tab", 
          "User pressed Alt+Tab to switch windows", 
          "critical"
        );
      }
      // Ctrl+T (new tab), Ctrl+N (new window), Ctrl+W (close tab) - CRITICAL
      if (e.ctrlKey && (e.key === "t" || e.key === "n" || e.key === "w")) {
        e.preventDefault();
        logViolation(
          "browser_shortcut", 
          `User pressed Ctrl+${e.key.toUpperCase()} (browser navigation)`, 
          "critical"
        );
      }
      // Ctrl+C, Ctrl+V in certain contexts could be suspicious
      // But we allow them for code editing - don't log
    };

    // Right-click context menu - WARNING
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click but log it as a warning
      logViolation(
        "context_menu",
        "User opened context menu",
        "warning"
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);
    // Optionally track context menu - uncomment if needed
    // document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
      // document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, logViolation]);

  return null;
}
