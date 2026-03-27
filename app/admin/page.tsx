"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { Round1Management } from "@/components/round1-management";
import { Round1QuestionManager } from "@/components/round1-question-manager";
import {
  Users,
  Plus,
  Play,
  Pause,
  Lock,
  Unlock,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Activity,
  Database,
  Cpu,
  Settings,
  Clock,
  Eye,
  Home,
  KeyRound,
  Download,
  Trophy,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Participant {
  id: string;
  name: string;
  member1_name?: string;
  member1_phone?: string;
  member1_email?: string;
  member1_college?: string;
  member1_department?: string;
  member1_year?: string;
  member2_name?: string;
  member2_phone?: string;
  member2_email?: string;
  member2_college?: string;
  member2_department?: string;
  member2_year?: string;
  member3_name?: string;
  member3_phone?: string;
  member3_email?: string;
  member3_college?: string;
  member3_department?: string;
  member3_year?: string;
  team_name?: string;
  assigned_round?: 'round1' | 'round2' | null;
  college?: string;
  department?: string;
  scenario_id: number | null;
  timer_duration: number;
  timer_started_at: string | null;
  is_active: number;
  is_locked: number;
  created_at: string;
  scenario_title: string | null;
  snippets_unlocked: number;
  violation_count: number;
  round2_score?: number;
  round2_hint_count?: number;
  round2_hint_penalty?: number;
}

interface Scenario {
  id: number;
  title: string;
  team_number: number;
}

interface ActivityLog {
  id: number;
  participant_id: string;
  participant_name: string;
  event_type: string;
  details: string;
  created_at: string;
}

interface Violation {
  id: number;
  participant_id: string;
  participant_name: string;
  violation_type: string;
  severity?: "permitted" | "warning" | "critical";
  app_name?: string;
  details: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    member1Name: "",
    member2Name: "",
    member3Name: "",
    member1Phone: "",
    member1Email: "",
    member1Year: "",
    member1College: "",
    member1Department: "",
    member2Phone: "",
    member2Email: "",
    member2Year: "",
    member2College: "",
    member2Department: "",
    member3Phone: "",
    member3Email: "",
    member3Year: "",
    member3College: "",
    member3Department: "",
    teamName: "",
    id: "",
    assignedRound: "round2" as 'round1' | 'round2',
  });
  const [createdParticipant, setCreatedParticipant] = useState<{ id: string; scenario: string } | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [timerDuration, setTimerDuration] = useState("120");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [globalTimerDuration, setGlobalTimerDuration] = useState("120");
  const [newViolationAlert, setNewViolationAlert] = useState<{ participant: string; type: string; time: string } | null>(null);
  const [leaderboardPublicEnabled, setLeaderboardPublicEnabled] = useState(false);
  const [updatingLeaderboard, setUpdatingLeaderboard] = useState(false);
  const lastViolationIdRef = useRef<number>(0);
  
  // Check for existing admin session and redirect if already authenticated
  useEffect(() => {
    const adminSession = sessionStorage.getItem("admin_authenticated");
    if (adminSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !initialized) {
      // Keep user authenticated during navigation
      sessionStorage.setItem("admin_authenticated", "true");
    }
  }, [isAuthenticated, initialized]);

  const { data: initStatus, mutate: checkInit } = useSWR("/api/init", fetcher, {
    refreshInterval: 0,
  });

  const {
    data: participantsData,
    mutate: refreshParticipants,
    isLoading: participantsLoading,
  } = useSWR(initialized ? "/api/participants" : null, fetcher, {
    refreshInterval: 3000,
  });

  const { data: scenariosData } = useSWR(
    initialized ? "/api/scenarios" : null,
    fetcher
  );

  const { data: logsData, mutate: refreshLogs } = useSWR(
    initialized ? "/api/logs" : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const { data: violationsData, mutate: refreshViolations } = useSWR(
    initialized ? "/api/logs?type=violations" : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const { data: timerData, mutate: refreshTimer } = useSWR(
    initialized ? "/api/admin/timer" : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const { data: leaderboardData, mutate: refreshLeaderboard } = useSWR(
    initialized ? "/api/admin/leaderboard" : null,
    fetcher,
    { refreshInterval: 0 }
  );

  useEffect(() => {
    if (initStatus?.initialized) {
      setInitialized(true);
    }
  }, [initStatus]);

  useEffect(() => {
    const bootstrapAdmin = async () => {
      if (!isAuthenticated || initialized || initializing) return;

      if (initStatus?.initialized) {
        setInitialized(true);
        return;
      }

      setInitializing(true);
      try {
        const res = await fetch("/api/init", { method: "POST" });
        if (res.ok) {
          setInitialized(true);
          checkInit();
        }
      } catch (error) {
        console.error("Failed to initialize admin data:", error);
      } finally {
        setInitializing(false);
      }
    };

    bootstrapAdmin();
  }, [isAuthenticated, initialized, initializing, initStatus, checkInit]);

  useEffect(() => {
    if (timerData?.minutes) {
      setGlobalTimerDuration(timerData.minutes.toString());
    }
  }, [timerData]);

  useEffect(() => {
    if (typeof leaderboardData?.enabled === "boolean") {
      setLeaderboardPublicEnabled(leaderboardData.enabled);
    }
  }, [leaderboardData]);

  // Real-time violation alert: fire when new violations arrive via polling
  useEffect(() => {
    if (!violationsData?.violations?.length) return;
    const latest = violationsData.violations[0];
    if (latest && latest.id !== lastViolationIdRef.current) {
      if (lastViolationIdRef.current !== 0) {
        // A new violation arrived since we last checked
        setNewViolationAlert({
          participant: latest.participant_name || latest.participant_id,
          type: latest.violation_type,
          time: new Date(latest.created_at).toLocaleTimeString(),
        });
      }
      lastViolationIdRef.current = latest.id;
    }
  }, [violationsData]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
        setPasswordInput("");
        setAuthError("");
        // Stay on admin panel after successful login
      } else {
        setAuthError(data.error || "Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    setPasswordInput("");
    setAuthError("");
  };

  const initializeDatabase = async () => {
    setInitializing(true);
    try {
      const res = await fetch("/api/init", { method: "POST" });
      if (res.ok) {
        setInitialized(true);
        checkInit();
      }
    } catch (error) {
      console.error("Failed to initialize database:", error);
    } finally {
      setInitializing(false);
    }
  };

  const createParticipant = async () => {
    if (
      !newParticipant.member1Name ||
      !newParticipant.teamName ||
      !newParticipant.member1Phone ||
      !newParticipant.member1Email ||
      !newParticipant.member1College ||
      !newParticipant.member1Department
    ) {
      return;
    }

    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newParticipant.member1Name,
          member1Name: newParticipant.member1Name,
          member2Name: newParticipant.member2Name || undefined,
          member3Name: newParticipant.member3Name || undefined,
          teamName: newParticipant.teamName,
          id: newParticipant.id || undefined,
          assignedRound: newParticipant.assignedRound,
          autoAssignScenario: newParticipant.assignedRound === 'round2',
          phone: newParticipant.member1Phone,
          email: newParticipant.member1Email,
          year: newParticipant.member1Year || undefined,
          college: newParticipant.member1College,
          department: newParticipant.member1Department,
          member1Phone: newParticipant.member1Phone,
          member1Email: newParticipant.member1Email,
          member1Year: newParticipant.member1Year || undefined,
          member1College: newParticipant.member1College,
          member1Department: newParticipant.member1Department,
          member2Phone: newParticipant.member2Phone || undefined,
          member2Email: newParticipant.member2Email || undefined,
          member2Year: newParticipant.member2Year || undefined,
          member2College: newParticipant.member2College || undefined,
          member2Department: newParticipant.member2Department || undefined,
          member3Phone: newParticipant.member3Phone || undefined,
          member3Email: newParticipant.member3Email || undefined,
          member3Year: newParticipant.member3Year || undefined,
          member3College: newParticipant.member3College || undefined,
          member3Department: newParticipant.member3Department || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedParticipant({
          id: data.generatedId,
          scenario: newParticipant.assignedRound === 'round1' ? 'Round 1 - MCQ Quiz' : (data.participant.scenario_title || "No scenario available"),
        });
        setNewParticipant({
          member1Name: "",
          member2Name: "",
          member3Name: "",
          member1Phone: "",
          member1Email: "",
          member1Year: "",
          member1College: "",
          member1Department: "",
          member2Phone: "",
          member2Email: "",
          member2Year: "",
          member2College: "",
          member2Department: "",
          member3Phone: "",
          member3Email: "",
          member3Year: "",
          member3College: "",
          member3Department: "",
          teamName: "",
          id: "",
          assignedRound: "round2",
        });
        refreshParticipants();
      }
    } catch (error) {
      console.error("Failed to create participant:", error);
    }
  };

  const assignScenario = async (participantId: string, scenarioId: string) => {
    try {
      await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign_scenario",
          scenarioId: parseInt(scenarioId),
        }),
      });
      refreshParticipants();
    } catch (error) {
      console.error("Failed to assign scenario:", error);
    }
  };

  const assignRandomScenario = async (participantId: string) => {
    if (!scenariosData?.scenarios) return;

    const assignedScenarios = new Set(
      participantsData?.participants
        ?.filter((p: Participant) => p.scenario_id)
        .map((p: Participant) => p.scenario_id)
    );

    const availableScenarios = scenariosData.scenarios.filter(
      (s: Scenario) => !assignedScenarios.has(s.id)
    );

    if (availableScenarios.length === 0) {
      alert("All scenarios have been assigned!");
      return;
    }

    const randomScenario =
      availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    await assignScenario(participantId, randomScenario.id.toString());
  };

  const startTimer = async (participantId: string) => {
    try {
      await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start_timer",
          duration: parseInt(timerDuration) * 60,
        }),
      });
      refreshParticipants();
    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  };

  const updateGlobalTimer = async (minutes: string) => {
    try {
      const res = await fetch("/api/admin/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: parseInt(minutes) * 60 }),
      });

      if (res.ok) {
        setGlobalTimerDuration(minutes);
        refreshTimer();
        // Optionally notify participants of timer change
        refreshParticipants();
      }
    } catch (error) {
      console.error("Failed to update global timer:", error);
    }
  };

  const toggleLock = async (participantId: string, currentlyLocked: boolean) => {
    try {
      await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: currentlyLocked ? "unlock" : "lock",
        }),
      });
      refreshParticipants();
    } catch (error) {
      console.error("Failed to toggle lock:", error);
    }
  };

  const resetParticipant = async (participantId: string) => {
    if (!confirm("Are you sure you want to reset this participant? This will clear all their progress.")) return;

    try {
      await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      refreshParticipants();
      refreshLogs();
      refreshViolations();
    } catch (error) {
      console.error("Failed to reset participant:", error);
    }
  };

  const deleteParticipant = async (participantId: string) => {
    if (!confirm("Are you sure you want to delete this participant?")) return;

    try {
      await fetch(`/api/participants/${participantId}`, { method: "DELETE" });
      refreshParticipants();
    } catch (error) {
      console.error("Failed to delete participant:", error);
    }
  };

  const toggleLeaderboardVisibility = async () => {
    setUpdatingLeaderboard(true);
    try {
      const res = await fetch("/api/admin/leaderboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !leaderboardPublicEnabled }),
      });

      if (res.ok) {
        setLeaderboardPublicEnabled((prev) => !prev);
        refreshLeaderboard();
      }
    } catch (error) {
      console.error("Failed to update leaderboard setting:", error);
    } finally {
      setUpdatingLeaderboard(false);
    }
  };

  const exportParticipantsToExcel = async () => {
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participants_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export participants:", error);
    }
  };

  const getTimerStatus = (participant: Participant) => {
    if (participant.is_locked) return { status: "Locked", color: "destructive" as const };
    if (!participant.timer_started_at) return { status: "Not Started", color: "secondary" as const };

    const start = new Date(participant.timer_started_at).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);
    const remaining = participant.timer_duration - elapsed;

    if (remaining <= 0) return { status: "Expired", color: "destructive" as const };
    if (remaining <= 300) return { status: `${Math.floor(remaining / 60)}m left`, color: "destructive" as const };

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return {
      status: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m left`,
      color: "default" as const,
    };
  };

  // Admin login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError("");
                  }}
                  autoFocus
                />
                {authError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{authError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Lock className="mr-2 h-4 w-4" />
                Login to Admin
              </Button>
              <div className="text-center">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Preparing Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Setting up participant records, scenarios, and dashboard views.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const participants: Participant[] = participantsData?.participants || [];
  const scenarios: Scenario[] = scenariosData?.scenarios || [];
  const logs: ActivityLog[] = logsData?.logs || [];
  const violations: Violation[] = violationsData?.violations || [];

  const activeParticipants = participants.filter(
    (p) => p.is_active && !p.is_locked
  ).length;
  const totalViolations = participants.reduce(
    (sum, p) => sum + p.violation_count,
    0
  );
  const totalSnippets = participants.reduce(
    (sum, p) => sum + p.snippets_unlocked,
    0
  );
  const totalRound2Accesses = participants.reduce(
    (sum, p) => sum + (p.round2_hint_count || 0),
    0
  );
  const round2Participants = participants.filter(
    (p) => p.assigned_round === "round2" || Boolean(p.scenario_id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">IoT Event Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="icon" title="Home">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="icon"
                title="Change password"
                onClick={() => setPasswordDialogOpen(true)}
              >
                <KeyRound className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground"
              >
                <Lock className="mr-2 h-3.5 w-3.5" />
                Logout
              </Button>
              <Select value={timerDuration} onValueChange={(value) => {
                setTimerDuration(value);
                updateGlobalTimer(value);
              }}>
                <SelectTrigger className="w-32">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-950 text-slate-50">
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="90">90 min</SelectItem>
                  <SelectItem value="120">120 min</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  refreshParticipants();
                  refreshLogs();
                  refreshViolations();
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Live violation alert banner */}
      {newViolationAlert && (
        <div className="bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span className="font-semibold text-sm">
              NEW VIOLATION — {newViolationAlert.participant}:{" "}
              <span className="font-normal">{newViolationAlert.type.replace(/_/g, " ")} at {newViolationAlert.time}</span>
            </span>
          </div>
          <button
            onClick={() => setNewViolationAlert(null)}
            className="text-destructive-foreground/70 hover:text-destructive-foreground text-xs underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Public Leaderboard</p>
              <p className="text-xs text-muted-foreground">
                Allow all visitors to view team standings on the home page.
              </p>
            </div>
            <Button variant={leaderboardPublicEnabled ? "default" : "outline"} onClick={toggleLeaderboardVisibility} disabled={updatingLeaderboard} className="gap-2">
              <Trophy className="h-4 w-4" />
              {leaderboardPublicEnabled ? "Leaderboard: Enabled" : "Leaderboard: Disabled"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participants.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeParticipants} currently active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Snippets Unlocked</CardTitle>
              <Unlock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSnippets}</div>
              <p className="text-xs text-muted-foreground">starter packs unlocked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Round 2 Component Accesses</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRound2Accesses}</div>
              <p className="text-xs text-muted-foreground">penalty-scored component opens</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViolations}</div>
              <p className="text-xs text-muted-foreground">detected events</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="participants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="participants">Team Registry</TabsTrigger>
          <TabsTrigger value="round1-center">Round 1 Center</TabsTrigger>
          <TabsTrigger value="round2-center">Round 2 Center</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="violations" className="gap-1.5">
            Violations
            {violations.filter(v => v.severity === "critical").length > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center leading-none">
                {violations.filter(v => v.severity === "critical").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

          <TabsContent value="participants" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Team & Participant Registry</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={exportParticipantsToExcel} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Excel (CSV)
                </Button>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setCreatedParticipant(null);
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Participant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {createdParticipant ? "Participant Created!" : "Add New Participant"}
                    </DialogTitle>
                    <DialogDescription>
                      {createdParticipant 
                        ? "Share this ID with the participant to begin the competition." 
                        : "Create a new participant with auto-generated ID and scenario assignment."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {createdParticipant ? (
                    <div className="space-y-4 py-4">
                      <Alert className="bg-success/10 border-success">
                        <AlertTitle className="text-success">Success!</AlertTitle>
                        <AlertDescription>
                          The participant has been created and assigned a scenario automatically.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-sm text-muted-foreground mb-1">Participant ID</p>
                          <p className="text-3xl font-mono font-bold tracking-wider text-primary">
                            {createdParticipant.id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Share this ID with the participant
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border">
                          <p className="text-sm text-muted-foreground">Assigned Scenario</p>
                          <p className="font-medium">{createdParticipant.scenario}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setCreatedParticipant(null);
                            setDialogOpen(false);
                          }}
                        >
                          Done
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Member 1 Name (Team Lead) *</label>
                          <Input
                            placeholder="Enter first member name"
                            value={newParticipant.member1Name}
                            onChange={(e) =>
                              setNewParticipant((prev) => ({
                                ...prev,
                                member1Name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 1 College *</label>
                            <Input
                              placeholder="Enter college name"
                              value={newParticipant.member1College}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member1College: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 1 Department *</label>
                            <Input
                              placeholder="Enter department"
                              value={newParticipant.member1Department}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member1Department: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 1 Phone *</label>
                            <Input
                              placeholder="e.g. 0123456789"
                              value={newParticipant.member1Phone}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member1Phone: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 1 Year (Optional)</label>
                            <Input
                              placeholder="e.g. Year 1"
                              value={newParticipant.member1Year}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member1Year: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Member 1 Email *</label>
                          <Input
                            placeholder="e.g. participant@email.com"
                            value={newParticipant.member1Email}
                            onChange={(e) =>
                              setNewParticipant((prev) => ({
                                ...prev,
                                member1Email: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 2 Name (Optional)</label>
                            <Input
                              placeholder="Enter second member name"
                              value={newParticipant.member2Name}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member2Name: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 3 Name (Optional)</label>
                            <Input
                              placeholder="Enter third member name"
                              value={newParticipant.member3Name}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member3Name: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 2 College</label>
                            <Input
                              placeholder="Enter college name"
                              value={newParticipant.member2College}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member2College: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 2 Department</label>
                            <Input
                              placeholder="Enter department"
                              value={newParticipant.member2Department}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member2Department: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 2 Phone</label>
                            <Input
                              placeholder="e.g. 0123456789"
                              value={newParticipant.member2Phone}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member2Phone: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 2 Year (Optional)</label>
                            <Input
                              placeholder="e.g. Year 1"
                              value={newParticipant.member2Year}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member2Year: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Member 2 Email</label>
                          <Input
                            placeholder="e.g. participant@email.com"
                            value={newParticipant.member2Email}
                            onChange={(e) =>
                              setNewParticipant((prev) => ({
                                ...prev,
                                member2Email: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 3 College</label>
                            <Input
                              placeholder="Enter college name"
                              value={newParticipant.member3College}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member3College: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 3 Department</label>
                            <Input
                              placeholder="Enter department"
                              value={newParticipant.member3Department}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member3Department: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 3 Phone</label>
                            <Input
                              placeholder="e.g. 0123456789"
                              value={newParticipant.member3Phone}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member3Phone: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Member 3 Year (Optional)</label>
                            <Input
                              placeholder="e.g. Year 1"
                              value={newParticipant.member3Year}
                              onChange={(e) =>
                                setNewParticipant((prev) => ({
                                  ...prev,
                                  member3Year: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Member 3 Email</label>
                          <Input
                            placeholder="e.g. participant@email.com"
                            value={newParticipant.member3Email}
                            onChange={(e) =>
                              setNewParticipant((prev) => ({
                                ...prev,
                                member3Email: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Team Name *</label>
                          <Input
                            placeholder="Enter team name"
                            value={newParticipant.teamName}
                            onChange={(e) =>
                              setNewParticipant((prev) => ({
                                ...prev,
                                teamName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Custom ID (Optional)</label>
                          <Input
                            placeholder="Leave empty to auto-generate"
                            value={newParticipant.id}
                            onChange={(e) =>
                              setNewParticipant((prev) => ({
                                ...prev,
                                id: e.target.value.toUpperCase(),
                              }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            A unique 6-character ID will be generated if left empty
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Assign to Round</label>
                          <Select value={newParticipant.assignedRound || "round2"} onValueChange={(value: any) =>
                            setNewParticipant((prev) => ({
                              ...prev,
                              assignedRound: value as 'round1' | 'round2',
                            }))
                          }>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a round" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-700 bg-slate-950 text-slate-50">
                              <SelectItem value="round1">Round 1 - MCQ Quiz</SelectItem>
                              <SelectItem value="round2">Round 2 - Hands-on Scenario</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Alert>
                          <Activity className="h-4 w-4" />
                          <AlertDescription>
                            One login is created per team. Add up to 3 member names for joint participation.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={createParticipant}
                          disabled={
                            !newParticipant.member1Name ||
                            !newParticipant.teamName ||
                            !newParticipant.member1Phone ||
                            !newParticipant.member1Email ||
                            !newParticipant.member1College ||
                            !newParticipant.member1Department
                          }
                        >
                          Create Participant
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Team Members</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Timer</TableHead>
                      <TableHead>Snippets</TableHead>
                      <TableHead>Component Access</TableHead>
                      <TableHead>R2 Score</TableHead>
                      <TableHead>Violations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">
                          No participants yet. Add one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      participants.map((participant) => {
                        const timerStatus = getTimerStatus(participant);
                        return (
                          <TableRow key={participant.id}>
                            <TableCell className="font-mono text-sm font-bold text-primary">
                              {participant.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="space-y-1 text-sm">
                                <div>{participant.name}</div>
                                {participant.member2_name ? <div className="text-muted-foreground">{participant.member2_name}</div> : null}
                                {participant.member3_name ? <div className="text-muted-foreground">{participant.member3_name}</div> : null}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {participant.team_name || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="space-y-1">
                                <div>{participant.member1_college || participant.college || "-"}</div>
                                {participant.member2_name ? <div>{participant.member2_college || "-"}</div> : null}
                                {participant.member3_name ? <div>{participant.member3_college || "-"}</div> : null}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="space-y-1">
                                <div>{participant.member1_department || participant.department || "-"}</div>
                                {participant.member2_name ? <div>{participant.member2_department || "-"}</div> : null}
                                {participant.member3_name ? <div>{participant.member3_department || "-"}</div> : null}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="space-y-1">
                                <div>{participant.member1_phone || participant.phone || "-"}</div>
                                {participant.member2_name ? <div>{participant.member2_phone || "-"}</div> : null}
                                {participant.member3_name ? <div>{participant.member3_phone || "-"}</div> : null}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="space-y-1 break-all">
                                <div>{participant.member1_email || participant.email || "-"}</div>
                                {participant.member2_name ? <div>{participant.member2_email || "-"}</div> : null}
                                {participant.member3_name ? <div>{participant.member3_email || "-"}</div> : null}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="space-y-1">
                                <div>{participant.member1_year || participant.year || "-"}</div>
                                {participant.member2_name ? <div>{participant.member2_year || "-"}</div> : null}
                                {participant.member3_name ? <div>{participant.member3_year || "-"}</div> : null}
                              </div>
                            </TableCell>
                            <TableCell>
                              {participant.scenario_title ? (
                                <span className="text-sm">{participant.scenario_title}</span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={selectedScenario}
                                    onValueChange={(value) => assignScenario(participant.id, value)}
                                  >
                                    <SelectTrigger className="w-40 h-8 text-xs">
                                      <SelectValue placeholder="Assign..." />
                                    </SelectTrigger>
                                    <SelectContent className="border-slate-700 bg-slate-950 text-slate-50">
                                      {scenarios.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                          {s.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => assignRandomScenario(participant.id)}
                                    title="Assign random scenario"
                                  >
                                    <RefreshCw className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={timerStatus.color}>
                                {timerStatus.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{participant.snippets_unlocked}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {participant.round2_hint_count || 0} ({participant.round2_hint_penalty || 0})
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{participant.round2_score || 0}</Badge>
                            </TableCell>
                            <TableCell>
                              {participant.violation_count > 0 ? (
                                <Badge variant="destructive">{participant.violation_count}</Badge>
                              ) : (
                                <Badge variant="secondary">0</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {participant.is_locked ? (
                                <Badge variant="destructive">Locked</Badge>
                              ) : participant.is_active ? (
                                <Badge variant="default">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => window.open(`/participant/${participant.id}`, "_blank")}
                                  title="View dashboard"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {!participant.timer_started_at && participant.scenario_id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => startTimer(participant.id)}
                                    title="Start timer"
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleLock(participant.id, !!participant.is_locked)}
                                  title={participant.is_locked ? "Unlock" : "Lock"}
                                >
                                  {participant.is_locked ? (
                                    <Unlock className="h-4 w-4" />
                                  ) : (
                                    <Lock className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => resetParticipant(participant.id)}
                                  title="Reset"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteParticipant(participant.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="round1-center" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Round 1 Operations</CardTitle>
                <CardDescription>Review scores, promote performers, and control question progression.</CardDescription>
              </CardHeader>
              <CardContent>
                <Round1Management />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Round 1 Question Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <Round1QuestionManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="round2-center" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Round 2 Operations</CardTitle>
                <CardDescription>Monitor scenario progress, timer status, component accesses, and team performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use the Team Registry tab for participant-level actions and this panel for component/scenario oversight.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Round 2 Students & Teams</CardTitle>
                <CardDescription>Quick visibility of students, teams, scenario assignment, and score status.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Students</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>College / Department</TableHead>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Hint Packs</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {round2Participants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No Round 2 participants yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      round2Participants.map((participant) => (
                        <TableRow key={`r2-${participant.id}`}>
                          <TableCell className="font-medium">
                            <div className="space-y-1 text-sm">
                              <div>{participant.name}</div>
                              {participant.member2_name ? <div className="text-muted-foreground">{participant.member2_name}</div> : null}
                              {participant.member3_name ? <div className="text-muted-foreground">{participant.member3_name}</div> : null}
                            </div>
                          </TableCell>
                          <TableCell>{participant.team_name || "-"}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{participant.college || "-"}</div>
                              <div className="text-muted-foreground">{participant.department || "-"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{participant.scenario_title || "Not assigned"}</TableCell>
                          <TableCell>
                            {participant.round2_hint_count || 0}
                            <span className="text-muted-foreground"> ({participant.round2_hint_penalty || 0})</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{participant.round2_score || 0}</Badge>
                          </TableCell>
                          <TableCell>
                            {participant.is_locked ? (
                              <Badge variant="destructive">Locked</Badge>
                            ) : participant.timer_started_at ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="outline">Ready</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <ComponentsView />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {logs.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        No activity logs yet.
                      </p>
                    ) : (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">
                                {log.participant_name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {log.event_type}
                              </Badge>
                            </div>
                            {log.details && (
                              <p className="text-sm text-muted-foreground mt-1 truncate">
                                {log.details}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="violations" className="space-y-4">
            {violations.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Violations Detected</AlertTitle>
                <AlertDescription>
                  {violations.length} violation(s) have been recorded across all participants.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Violation Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {violations.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        No violations recorded.
                      </p>
                    ) : (
                      violations.map((violation) => {
                        const isCritical = violation.severity === "critical";
                        const isPermitted = violation.severity === "permitted";
                        return (
                          <div
                            key={violation.id}
                            className={`flex items-start gap-3 rounded-lg border p-3 ${
                              isCritical
                                ? "border-destructive/50 bg-destructive/10"
                                : isPermitted
                                ? "border-border bg-muted/30"
                                : "border-yellow-500/30 bg-yellow-500/5"
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              isCritical ? "bg-destructive/20" : isPermitted ? "bg-muted" : "bg-yellow-500/20"
                            }`}>
                              <AlertTriangle className={`h-4 w-4 ${
                                isCritical ? "text-destructive" : isPermitted ? "text-muted-foreground" : "text-yellow-600"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm">
                                  {violation.participant_name || violation.participant_id}
                                </span>
                                <Badge
                                  variant={isCritical ? "destructive" : "outline"}
                                  className={`text-xs ${!isCritical && !isPermitted ? "border-yellow-500 text-yellow-700" : ""}`}
                                >
                                  {violation.violation_type.replace(/_/g, " ")}
                                </Badge>
                                {violation.severity && (
                                  <Badge variant="outline" className={`text-xs ${
                                    isCritical ? "border-destructive text-destructive" :
                                    isPermitted ? "border-muted-foreground text-muted-foreground" :
                                    "border-yellow-500 text-yellow-700"
                                  }`}>
                                    {violation.severity}
                                  </Badge>
                                )}
                                {violation.app_name && (
                                  <Badge variant="outline" className="text-xs">
                                    {violation.app_name}
                                  </Badge>
                                )}
                              </div>
                              {violation.details && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {violation.details}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {new Date(violation.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-4">
            <ComponentsView />
          </TabsContent>
        </Tabs>
      </main>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </div>
  );
}

function ComponentsView() {
  const { data: componentsData } = useSWR("/api/components", fetcher);
  const components = componentsData?.components || [];

  const categories = [...new Set(components.map((c: { category: string }) => c.category))];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category as string}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              {category as string}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {components
                  .filter((c: { category: string }) => c.category === category)
                  .map((component: { id: number; name: string; description: string; quantity: number }) => (
                    <TableRow key={component.id}>
                      <TableCell>{component.id}</TableCell>
                      <TableCell className="font-medium">{component.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                        {component.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{component.quantity}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
