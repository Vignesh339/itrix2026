"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, BarChart3 } from "lucide-react";

interface Round1ResultsProps {
  result: {
    total_score: number;
    section_scores: {
      A: number;
      B: number;
      C: number;
      D: number;
    };
    total_questions: number;
    correct_answers: number;
    tab_switches: number;
    violations: number;
  };
  maxScore: number;
}

export function Round1Results({ result, maxScore }: Round1ResultsProps) {
  const scorePercentage = (result.total_score / maxScore) * 100;
  const correctPercentage = (result.correct_answers / result.total_questions) * 100;

  const getScoringBadge = (percentage: number) => {
    if (percentage >= 80) return { variant: "default" as const, label: "Excellent", color: "text-green-600" };
    if (percentage >= 60) return { variant: "secondary" as const, label: "Good", color: "text-blue-600" };
    if (percentage >= 40) return { variant: "outline" as const, label: "Average", color: "text-yellow-600" };
    return { variant: "destructive" as const, label: "Needs Improvement", color: "text-red-600" };
  };

  const badge = getScoringBadge(scorePercentage);

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="text-center pb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 mx-auto">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">{result.total_score}/{maxScore}</CardTitle>
          <CardDescription className="text-lg mt-2">Total Score</CardDescription>
          <Badge className={`mt-4 ${badge.color}`} variant={badge.variant}>
            {badge.label}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Performance</span>
              <span className="text-muted-foreground">{scorePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={scorePercentage} className="h-3" />
          </div>

          {/* Correct Answers */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Correct Answers</p>
                <p className="text-sm text-muted-foreground">{result.correct_answers}/{result.total_questions}</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{correctPercentage.toFixed(0)}%</div>
          </div>

          {/* Wrong Answers */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium">Incorrect Answers</p>
                <p className="text-sm text-muted-foreground">
                  {result.total_questions - result.correct_answers}/{result.total_questions}
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold">{(100 - correctPercentage).toFixed(0)}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Section Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Section Breakdown
          </CardTitle>
          <CardDescription>Your performance by section</CardDescription>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">
          {Object.entries(result.section_scores).map(([section, score]) => (
            <div key={section} className="p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Section {section}</h4>
                <span className="text-lg font-bold text-primary">{score} pts</span>
              </div>
              <Progress value={Math.min((score / 100) * 100, 100)} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Violations Summary */}
      {(result.tab_switches > 0 || result.violations > 0) && (
        <Card className="border-l-4 border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-base">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.tab_switches > 0 && (
              <p className="text-sm">
                <span className="font-medium">Tab Switches:</span> {result.tab_switches} detected
              </p>
            )}
            {result.violations > 0 && (
              <p className="text-sm">
                <span className="font-medium">Violations:</span> {result.violations} recorded
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
