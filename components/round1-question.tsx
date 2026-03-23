"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, AlertCircle } from "lucide-react";

interface Round1QuestionProps {
  question: {
    id: number;
    type: string;
    title: string;
    scenario: string;
    section: string;
    difficulty: string;
    score: number;
    timeLimit: number;
    options?: Array<{ id: string; text: string }>;
    matchingPairs?: Array<{ id: string; left: string; right: string }>;
  };
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string | string[]) => void;
  onTimeUp: () => void;
}

export function Round1Question({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onTimeUp,
}: Round1QuestionProps) {
  const [timeRemaining, setTimeRemaining] = useState(question.timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp]);

  const handleMCQSubmit = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };

  const handleMultiSelectSubmit = () => {
    if (selectedAnswers.length > 0) {
      onAnswer(selectedAnswers);
    }
  };

  const handleMatchingSubmit = () => {
    if (Object.keys(matchingAnswers).length === question.matchingPairs?.length) {
      onAnswer(JSON.stringify(matchingAnswers));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timePercentage = (timeRemaining / question.timeLimit) * 100;
  const isTimeWarning = timeRemaining < 10;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </p>
          <Progress value={(questionNumber / totalQuestions) * 100} className="mt-2" />
        </div>
        <div className="ml-4 text-right">
          <div className={`text-2xl font-bold font-mono ${isTimeWarning ? "text-destructive" : ""}`}>
            {formatTime(timeRemaining)}
          </div>
          <p className="text-xs text-muted-foreground">Time remaining</p>
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{question.title}</CardTitle>
              <CardDescription className="mt-2">{question.scenario}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">Section {question.section}</Badge>
              <Badge variant="secondary">{question.score} pts</Badge>
              <Badge
                variant={
                  question.difficulty === "Easy"
                    ? "outline"
                    : question.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                }
              >
                {question.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* MCQ Type */}
          {question.type === "mcq" && (
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {/* Multi-Select Type */}
          {question.type === "multi-select" && (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                  <Checkbox
                    id={option.id}
                    checked={selectedAnswers.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAnswers([...selectedAnswers, option.id]);
                      } else {
                        setSelectedAnswers(selectedAnswers.filter((a) => a !== option.id));
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer flex-1">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Matching Type */}
          {question.type === "matching" && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Left Items</h4>
                {question.matchingPairs?.map((pair) => (
                  <div key={`left-${pair.id}`} className="p-3 rounded-lg bg-muted text-sm">
                    {pair.left}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Right Items</h4>
                {question.matchingPairs?.map((pair) => (
                  <div key={`right-${pair.id}`} className="p-3 rounded-lg bg-muted text-sm">
                    {pair.right}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Warning */}
          {isTimeWarning && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">Time running out!</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={
              question.type === "mcq" || question.type === "logic"
                ? handleMCQSubmit
                : question.type === "multi-select"
                  ? handleMultiSelectSubmit
                  : handleMatchingSubmit
            }
            disabled={
              (question.type === "mcq" && !selectedAnswer) ||
              (question.type === "multi-select" && selectedAnswers.length === 0) ||
              (question.type === "matching" && Object.keys(matchingAnswers).length === 0)
            }
            className="w-full"
            size="lg"
          >
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
