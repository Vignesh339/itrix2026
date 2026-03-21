"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Participant {
  id: string;
  name: string;
  team_name?: string;
  scenario_id: number | null;
  timer_duration: number;
  timer_started_at: string | null;
  is_active: number;
  is_locked: number;
  created_at: string;
  scenario_title: string | null;
  snippets_unlocked: number;
  violation_count: number;
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
  const [newParticipant, setNewParticipant] = useState({ name: "", teamName: "", id: "" });
  const [createdParticipant, setCreatedParticipant] = useState<{ id: string; scenario: string } | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [timerDuration, setTimerDuration] = useState("120");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [globalTimerDuration, setGlobalTimerDuration] = useState("120");
  
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

  useEffect(() => {
    if (initStatus?.initialized) {
      setInitialized(true);
    }
  }, [initStatus]);

  useEffect(() => {
    if (timerData?.minutes) {
      setGlobalTimerDuration(timerData.minutes.toString());
    }
  }, [timerData]);

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
        // Redirect to home after 500ms to ensure session is saved
        setTimeout(() => {
          router.push("/");
        }, 500);
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
    if (!newParticipant.name) return;

    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newParticipant.name,
          teamName: newParticipant.teamName,
          id: newParticipant.id || undefined, // Let API auto-generate if empty
          autoAssignScenario: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedParticipant({
          id: data.generatedId,
          scenario: data.participant.scenario_title || "No scenario available",
        });
        setNewParticipant({ name: "", teamName: "", id: "" });
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
            <CardTitle className="text-2xl">IoT Event Platform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Initialize the database to get started. This will create all necessary
              tables and seed the components and scenarios.
            </p>
            <Button
              onClick={initializeDatabase}
              disabled={initializing}
              className="w-full"
              size="lg"
            >
              {initializing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Initialize Database
                </>
              )}
            </Button>
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
                <SelectContent>
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

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
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
              <p className="text-xs text-muted-foreground">across all participants</p>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Scenarios</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scenarios.length}</div>
              <p className="text-xs text-muted-foreground">unique scenarios</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Manage Participants</h2>
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
                <DialogContent>
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
                          <label className="text-sm font-medium">Participant Name *</label>
                          <Input
                            placeholder="Enter participant name"
                            value={newParticipant.name}
                            onChange={(e) =>
                              setNewParticipant((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Team Name</label>
                          <Input
                            placeholder="Enter team name (optional)"
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
                        <Alert>
                          <Activity className="h-4 w-4" />
                          <AlertDescription>
                            A random scenario will be automatically assigned when created.
                          </AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createParticipant} disabled={!newParticipant.name}>
                          Create Participant
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Timer</TableHead>
                      <TableHead>Snippets</TableHead>
                      <TableHead>Violations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
                              {participant.name}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {participant.team_name || "-"}
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
                                    <SelectContent>
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
                      violations.map((violation) => (
                        <div
                          key={violation.id}
                          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">
                                {violation.participant_name}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                {violation.violation_type}
                              </Badge>
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
                      ))
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
