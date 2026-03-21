"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";

interface TimerProps {
  startedAt: string | null;
  duration: number;
  onTimeUp: () => void;
  isLocked: boolean;
}

export function Timer({ startedAt, duration, onTimeUp, isLocked }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const calculateTimeRemaining = useCallback(() => {
    if (!startedAt) return null;

    const start = new Date(startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);
    const remaining = duration - elapsed;

    return Math.max(0, remaining);
  }, [startedAt, duration]);

  useEffect(() => {
    if (!startedAt || isLocked) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining !== null && remaining <= 0) {
        onTimeUp();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startedAt, isLocked, calculateTimeRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining === null) return "text-muted-foreground";
    if (timeRemaining <= 60) return "text-destructive";
    if (timeRemaining <= 300) return "text-chart-5";
    return "text-chart-2";
  };

  const getBackgroundColor = () => {
    if (timeRemaining === null) return "bg-muted";
    if (timeRemaining <= 60) return "bg-destructive/10 border-destructive/30";
    if (timeRemaining <= 300) return "bg-chart-5/10 border-chart-5/30";
    return "bg-chart-2/10 border-chart-2/30";
  };

  if (isLocked) {
    return (
      <Card className="bg-destructive/10 border-destructive/30">
        <CardContent className="flex items-center justify-center gap-3 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="text-lg font-bold text-destructive">
            TIME EXPIRED - DASHBOARD LOCKED
          </span>
        </CardContent>
      </Card>
    );
  }

  if (!startedAt) {
    return (
      <Card className="bg-muted">
        <CardContent className="flex items-center justify-center gap-3 p-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-medium text-muted-foreground">
            Timer not started
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border ${getBackgroundColor()}`}>
      <CardContent className="flex items-center justify-center gap-3 p-4">
        <Clock className={`h-5 w-5 ${getTimerColor()}`} />
        <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
        </span>
        {timeRemaining !== null && timeRemaining <= 300 && timeRemaining > 0 && (
          <span className="text-sm text-muted-foreground">remaining</span>
        )}
      </CardContent>
    </Card>
  );
}
