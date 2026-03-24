"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/ui/spinner";
import { UserCheck, Users, BarChart3, CheckCircle, Clock, Trophy } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ParticipantData {
  id: string;
  name: string;
  team_name?: string;
  assigned_round: string | null;
  round1_score?: number;
  round1_completed?: boolean;
  round2_score?: number;
  round2_completed?: boolean;
}

interface TeamEntry {
  team_name: string;
  members: ParticipantData[];
  avg_score: number;
  all_completed: boolean;
  any_completed: boolean;
}

function buildTeamLeaderboard(participants: ParticipantData[]): TeamEntry[] {
  const round1Participants = participants.filter(p => p.assigned_round === "round1");
  const teamMap = new Map<string, ParticipantData[]>();

  for (const p of round1Participants) {
    const key = p.team_name?.trim() || "__no_team__";
    if (!teamMap.has(key)) teamMap.set(key, []);
    teamMap.get(key)!.push(p);
  }

  const entries: TeamEntry[] = [];
  teamMap.forEach((members, team_name) => {
    const completedMembers = members.filter(m => m.round1_completed);
    const avg_score =
      completedMembers.length > 0
        ? completedMembers.reduce((sum, m) => sum + (m.round1_score || 0), 0) / completedMembers.length
        : 0;
    entries.push({
      team_name: team_name === "__no_team__" ? "(No Team)" : team_name,
      members,
      avg_score,
      all_completed: members.every(m => m.round1_completed),
      any_completed: members.some(m => m.round1_completed),
    });
  });

  return entries.sort((a, b) => b.avg_score - a.avg_score);
}

export function Round1Management() {
  const [filterRound, setFilterRound] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: participantsData, mutate: refreshParticipants } = useSWR(
    "/api/participants",
    fetcher,
    { refreshInterval: 5000 }
  );

  const handleAssignRound = async (participantId: string, round: string) => {
    try {
      const res = await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign_round",
          assigned_round: round,
        }),
      });
      if (res.ok) refreshParticipants();
    } catch (error) {
      console.error("Failed to assign round:", error);
    }
  };

  if (!participantsData) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  const participants: ParticipantData[] = participantsData.participants || [];

  const teamLeaderboard = buildTeamLeaderboard(participants);

  let filtered = participants.filter((p: ParticipantData) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.team_name || "").toLowerCase().includes(searchTerm.toLowerCase());

    if (filterRound === "all") return matchesSearch;
    if (filterRound === "unassigned") return matchesSearch && !p.assigned_round;
    if (filterRound === "round1") return matchesSearch && p.assigned_round === "round1";
    if (filterRound === "round2") return matchesSearch && p.assigned_round === "round2";
    return matchesSearch;
  });

  filtered = filtered.sort((a: ParticipantData, b: ParticipantData) => {
    const aScore = a.round1_completed ? (a.round1_score || 0) : -1;
    const bScore = b.round1_completed ? (b.round1_score || 0) : -1;
    return bScore - aScore;
  });

  const stats = {
    total: participants.length,
    round1: participants.filter((p: ParticipantData) => p.assigned_round === "round1").length,
    round2: participants.filter((p: ParticipantData) => p.assigned_round === "round2").length,
    unassigned: participants.filter((p: ParticipantData) => !p.assigned_round).length,
    round1Completed: participants.filter((p: ParticipantData) => p.round1_completed).length,
  };

  const rankColors = ["text-yellow-500", "text-slate-400", "text-amber-700"];
  const rankLabels = ["1st", "2nd", "3rd"];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Round 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.round1}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.round1Completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Round 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.round2}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Unassigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.unassigned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Leaderboard */}
      {teamLeaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Team Leaderboard
            </CardTitle>
            <CardDescription>
              Teams ranked by average Round 1 score.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamLeaderboard.map((team, idx) => {
                    const alreadyPromoted = team.members.every(m => m.assigned_round === "round2");
                    return (
                      <TableRow key={team.team_name} className={idx === 0 ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                        <TableCell>
                          <span className={`font-bold text-lg ${rankColors[idx] || "text-foreground"}`}>
                            {rankLabels[idx] || `${idx + 1}th`}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">{team.team_name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {team.members.map(m => (
                              <div key={m.id} className="flex items-center gap-2 text-sm">
                                <span className="font-mono text-xs text-muted-foreground">{m.id}</span>
                                <span>{m.name}</span>
                                {m.round1_completed ? (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                    {m.round1_score ?? 0} pts
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-muted-foreground">
                                    pending
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {team.any_completed ? (
                            <div className="flex items-center gap-1">
                              <span className="text-2xl font-bold text-primary">
                                {team.avg_score.toFixed(1)}
                              </span>
                              {!team.all_completed && (
                                <span className="text-xs text-muted-foreground">(partial)</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not started</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {alreadyPromoted ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400">
                              In Round 2
                            </Badge>
                          ) : team.all_completed ? (
                            <Badge variant="default">All Done</Badge>
                          ) : team.any_completed ? (
                            <Badge variant="outline">In Progress</Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600">Waiting</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Participants</CardTitle>
          <CardDescription>View and manage round assignment for individual participants</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name, ID, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterRound} onValueChange={setFilterRound}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="round1">Round 1</SelectItem>
                <SelectItem value="round2">Round 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Current Round</TableHead>
                  <TableHead>Round 1 Score</TableHead>
                  <TableHead>Round 2 Score</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((participant: ParticipantData) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-mono text-sm">{participant.id}</TableCell>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {participant.team_name || "-"}
                    </TableCell>
                    <TableCell>
                      {participant.assigned_round ? (
                        <Badge
                          variant={participant.assigned_round === "round1" ? "default" : "secondary"}
                        >
                          {participant.assigned_round === "round1" ? "Round 1" : "Round 2"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {participant.round1_completed ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{participant.round1_score || 0}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {participant.round2_completed ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{participant.round2_score || 0}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={participant.assigned_round || "unassigned"}
                        onValueChange={(value) =>
                          handleAssignRound(
                            participant.id,
                            value === "unassigned" ? "null" : value
                          )
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          <SelectItem value="round1">Round 1</SelectItem>
                          <SelectItem value="round2">Round 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No participants found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
