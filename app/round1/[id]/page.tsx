"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Round1Question } from "@/components/round1-question";
import { Round1Results } from "@/components/round1-results";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, Brain, LogOut } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

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
}

export default function Round1QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: participantId } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<'loading' | 'started' | 'completed'>('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Round1QuestionData[]>([]);
  const [result, setResult] = useState<any>(null);

  const { data: questionsData } = useSWR('/api/round1/questions', fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  const { data: participantData } = useSWR(
    participantId ? `/api/participants/${participantId}` : null,
    fetcher
  );

  useEffect(() => {
    const initRound1 = async () => {
      try {
        if (!questionsData?.questions || questionsData.questions.length === 0) {
          setError('No questions available for Round 1');
          setIsLoading(false);
          return;
        }

        if (!participantData?.participant) {
          setError('Participant not found');
          setIsLoading(false);
          return;
        }

        // Randomize question order
        const shuffled = [...questionsData.questions].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setQuizState('started');
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Round 1:', err);
        setError('Failed to initialize quiz');
        setIsLoading(false);
      }
    };

    if (questionsData && participantData) {
      initRound1();
    }
  }, [questionsData, participantData]);

  const handleAnswer = useCallback(async (answer: string | string[]) => {
    try {
      const currentQuestion = questions[currentQuestionIndex];

      // Record response
      await fetch('/api/round1/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          questionId: currentQuestion.id,
          answer,
          timeTaken: currentQuestion.timeLimit - (currentQuestion.timeLimit % 60),
        }),
      });

      // Move to next question or complete
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz completed - fetch results
        const resultRes = await fetch(
          `/api/round1/responses?participantId=${participantId}&action=submit`
        );
        const resultData = await resultRes.json();
        setResult(resultData.result);
        setQuizState('completed');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer');
    }
  }, [currentQuestionIndex, questions, participantId]);

  const handleTimeUp = useCallback(() => {
    // Auto-submit empty answer
    handleAnswer(Array.isArray(questions[currentQuestionIndex].correctAnswer) ? [] : '');
  }, [currentQuestionIndex, questions, handleAnswer]);

  const handleQuitQuiz = async () => {
    if (confirm('Are you sure you want to quit? Your progress will not be saved.')) {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Loading Round 1 Quiz</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Spinner className="h-8 w-8" />
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
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (quizState === 'completed' && result) {
    const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

    return (
      <main className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Round 1 - Results</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Exit
            </Button>
          </div>

          <Round1Results result={result} maxScore={totalScore} />
        </div>
      </main>
    );
  }

  if (quizState === 'started' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <main className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Round 1 - Interactive Challenge
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuitQuiz}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Quit
            </Button>
          </div>

          <Round1Question
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onTimeUp={handleTimeUp}
          />
        </div>
      </main>
    );
  }

  return null;
}
