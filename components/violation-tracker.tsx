"use client";

import { useEffect, useCallback, useRef } from "react";

interface ViolationTrackerProps {
  participantId: string;
  enabled: boolean;
  onViolation: (type: string, details: string) => void;
}

export function ViolationTracker({
  participantId,
  enabled,
  onViolation,
}: ViolationTrackerProps) {
  const lastViolationTime = useRef<number>(0);

  const logViolation = useCallback(
    async (type: string, details: string) => {
      // Debounce violations (min 2 seconds apart)
      const now = Date.now();
      if (now - lastViolationTime.current < 2000) return;
      lastViolationTime.current = now;

      try {
        await fetch(`/api/participants/${participantId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "log_violation",
            violationType: type,
            details,
          }),
        });
        onViolation(type, details);
      } catch (error) {
        console.error("Failed to log violation:", error);
      }
    },
    [participantId, onViolation]
  );

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation("tab_switch", "User switched to another tab");
      }
    };

    const handleBlur = () => {
      logViolation("window_blur", "User clicked outside the window");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation("fullscreen_exit", "User exited fullscreen mode");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect suspicious key combinations
      if (e.altKey && e.key === "Tab") {
        logViolation("alt_tab", "User pressed Alt+Tab");
      }
      if (e.ctrlKey && (e.key === "t" || e.key === "n" || e.key === "w")) {
        logViolation("ctrl_key", `User pressed Ctrl+${e.key.toUpperCase()}`);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, logViolation]);

  return null;
}
