"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trophy, Users, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LeaderboardEntry {
  rank: number;
  team_name: string;
  avg_score: number;
  members: number;
  completed_members: number;
}

export default function PublicLeaderboardPage() {
  const { data, isLoading } = useSWR("/api/leaderboard", fetcher, {
    refreshInterval: 15000,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl py-16 text-center">
          <Spinner className="mx-auto h-8 w-8" />
          <p className="mt-4 text-sm text-muted-foreground">Loading leaderboard...</p>
        </div>
      </main>
    );
  }

  if (!data?.enabled) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl py-12">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Not Available</CardTitle>
              <CardDescription>
                Public leaderboard is currently disabled by the admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const rows: LeaderboardEntry[] = data?.leaderboard || [];

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Public Leaderboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Rankings are based on average completed Round 1 scores per team.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Teams Ranked</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{rows.length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Team Score</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{rows[0] ? rows[0].avg_score.toFixed(1) : "0.0"}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Refresh</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-medium">{new Date(data.updatedAt).toLocaleTimeString()}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Team Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No ranked teams yet.</p>
            ) : (
              rows.map((row) => (
                <div key={row.team_name} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={row.rank <= 3 ? "default" : "secondary"}>#{row.rank}</Badge>
                    <div>
                      <p className="font-medium">{row.team_name}</p>
                      <p className="text-xs text-muted-foreground">
                        <Users className="mr-1 inline h-3 w-3" />
                        {row.members} members
                        <span className="ml-3">
                          <CheckCircle2 className="mr-1 inline h-3 w-3 text-emerald-600" />
                          {row.completed_members} completed
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold">{row.avg_score.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
