"use client";

import { useEffect, useMemo, useState } from "react";

import { ConnectionWiringCanvas } from "@/components/connection-wiring-canvas";
import { DragDropMatching } from "@/components/drag-drop-matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface SnippetCompileResult {
  success: boolean;
  message: string;
  stdout: string;
  stderr: string;
  command: string;
}

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
    imageUrl?: string;
    codeSnippet?: string;
    sourceNodes?: string[];
    targetNodes?: string[];
    expectedConnections?: Array<{ from: string; to: string }>;
  };
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
  showNavigation?: boolean;
}

function isMatchingType(type: string): boolean {
  return type === "matching" || type === "component-matching";
}

function isMcqType(type: string): boolean {
  return type === "mcq" || type === "simulation" || type === "scenario-mcq";
}

export function Round1Question({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswerChange,
  onPrevious,
  onNext,
  isSaving = false,
  readOnly = false,
  showNavigation = true,
}: Round1QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(typeof currentAnswer === "string" ? currentAnswer : "");
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array.isArray(currentAnswer) ? currentAnswer : []);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [snippetRunPending, setSnippetRunPending] = useState(false);
  const [snippetRunResult, setSnippetRunResult] = useState<SnippetCompileResult | null>(null);

  useEffect(() => {
    if (typeof currentAnswer === "string") {
      if (isMatchingType(question.type)) {
        try {
          const parsed = JSON.parse(currentAnswer);
          setMatchingAnswers(parsed && typeof parsed === "object" ? parsed : {});
        } catch {
          setMatchingAnswers({});
        }
        setSelectedAnswer("");
        setSelectedAnswers([]);
        setSnippetRunResult(null);
        return;
      }

      setSelectedAnswer(currentAnswer);
      setSelectedAnswers([]);
      setMatchingAnswers({});
      setSnippetRunResult(null);
      return;
    }

    if (Array.isArray(currentAnswer)) {
      setSelectedAnswers(currentAnswer);
      setSelectedAnswer("");
      setMatchingAnswers({});
      setSnippetRunResult(null);
      return;
    }

    if (question.type === "snippet-coding") {
      setSelectedAnswer(question.codeSnippet || "");
    } else {
      setSelectedAnswer("");
    }

    setSelectedAnswers([]);
    setMatchingAnswers({});
    setSnippetRunResult(null);
  }, [currentAnswer, question.type, question.id, question.codeSnippet]);

  const matchingCompleted = useMemo(
    () => Object.keys(matchingAnswers).length === (question.matchingPairs?.length || 0),
    [matchingAnswers, question.matchingPairs]
  );

  const snippetExpectedAnswer = useMemo(() => {
    if (question.type !== "snippet-coding") return undefined;
    const map = (question.expectedConnections || []).reduce<Record<string, string>>((acc, edge) => {
      acc[edge.from] = edge.to;
      return acc;
    }, {});
    return JSON.stringify(map);
  }, [question.expectedConnections, question.type]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-cyan-200/25 bg-slate-950/55 px-3 py-2">
        <p className="text-sm font-medium text-cyan-100/90">Question {questionNumber} of {totalQuestions}</p>
        <Badge variant="outline" className="border-cyan-200/30 bg-cyan-300/10 text-cyan-100">
          {question.score} pts
        </Badge>
      </div>

      <Card className="border-cyan-200/25 bg-slate-950/70 shadow-[0_0_0_1px_rgba(34,211,238,0.07)] backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {question.title ? <CardTitle className="text-lg text-cyan-50">{question.title}</CardTitle> : null}
              <CardDescription className="mt-3 rounded-lg border border-cyan-200/15 bg-slate-900/50 px-3 py-2 text-cyan-100/80">
                {question.scenario}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-cyan-200/30 bg-transparent text-cyan-100/80">
                Section {question.section}
              </Badge>
              <Badge
                variant={
                  question.difficulty === "Easy"
                    ? "outline"
                    : question.difficulty === "Medium"
                      ? "secondary"
                      : "destructive"
                }
                className={question.difficulty === "Easy" ? "border-emerald-300/40 text-emerald-200" : ""}
              >
                {question.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {question.imageUrl && (
            <div className="overflow-hidden rounded-lg border border-white/20 bg-slate-950/60">
              <img
                src={question.imageUrl}
                alt={`${question.title} circuit diagram`}
                className="max-h-[360px] w-full object-contain"
              />
            </div>
          )}

          {isMcqType(question.type) && (
            <RadioGroup
              value={selectedAnswer}
              onValueChange={(value) => {
                if (readOnly) return;
                setSelectedAnswer(value);
                onAnswerChange(value);
              }}
            >
              <div className="space-y-3">
                {question.options?.map((option, idx) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                      selectedAnswer === option.id
                        ? "border-cyan-300/60 bg-cyan-300/15"
                        : "border-white/15 bg-slate-900/35 hover:bg-slate-900/60"
                    } ${readOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} disabled={readOnly} />
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 text-xs font-semibold text-cyan-100">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer text-cyan-50">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {question.type === "multi-select" && (
            <div className="space-y-3">
              {question.options?.map((option, idx) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                    selectedAnswers.includes(option.id)
                      ? "border-cyan-300/60 bg-cyan-300/15"
                      : "border-white/15 bg-slate-900/35 hover:bg-slate-900/60"
                  }`}
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedAnswers.includes(option.id)}
                    disabled={readOnly}
                    onCheckedChange={(checked) => {
                      if (readOnly) return;
                      if (checked) {
                        const next = [...selectedAnswers, option.id];
                        setSelectedAnswers(next);
                        onAnswerChange(next);
                      } else {
                        const next = selectedAnswers.filter((a) => a !== option.id);
                        setSelectedAnswers(next);
                        onAnswerChange(next);
                      }
                    }}
                  />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 text-xs font-semibold text-cyan-100">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer text-cyan-50">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {isMatchingType(question.type) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Match Items</h4>
              <DragDropMatching
                pairs={question.matchingPairs || []}
                currentAnswer={typeof currentAnswer === "string" ? currentAnswer : undefined}
                readOnly={readOnly}
                questionId={question.id}
                onAnswerChange={(answer) => {
                  try {
                    const parsed = JSON.parse(answer);
                    setMatchingAnswers(parsed && typeof parsed === "object" ? parsed : {});
                  } catch {
                    setMatchingAnswers({});
                  }
                  onAnswerChange(answer);
                }}
              />
            </div>
          )}

          {question.type === "connection-evaluation" && (
            <div className="space-y-4">
              {question.codeSnippet && (
                <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-white/15 bg-slate-950/70 p-3 text-xs text-cyan-100">
                  {question.codeSnippet}
                </pre>
              )}

              <ConnectionWiringCanvas
                sourceNodes={question.sourceNodes || []}
                targetNodes={question.targetNodes || []}
                currentAnswer={typeof currentAnswer === "string" ? currentAnswer : undefined}
                readOnly={readOnly}
                onAnswerChange={onAnswerChange}
              />
            </div>
          )}

          {question.type === "snippet-coding" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reference Wiring (read-only)</Label>
                <ConnectionWiringCanvas
                  sourceNodes={question.sourceNodes || []}
                  targetNodes={question.targetNodes || []}
                  currentAnswer={snippetExpectedAnswer}
                  readOnly
                  onAnswerChange={() => undefined}
                />
              </div>

              {question.codeSnippet && (
                <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-white/15 bg-slate-950/70 p-3 text-xs text-cyan-100">
                  {question.codeSnippet}
                </pre>
              )}

              <div className="space-y-2">
                <Label htmlFor={`snippet-${question.id}`}>Write Arduino snippet</Label>
                <Textarea
                  id={`snippet-${question.id}`}
                  value={selectedAnswer}
                  disabled={readOnly}
                  placeholder="void setup() { ... }\n\nvoid loop() { ... }"
                  className="min-h-56 border-white/20 bg-slate-950/80 font-mono text-xs"
                  onChange={(e) => {
                    if (readOnly) return;
                    const code = e.target.value;
                    setSelectedAnswer(code);
                    setSnippetRunResult(null);
                    onAnswerChange(code);
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={readOnly || snippetRunPending || !selectedAnswer.trim()}
                  onClick={async () => {
                    try {
                      setSnippetRunPending(true);
                      setSnippetRunResult(null);

                      const res = await fetch("/api/round1/snippet-execute", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code: selectedAnswer }),
                      });

                      const data = (await res.json()) as SnippetCompileResult & { error?: string };

                      if (!res.ok && data.error) {
                        setSnippetRunResult({
                          success: false,
                          message: data.error,
                          stdout: data.stdout || "",
                          stderr: data.stderr || "",
                          command: data.command || "arduino-cli compile",
                        });
                        return;
                      }

                      setSnippetRunResult({
                        success: Boolean(data.success),
                        message: data.message || (data.success ? "Compilation successful." : "Compilation failed."),
                        stdout: data.stdout || "",
                        stderr: data.stderr || "",
                        command: data.command || "arduino-cli compile",
                      });
                    } catch (error) {
                      setSnippetRunResult({
                        success: false,
                        message: "Compile check failed. Try again.",
                        stdout: "",
                        stderr: String(error),
                        command: "arduino-cli compile",
                      });
                    } finally {
                      setSnippetRunPending(false);
                    }
                  }}
                >
                  {snippetRunPending ? "Running Compile..." : "Execute Check"}
                </Button>

                {snippetRunResult ? (
                  <Badge variant={snippetRunResult.success ? "secondary" : "destructive"}>
                    {snippetRunResult.success ? "Compile Pass" : "Compile Failed"}
                  </Badge>
                ) : null}
              </div>

              {snippetRunResult ? (
                <div className="space-y-2 rounded-lg border border-white/15 bg-slate-900/45 p-3 text-xs">
                  <div>Result: {snippetRunResult.message}</div>
                  <div>Command: {snippetRunResult.command}</div>

                  {snippetRunResult.stderr ? (
                    <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded border bg-black p-2 text-[11px] text-red-200">
                      {snippetRunResult.stderr}
                    </pre>
                  ) : null}

                  {snippetRunResult.stdout ? (
                    <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded border bg-black p-2 text-[11px] text-emerald-200">
                      {snippetRunResult.stdout}
                    </pre>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-cyan-100/70">
            <span>
              {isMatchingType(question.type)
                ? matchingCompleted
                  ? "All matches selected"
                  : "Select all matches to complete this question"
                : question.type === "connection-evaluation"
                  ? "Connect sensor pins to Arduino pins just like a wiring lab."
                  : question.type === "snippet-coding"
                    ? "Use the read-only wiring board, complete the starter code, then Execute Check runs real arduino-cli compile."
                    : readOnly
                      ? "Segment locked. Answers are read-only."
                      : "Answer auto-saves on selection"}
            </span>
            <span>{isSaving ? "Saving..." : "Saved"}</span>
          </div>

          {showNavigation && (
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" onClick={onPrevious} disabled={!onPrevious || isSaving || readOnly}>
                Previous
              </Button>
              <Button type="button" variant="secondary" onClick={onNext} disabled={!onNext || isSaving || readOnly}>
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
