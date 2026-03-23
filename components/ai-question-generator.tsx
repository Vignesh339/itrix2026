"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";

interface GeneratedQuestion {
  id: string;
  title: string;
  scenario: string;
  section: "A" | "B" | "C" | "D";
  difficulty: "Easy" | "Medium" | "Hard";
  type: "mcq" | "multi-select" | "matching" | "logic";
  options?: Array<{ text: string; isCorrect: boolean }>;
  correctAnswer?: string | string[];
  explanation?: string;
  score: number;
}

interface AIQuestionGeneratorProps {
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

export function AIQuestionGenerator({ onQuestionsGenerated }: AIQuestionGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [section, setSection] = useState<"A" | "B" | "C" | "D">("A");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState("5");
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [copied, setCopied] = useState(false);

  const generateQuestions = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      // Simulate AI generation with mock data
      // In production, this would call an actual AI API
      const mockQuestions: GeneratedQuestion[] = Array.from({ length: parseInt(count) }, (_, i) => ({
        id: `q${Date.now()}-${i}`,
        title: `${topic} - Question ${i + 1}`,
        scenario: `This question tests understanding of ${topic}. Consider the principles and applications discussed in this section.`,
        section,
        difficulty: difficulty as "Easy" | "Medium" | "Hard",
        type: i % 2 === 0 ? "mcq" : "multi-select",
        options: [
          { text: "Option A - Correct answer", isCorrect: true },
          { text: "Option B - Incorrect distractor", isCorrect: false },
          { text: "Option C - Incorrect distractor", isCorrect: false },
          { text: "Option D - Incorrect distractor", isCorrect: false },
        ],
        correctAnswer: i % 2 === 0 ? "Option A - Correct answer" : ["Option A - Correct answer"],
        explanation: `This is the correct answer because it aligns with the fundamental principles of ${topic}. The other options represent common misconceptions.`,
        score: difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3,
      }));

      setGeneratedQuestions(mockQuestions);
    } catch (error) {
      console.error("Failed to generate questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = JSON.stringify(generatedQuestions, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Generate Questions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-Powered Question Generator</DialogTitle>
          <DialogDescription>
            Generate MCQ questions using AI. Review and filter before finalizing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {generatedQuestions.length === 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic/Concept</label>
                <Input
                  placeholder="e.g., Arduino Digital I/O, Sensor Integration"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section</label>
                  <Select value={section} onValueChange={(value: any) => setSection(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                      <SelectItem value="D">Section D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Count</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={generateQuestions} disabled={loading || !topic} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Generated Questions ({generatedQuestions.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy JSON"}
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {generatedQuestions.map((q) => (
                  <Card key={q.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{q.title}</h4>
                        <div className="flex gap-1">
                          <Badge variant="outline">{q.section}</Badge>
                          <Badge variant={q.difficulty === "Easy" ? "secondary" : q.difficulty === "Medium" ? "outline" : "destructive"}>
                            {q.difficulty}
                          </Badge>
                          <Badge>{q.score} pts</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{q.scenario}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedQuestions([]);
                    setTopic("");
                  }}
                >
                  Generate More
                </Button>
                <Button
                  onClick={() => {
                    onQuestionsGenerated(generatedQuestions);
                    setOpen(false);
                    setGeneratedQuestions([]);
                    setTopic("");
                  }}
                  className="flex-1"
                >
                  Import to Questions
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
