"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Timer } from "@/components/timer";
import { ScenarioDisplay } from "@/components/scenario-display";
import { ComponentCard } from "@/components/component-card";
import { ViolationTracker } from "@/components/violation-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  Cpu,
  Unlock,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Send,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  scenario_id: number | null;
  timer_duration: number;
  timer_started_at: string | null;
  is_active: number;
  is_locked: number;
  round2_completed: boolean;
  scenario_title: string | null;
  situation: string | null;
  what_to_build: string | null;
  snippets_unlocked: number;
  violation_count: number;
  round2_hint_count?: number;
  round2_hint_penalty?: number;
  round2_score?: number;
}

interface Component {
  id: number;
  name: string;
  description: string;
  pinout: string;
  category: string;
  code_snippet: string;
  is_unlocked: number;
  component_hint_penalty?: number;
  setup_instructions?: string;
  connection_diagram?: string;
  warnings?: string[];
  required_libraries?: string[];
  complexity_level?: "Beginner" | "Intermediate" | "Advanced";
}

interface UnlockedSnippet {
  id: number;
  participant_id: string;
  component_id: number;
  unlocked_at: string;
  component_name: string;
}

interface Round2HintSummary {
  baseScore: number;
  maxPenalty: number;
  totalPenalty: number;
  finalScore: number;
  hintsUsedCount: number;
  totalComponents: number;
}

export default function ParticipantDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [unlockedSnippets, setUnlockedSnippets] = useState<UnlockedSnippet[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [round2HintSummary, setRound2HintSummary] = useState<Round2HintSummary | null>(null);
  const [violationCount, setViolationCount] = useState(0);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reEntryWarning, setReEntryWarning] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/participants/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Participant not found");
          return;
        }
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      setParticipant(data.participant);
      setComponents(data.components);
      setUnlockedSnippets(data.unlockedSnippets);
      setRound2HintSummary(data.round2HintSummary || null);
    } catch (err) {
      setError("Failed to load dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const initializeParticipant = async () => {
      await fetchData();

      // Re-entry detection:
      // We use a window-level flag (resets on full page navigation but survives
      // React's StrictMode double-mount) combined with sessionStorage (persists
      // across navigations within the same browser session).
      //
      // window.__iotInit[id] = true  → this JS instance has already run the
      //   check, so skip (handles StrictMode's second effect run).
      // sessionStorage[key] exists   → participant has visited before in this
      //   browser session (genuine re-entry after navigating away).
      const win = window as any;
      if (!win.__iotInit) win.__iotInit = {};

      if (!win.__iotInit[id]) {
        win.__iotInit[id] = true;

        const sessionKey = `iot_session_${id}`;
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const isReload = navEntry?.type === "reload";

        if (sessionStorage.getItem(sessionKey) && !isReload) {
          setReEntryWarning(true);
          fetch(`/api/participants/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "log_violation",
              violationType: "re_entry",
              details: "Participant navigated away and re-entered the dashboard.",
              severity: "critical",
            }),
          }).catch(() => {});
        } else {
          sessionStorage.setItem(sessionKey, "active");
        }
      }

      fetch(`/api/participants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "log_activity",
          eventType: "login",
          details: "Participant logged into dashboard",
        }),
      }).catch(() => {});
    };

    initializeParticipant();
  }, [id, fetchData]);

  // Log navigation-away when participant leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const blob = new Blob(
        [JSON.stringify({
          action: "log_violation",
          violationType: "navigation_away",
          details: "Participant navigated away from the dashboard.",
          severity: "critical",
        })],
        { type: "application/json" }
      );
      navigator.sendBeacon(`/api/participants/${id}`, blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [id]);
  
  useEffect(() => {
    const autoStartTimer = async () => {
      if (participant && participant.scenario_id && !participant.timer_started_at && !participant.is_locked) {
        try {
          await fetch(`/api/participants/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "start_timer",
              duration: participant.timer_duration || 3600,
            }),
          });
          fetchData();
        } catch (error) {
          console.error("Failed to auto-start timer:", error);
        }
      }
    };
    
    autoStartTimer();
  }, [participant, id, fetchData]);

  const handleTimeUp = useCallback(async () => {
    try {
      await fetch(`/api/participants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete_round2" }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to lock dashboard:", error);
    }
  }, [id, fetchData]);

  const handleFinalSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      await fetch(`/api/participants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete_round2" }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
      setSubmitDialogOpen(false);
    }
  }, [id]);

  const handleUnlock = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleViolation = useCallback(() => {
    setViolationCount((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <div className="iot-grid-overlay" />
        <Card className="w-full max-w-xl border-cyan-200/20 bg-slate-950/70 backdrop-blur-lg">
          <CardContent className="space-y-4 p-6 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-300 border-t-transparent mx-auto" />
            <p className="text-cyan-100/80">Loading Round 2 dashboard...</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md border border-cyan-200/20 bg-slate-900/55 px-3 py-2 text-cyan-100/70">Syncing profile</div>
              <div className="rounded-md border border-cyan-200/20 bg-slate-900/55 px-3 py-2 text-cyan-100/70">Fetching scenario</div>
              <div className="rounded-md border border-cyan-200/20 bg-slate-900/55 px-3 py-2 text-cyan-100/70">Loading components</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <div className="iot-grid-overlay" />
        <Card className="w-full max-w-md border-cyan-200/20 bg-slate-950/75 backdrop-blur-lg">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || "Participant not found"}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLocked = !!participant.is_locked;

  // Submission complete screen
  if (submitted) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
        <div className="iot-grid-overlay" />
        <Card className="w-full max-w-lg border-cyan-200/20 bg-slate-950/75 text-center backdrop-blur-lg">
          <CardContent className="space-y-6 pb-10 pt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/35 bg-emerald-300/10">
              <CheckCircle2 className="h-9 w-9 text-emerald-300" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-cyan-50">Submission Received</h1>
              <p className="text-cyan-100/75">
                Your Round 2 work has been submitted successfully.
              </p>
            </div>
            <Alert className="border-amber-300/35 bg-amber-300/10 text-left text-amber-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Your Participant ID is no longer valid. Please return your device to the invigilator.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-cyan-100/70">
              Participant ID: <span className="font-mono font-semibold text-cyan-50">{id}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!participant.scenario_id) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
        <div className="iot-grid-overlay" />
        <Card className="w-full max-w-lg border-cyan-200/20 bg-slate-950/75 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/10">
              <User className="h-6 w-6 text-cyan-200" />
            </div>
            <CardTitle className="text-2xl text-cyan-50">Welcome, {participant.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert className="border-cyan-200/25 bg-slate-900/65 text-cyan-100">
              <Activity className="h-4 w-4" />
              <AlertTitle>Waiting for Assignment</AlertTitle>
              <AlertDescription>
                Your scenario has not been assigned yet. Please wait for the
                admin to assign you a scenario.
              </AlertDescription>
            </Alert>
            <p className="mt-4 text-sm text-cyan-100/70">
              Your ID: <span className="font-mono font-medium text-cyan-50">{participant.id}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="iot-grid-overlay" />
      <ViolationTracker
        participantId={id}
        enabled={!isLocked && !!participant.timer_started_at}
        mode="round2"
        onViolation={handleViolation}
      />

      {/* Re-entry warning banner */}
      {reEntryWarning && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="font-semibold text-sm">
              VIOLATION RECORDED — You navigated away and re-entered this page.{" "}
              <span className="font-normal opacity-90">
                Leaving the competition dashboard is not permitted. This incident has been logged.
              </span>
            </span>
          </div>
          <button
            onClick={() => setReEntryWarning(false)}
            className="text-destructive-foreground/70 hover:text-destructive-foreground text-xs underline shrink-0 ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Confirm Submit Dialog */}
      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Round 2?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to finish Round 2. Your work will be submitted and you will not be able to make any further changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {submitting ? "Submitting..." : "Yes, Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-200/15 bg-slate-950/85 backdrop-blur supports-[backdrop-filter]:bg-slate-950/70">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300/10">
                <User className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <h1 className="font-semibold text-cyan-50">{participant.name}</h1>
                <p className="text-xs text-cyan-100/70">ID: {participant.id} • Round 2 Practical Exam</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 border-cyan-200/30 text-cyan-100">
                  <Unlock className="h-3 w-3" />
                  {unlockedSnippets.length} Unlocked
                </Badge>
                {round2HintSummary && (
                  <Badge variant="outline" className="gap-1 border-amber-300/35 bg-amber-300/10 text-amber-100">
                    <AlertTriangle className="h-3 w-3" />
                    Hint Packs Used: {round2HintSummary.hintsUsedCount}/{round2HintSummary.totalComponents} | Penalty: {round2HintSummary.totalPenalty}/{round2HintSummary.maxPenalty}
                  </Badge>
                )}
              </div>
              {!isLocked && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={() => setSubmitDialogOpen(true)}
                >
                  <Send className="h-4 w-4" />
                  Final Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Timer */}
      <div className="container mx-auto px-4 py-4">
        <Card className="border-cyan-200/20 bg-slate-950/60 shadow-[0_18px_45px_-30px_rgba(0,220,255,0.35)] backdrop-blur-lg">
          <CardContent className="p-4">
            <Timer
              startedAt={participant.timer_started_at}
              duration={participant.timer_duration}
              onTimeUp={handleTimeUp}
              isLocked={isLocked}
            />
          </CardContent>
        </Card>
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="container mx-auto px-4 pb-4">
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertTitle>Dashboard Locked</AlertTitle>
            <AlertDescription>
              Your time has expired. The dashboard is now locked and no further
              actions can be taken.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className={`container mx-auto px-4 pb-8 ${isLocked ? "opacity-50 pointer-events-none" : ""}`}>
        <Tabs defaultValue="scenario" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 border border-cyan-200/20 bg-slate-950/70 p-1">
            <TabsTrigger value="scenario">Scenario</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          </TabsList>

          <TabsContent value="scenario" className="space-y-6">
            {participant.scenario_title && participant.situation && participant.what_to_build && (
              <ScenarioDisplay
                title={participant.scenario_title}
                situation={participant.situation}
                whatToBuild={participant.what_to_build}
                hintSummary={round2HintSummary}
              />
            )}
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card className="border-cyan-200/20 bg-slate-950/60 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-50">
                  <Cpu className="h-5 w-5" />
                  Your Component Kit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-sm text-cyan-100/75">
                  These are the components assigned to your scenario. Click
                  &quot;Unlock Starter Hint Pack&quot; to access basic code plus component documentation. Hint usage is tracked for your submission.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {components.map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      participantId={id}
                      isLocked={isLocked}
                      onUnlock={handleUnlock}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unlocked" className="space-y-6">
            <Card className="border-cyan-200/20 bg-slate-950/60 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-50">
                  <Unlock className="h-5 w-5" />
                  Unlocked Snippets ({unlockedSnippets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unlockedSnippets.length === 0 ? (
                  <p className="py-8 text-center text-sm text-cyan-100/70">
                    You haven&apos;t unlocked any code snippets yet. Go to the
                    Components tab to unlock snippets.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {unlockedSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="flex items-center justify-between rounded-lg border border-cyan-200/20 bg-slate-900/55 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/35 bg-cyan-300/10">
                            <Cpu className="h-4 w-4 text-cyan-200" />
                          </div>
                          <span className="text-sm font-medium text-cyan-50">
                            {snippet.component_name}
                          </span>
                        </div>
                        <span className="text-xs text-cyan-100/65">
                          {new Date(snippet.unlocked_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
