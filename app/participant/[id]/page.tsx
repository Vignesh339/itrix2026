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
import {
  User,
  Cpu,
  Unlock,
  AlertTriangle,
  Lock,
  Activity,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  scenario_id: number | null;
  timer_duration: number;
  timer_started_at: string | null;
  is_active: number;
  is_locked: number;
  scenario_title: string | null;
  situation: string | null;
  what_to_build: string | null;
  snippets_unlocked: number;
  violation_count: number;
}

interface Component {
  id: number;
  name: string;
  description: string;
  pinout: string;
  category: string;
  code_snippet: string;
  is_unlocked: number;
}

interface UnlockedSnippet {
  id: number;
  participant_id: string;
  component_id: number;
  unlocked_at: string;
  component_name: string;
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
  const [violationCount, setViolationCount] = useState(0);

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
      setViolationCount(data.participant.violation_count);
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
      
      // Log login activity
      await fetch(`/api/participants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "log_activity",
          eventType: "login",
          details: "Participant logged into dashboard",
        }),
      });
    };
    
    initializeParticipant();
  }, [id, fetchData]);
  
  // Auto-start timer when participant has a scenario but timer hasn't started
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
          // Refetch to get updated timer state
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
        body: JSON.stringify({ action: "lock" }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to lock dashboard:", error);
    }
  }, [id, fetchData]);

  const handleUnlock = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleViolation = useCallback(() => {
    setViolationCount((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
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

  if (!participant.scenario_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome, {participant.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert>
              <Activity className="h-4 w-4" />
              <AlertTitle>Waiting for Assignment</AlertTitle>
              <AlertDescription>
                Your scenario has not been assigned yet. Please wait for the
                admin to assign you a scenario.
              </AlertDescription>
            </Alert>
            <p className="mt-4 text-sm text-muted-foreground">
              Your ID: <span className="font-mono font-medium">{participant.id}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ViolationTracker
        participantId={id}
        enabled={!isLocked && !!participant.timer_started_at}
        onViolation={handleViolation}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold">{participant.name}</h1>
                <p className="text-xs text-muted-foreground">ID: {participant.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Unlock className="h-3 w-3" />
                  {unlockedSnippets.length} Unlocked
                </Badge>
                {violationCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {violationCount} Violations
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Timer */}
      <div className="container mx-auto px-4 py-4">
        <Timer
          startedAt={participant.timer_started_at}
          duration={participant.timer_duration}
          onTimeUp={handleTimeUp}
          isLocked={isLocked}
        />
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
          <TabsList className="grid w-full grid-cols-3 max-w-md">
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
              />
            )}
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Your Component Kit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  These are the components assigned to your scenario. Click
                  &quot;Unlock Code Snippet&quot; to reveal the Arduino code for each
                  component.
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Unlock className="h-5 w-5" />
                  Unlocked Snippets ({unlockedSnippets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unlockedSnippets.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    You haven&apos;t unlocked any code snippets yet. Go to the
                    Components tab to unlock snippets.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {unlockedSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
                            <Cpu className="h-4 w-4 text-chart-2" />
                          </div>
                          <span className="font-medium text-sm">
                            {snippet.component_name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
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
