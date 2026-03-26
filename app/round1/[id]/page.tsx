"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Brain, CheckCircle2, Clock3, Layers3, Radar } from "lucide-react";

import { Round1Question } from "@/components/round1-question";
import { Round1Proctoring } from "@/components/round1-proctoring";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";

interface Round1QuestionData {
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
  correctAnswer?: string | string[];
  codeSnippet?: string;
  sourceNodes?: string[];
  targetNodes?: string[];
  expectedConnections?: Array<{ from: string; to: string }>;
  scenario_group?: string;
}

interface Round1Session {
  started_at: string;
  expires_at: string;
}

type SegmentId = "mcq" | "scenario" | "connection" | "snippet";

interface SegmentMeta {
  id: SegmentId;
  title: string;
  subtitle: string;
}

const SEGMENTS: SegmentMeta[] = [
  {
    id: "mcq",
    title: "Segment 1: MCQ",
    subtitle: "20 questions. You can move within this segment before locking.",
  },
  {
    id: "scenario",
    title: "Segment 2: Scenario",
    subtitle: "2 scenarios with 5 questions each.",
  },
  {
    id: "connection",
    title: "Segment 3: Connecting Elements",
    subtitle: "Map sensors/actuators to board pins based on code.",
  },
  {
    id: "snippet",
    title: "Segment 4: Basic Snippet Coding",
    subtitle: "Write a basic Arduino snippet from the provided connection map.",
  },
];

const SEGMENT_INDEX: Record<SegmentId, number> = {
  mcq: 0,
  scenario: 1,
  connection: 2,
  snippet: 3,
};

const SEGMENT_BY_INDEX: SegmentId[] = ["mcq", "scenario", "connection", "snippet"];

function getSegmentId(question: Round1QuestionData): SegmentId {
  if (question.type === "mcq") return "mcq";
  if (question.type === "scenario-mcq") return "scenario";
  if (question.type === "connection-evaluation") return "connection";
  return "snippet";
}

function isAnswered(value: string | string[] | undefined): boolean {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
}

export default function Round1QuizPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fallbackId = pathname?.split("/").filter(Boolean).at(-1);
  const participantId = params?.id || fallbackId;
  const router = useRouter();
  const enforceFullscreen = process.env.NODE_ENV === "production" && searchParams.get("proctor") !== "off";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<"loading" | "started" | "completed">("loading");
  const [questions, setQuestions] = useState<Round1QuestionData[]>([]);
  const [session, setSession] = useState<Round1Session | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(3600);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<number, string | string[]>>({});
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [sectionMoveDialogOpen, setSectionMoveDialogOpen] = useState(false);
  const [nextSegment, setNextSegment] = useState<SegmentId | null>(null);

  const [activeSegment, setActiveSegment] = useState<SegmentId>("mcq");
  const [unlockedSection, setUnlockedSection] = useState(0);

  const questionsBySegment = useMemo(() => {
    const grouped: Record<SegmentId, Round1QuestionData[]> = {
      mcq: [],
      scenario: [],
      connection: [],
      snippet: [],
    };
    questions.forEach((question) => {
      grouped[getSegmentId(question)].push(question);
    });
    return grouped;
  }, [questions]);

  const activeQuestions = questionsBySegment[activeSegment];

  const segmentCompletion = useMemo(() => {
    const completion: Record<SegmentId, { total: number; answered: number; allAnswered: boolean }> = {
      mcq: { total: 0, answered: 0, allAnswered: false },
      scenario: { total: 0, answered: 0, allAnswered: false },
      connection: { total: 0, answered: 0, allAnswered: false },
      snippet: { total: 0, answered: 0, allAnswered: false },
    };

    (Object.keys(questionsBySegment) as SegmentId[]).forEach((segment) => {
      const segmentQuestions = questionsBySegment[segment];
      const answered = segmentQuestions.filter((q) => isAnswered(answersByQuestionId[q.id])).length;
      completion[segment] = {
        total: segmentQuestions.length,
        answered,
        allAnswered: segmentQuestions.length > 0 && answered === segmentQuestions.length,
      };
    });

    return completion;
  }, [questionsBySegment, answersByQuestionId]);

  useEffect(() => {
    const initRound1 = async () => {
      if (!participantId) {
        setError("Invalid participant ID.");
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/round1/questions?participantId=${participantId}&action=start`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to initialize Round 1");
          setIsLoading(false);
          return;
        }

        if (!data?.questions || data.questions.length === 0) {
          setError("No Round 1 question set is available.");
          setIsLoading(false);
          return;
        }

        setSession(data.session);
        setQuestions(data.questions);

        const responses = data.responses || [];
        const existingAnswers: Record<number, string | string[]> = {};
        responses.forEach((r: { question_id: number; answer: string | string[] }) => {
          existingAnswers[r.question_id] = r.answer;
        });
        setAnswersByQuestionId(existingAnswers);

        const answeredIds = new Set(Object.keys(existingAnswers).map((id) => Number(id)));
        const scenarioQuestions = data.questions.filter((q: Round1QuestionData) => q.type === "scenario-mcq");
        const connectionQuestions = data.questions.filter((q: Round1QuestionData) => q.type === "connection-evaluation");
        const snippetQuestions = data.questions.filter((q: Round1QuestionData) => q.type === "snippet-coding");

        const hasScenarioAnswer = scenarioQuestions.some((q: Round1QuestionData) => answeredIds.has(q.id));
        const hasAllConnectionAnswers =
          connectionQuestions.length > 0 && connectionQuestions.every((q: Round1QuestionData) => answeredIds.has(q.id));
        const hasAllSnippetAnswers =
          snippetQuestions.length > 0 && snippetQuestions.every((q: Round1QuestionData) => answeredIds.has(q.id));

        const inferredUnlocked = hasAllSnippetAnswers ? 3 : hasAllConnectionAnswers ? 2 : hasScenarioAnswer ? 1 : 0;
        const serverUnlocked = typeof data?.unlockedSection === "number" ? data.unlockedSection : 0;
        const effectiveUnlocked = Math.max(serverUnlocked, inferredUnlocked);
        setUnlockedSection(effectiveUnlocked);
        setActiveSegment(SEGMENT_BY_INDEX[Math.max(0, Math.min(3, effectiveUnlocked))]);

        setQuizState("started");
        setIsLoading(false);
      } catch (initError) {
        console.error("Error initializing Round 1:", initError);
        setError("Failed to initialize quiz");
        setIsLoading(false);
      }
    };

    initRound1();
  }, [participantId]);

  useEffect(() => {
    if (!session || quizState !== "started") return;
    const tick = () => {
      const left = Math.max(0, Math.floor((new Date(session.expires_at).getTime() - Date.now()) / 1000));
      setRemainingSeconds(left);
      if (left <= 0) {
        void submitRound();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [session, quizState]);

  const submitRound = useCallback(async () => {
    if (isFinalizing || !participantId) return;
    setIsFinalizing(true);
    const resultRes = await fetch(`/api/round1/responses?participantId=${participantId}&action=submit`);
    const resultData = await resultRes.json();
    if (resultData?.result) {
      await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lock" }),
      });
      setQuizState("completed");
    }
    setIsFinalizing(false);
  }, [participantId, isFinalizing]);

  const handleAnswerChange = useCallback(async (question: Round1QuestionData, answer: string | string[]) => {
    if (!participantId) return;

    try {
      setAnswersByQuestionId((prev) => ({ ...prev, [question.id]: answer }));
      setIsSavingAnswer(true);

      await fetch("/api/round1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          questionId: question.id,
          answer,
          timeTaken: 0,
        }),
      });
    } catch (saveError) {
      console.error("Error submitting answer:", saveError);
      setError("Failed to save answer");
    } finally {
      setIsSavingAnswer(false);
    }
  }, [participantId]);

  const commitCurrentSegment = useCallback(async () => {
    if (!participantId) return;

    if (activeSegment === "snippet") {
      setSubmitDialogOpen(true);
      return;
    }

    const nextIndex = Math.min(3, SEGMENT_INDEX[activeSegment] + 1);
    const next = SEGMENT_BY_INDEX[nextIndex];

    if (nextIndex <= unlockedSection) {
      setActiveSegment(next);
      return;
    }

    const res = await fetch("/api/round1/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance_section", participantId }),
    });

    if (!res.ok) {
      setError("Failed to move to next section");
      return;
    }

    const data = await res.json();
    const serverUnlocked = typeof data?.unlockedSection === "number" ? data.unlockedSection : nextIndex;
    setUnlockedSection((prev) => Math.max(prev, serverUnlocked, nextIndex));
    setActiveSegment(next);
  }, [activeSegment, participantId, unlockedSection]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const scrollToQuestion = (questionId: number) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const groupedScenarioQuestions = useMemo(() => {
    const groups = new Map<string, Round1QuestionData[]>();
    activeQuestions.forEach((question) => {
      const key = question.scenario_group || "scenario";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(question);
    });
    return Array.from(groups.entries());
  }, [activeQuestions]);

  const activeSegmentStats = segmentCompletion[activeSegment];
  const activeProgress = activeSegmentStats.total > 0 ? (activeSegmentStats.answered / activeSegmentStats.total) * 100 : 0;

  if (isLoading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-background p-4">
        <div className="iot-grid-overlay" />
        <Card className="w-full max-w-xl border-cyan-200/20 bg-slate-950/70 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/35 bg-cyan-300/10">
              <Radar className="h-8 w-8 text-cyan-200" />
            </div>
            <CardTitle className="text-cyan-50">Preparing Round 1 Control Deck</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-6">
            <div className="flex justify-center">
              <Spinner className="h-8 w-8" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md border border-cyan-200/20 bg-slate-900/55 px-3 py-2 text-center text-cyan-100/75">Syncing participant profile</div>
              <div className="rounded-md border border-cyan-200/20 bg-slate-900/55 px-3 py-2 text-center text-cyan-100/75">Loading segment set</div>
              <div className="rounded-md border border-cyan-200/20 bg-slate-900/55 px-3 py-2 text-center text-cyan-100/75">Restoring saved answers</div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (quizState === "completed") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Submission Received</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your Round 1 answers have been submitted.
            </p>
            <p className="text-sm text-muted-foreground">
              Your participant ID is now locked.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background p-4">
      <div className="iot-grid-overlay" />
      {participantId && <Round1Proctoring participantId={participantId} enabled={true} enforceFullscreen={enforceFullscreen} />}

      <div className="relative mx-auto max-w-7xl space-y-6 py-6">
        <Card className="border-cyan-200/20 bg-slate-950/65 backdrop-blur-lg">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-semibold text-cyan-50">
                <Brain className="h-6 w-6 text-cyan-200" />
                Round 1 - Segmented Test
              </h1>
              <p className="mt-1 text-sm text-cyan-100/70">Secure assessment interface with section locking and automatic answer persistence.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1 border-cyan-200/30 bg-cyan-400/10 px-3 py-1 text-cyan-100">
                <Clock3 className="h-3.5 w-3.5" />
                <span className="font-mono text-base font-semibold">{formatTime(remainingSeconds)}</span>
              </Badge>
            <Button variant="destructive" onClick={() => setSubmitDialogOpen(true)} disabled={isFinalizing}>
              {isFinalizing ? "Submitting..." : "Final Submit"}
            </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-200/20 bg-slate-950/55">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-cyan-100/80"><Layers3 className="h-4 w-4" /> Current Segment Progress</span>
              <span className="font-medium text-cyan-50">{activeSegmentStats.answered}/{activeSegmentStats.total} answered</span>
            </div>
            <Progress value={activeProgress} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
            <Card className="border-cyan-200/20 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-base text-cyan-50">Segments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SEGMENTS.map((segment) => {
                  const stats = segmentCompletion[segment.id];
                  const isActive = activeSegment === segment.id;
                  const segmentIdx = SEGMENT_INDEX[segment.id];
                  const isBlocked = segmentIdx > unlockedSection;
                  const hasBeenReached = segmentIdx < unlockedSection;

                  return (
                    <button
                      key={segment.id}
                      type="button"
                      className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${isActive ? "border-cyan-300/50 bg-cyan-300/10" : "border-white/15 bg-slate-900/45 hover:bg-slate-900/70"} ${isBlocked ? "cursor-not-allowed opacity-50" : ""}`}
                      onClick={() => {
                        if (!isBlocked) setActiveSegment(segment.id);
                      }}
                      disabled={isBlocked}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-cyan-50">{segment.title}</span>
                        {hasBeenReached ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : null}
                      </div>
                      <p className="mt-1 text-xs text-cyan-100/70">{stats.answered}/{stats.total} answered</p>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-cyan-200/20 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-base text-cyan-50">Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {activeQuestions.map((question, index) => {
                    const answered = isAnswered(answersByQuestionId[question.id]);
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => scrollToQuestion(question.id)}
                        className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${answered ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200" : "border-white/20 bg-slate-900/40 text-cyan-100/70 hover:bg-slate-900/70"}`}
                      >
                        Q{index + 1}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-cyan-100/70">Green = answered</p>
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-4">
            <Card className="border-cyan-200/20 bg-slate-950/60">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-50">{SEGMENTS.find((s) => s.id === activeSegment)?.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-cyan-100/75">{SEGMENTS.find((s) => s.id === activeSegment)?.subtitle}</p>
                <Badge variant="outline" className="border-cyan-200/30 text-cyan-100">Editable</Badge>
              </CardContent>
            </Card>

            {activeSegment !== "scenario" && activeQuestions.map((question, index) => (
              <div key={question.id} id={`question-${question.id}`}>
                <Round1Question
                  question={question}
                  questionNumber={index + 1}
                  totalQuestions={activeQuestions.length}
                  currentAnswer={answersByQuestionId[question.id]}
                  onAnswerChange={(answer) => handleAnswerChange(question, answer)}
                  isSaving={isSavingAnswer}
                  readOnly={false}
                  showNavigation={false}
                />
              </div>
            ))}

            {activeSegment === "scenario" && groupedScenarioQuestions.map(([groupId, groupQuestions], groupIndex) => (
              <div key={groupId} className="space-y-4">
                <Card className="border-cyan-200/20 bg-slate-950/55">
                  <CardHeader>
                    <CardTitle className="text-base text-cyan-50">Scenario Group {groupIndex + 1}</CardTitle>
                  </CardHeader>
                </Card>
                {groupQuestions.map((question, index) => (
                  <div key={question.id} id={`question-${question.id}`}>
                    <Round1Question
                      question={question}
                      questionNumber={index + 1}
                      totalQuestions={groupQuestions.length}
                      currentAnswer={answersByQuestionId[question.id]}
                      onAnswerChange={(answer) => handleAnswerChange(question, answer)}
                      isSaving={isSavingAnswer}
                      readOnly={false}
                      showNavigation={false}
                    />
                  </div>
                ))}
              </div>
            ))}

            <Card className="border-cyan-200/20 bg-slate-950/60">
              <CardContent className="pt-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-cyan-100/75">
                  {segmentCompletion[activeSegment].answered}/{segmentCompletion[activeSegment].total} answered
                </p>
                <Button
                  onClick={() => {
                    if (activeSegment === "snippet") {
                      void commitCurrentSegment();
                      return;
                    }
                    const nextIndex = Math.min(3, SEGMENT_INDEX[activeSegment] + 1);
                    setNextSegment(SEGMENT_BY_INDEX[nextIndex]);
                    setSectionMoveDialogOpen(true);
                  }}
                  disabled={isSavingAnswer}
                >
                  {activeSegment === "mcq" && "Move to Scenario Section"}
                  {activeSegment === "scenario" && "Move to Connecting Elements Section"}
                  {activeSegment === "connection" && "Move to Basic Snippet Coding Section"}
                  {activeSegment === "snippet" && "Complete Segment and Review Submit"}
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Round 1?</AlertDialogTitle>
            <AlertDialogDescription>
              After submission, answers are locked and your participant session will be closed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await submitRound();
                setSubmitDialogOpen(false);
                router.push("/");
              }}
            >
              Yes, Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={sectionMoveDialogOpen} onOpenChange={setSectionMoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move To Next Section?</AlertDialogTitle>
            <AlertDialogDescription>
              Move to {nextSegment === "scenario" ? "Scenario" : nextSegment === "connection" ? "Connecting Elements" : "Basic Snippet Coding"} section now? You can return to previously unlocked sections later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay Here</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await commitCurrentSegment();
                setSectionMoveDialogOpen(false);
              }}
            >
              Yes, Move Next
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
