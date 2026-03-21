"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Wrench, FileText } from "lucide-react";

interface ScenarioDisplayProps {
  title: string;
  situation: string;
  whatToBuild: string;
  teamNumber?: number;
}

export function ScenarioDisplay({
  title,
  situation,
  whatToBuild,
  teamNumber,
}: ScenarioDisplayProps) {
  const buildSteps = whatToBuild
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.trim());

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{title}</CardTitle>
                {teamNumber && (
                  <Badge variant="outline" className="mt-1">
                    Team {teamNumber}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                The Situation
              </span>
            </div>
            <p className="text-sm leading-relaxed">{situation}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <Wrench className="h-5 w-5 text-chart-2" />
            </div>
            <CardTitle className="text-lg">What to Build</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {buildSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed pt-0.5">
                  {step.replace(/^\d+\.\s*/, "")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
