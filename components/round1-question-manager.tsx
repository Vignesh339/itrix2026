"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Trash2, Edit, BarChart3, Sparkles, Filter } from "lucide-react";
import { AIQuestionGenerator } from "./ai-question-generator";
import { QuestionFilterAssign } from "./question-filter-assign";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface QuestionData {
  id: number;
  title: string;
  type: string;
  section: string;
  difficulty: string;
  score: number;
  timeLimit: number;
}

export function Round1QuestionManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "mcq",
    section: "A",
    difficulty: "Medium",
    score: "10",
    timeLimit: "45",
  });

  const { data: questionsData, mutate: refreshQuestions } = useSWR(
    "/api/round1/questions",
    fetcher,
    { refreshInterval: 5000 }
  );

  const { data: participantsData } = useSWR(
    "/api/participants",
    fetcher,
    { refreshInterval: 5000 }
  );

  const handleAddQuestion = async () => {
    try {
      const res = await fetch("/api/round1/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          score: parseInt(formData.score),
          timeLimit: parseInt(formData.timeLimit),
          scenario: "Question scenario here",
          options: [
            { id: "1", text: "Option 1" },
            { id: "2", text: "Option 2" },
            { id: "3", text: "Option 3" },
            { id: "4", text: "Option 4" },
          ],
          correctAnswer: "1",
        }),
      });

      if (res.ok) {
        setFormData({
          title: "",
          type: "mcq",
          section: "A",
          difficulty: "Medium",
          score: "10",
          timeLimit: "45",
        });
        setIsOpen(false);
        refreshQuestions();
      }
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await fetch(`/api/round1/questions?id=${id}`, { method: "DELETE" });
        refreshQuestions();
      } catch (error) {
        console.error("Failed to delete question:", error);
      }
    }
  };

  if (!questionsData) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </CardContent>
      </Card>
    );
  }

  const questions = questionsData.questions || [];

  const stats = {
    total: questions.length,
    sectionA: questions.filter((q: QuestionData) => q.section === "A").length,
    sectionB: questions.filter((q: QuestionData) => q.section === "B").length,
    sectionC: questions.filter((q: QuestionData) => q.section === "C").length,
    sectionD: questions.filter((q: QuestionData) => q.section === "D").length,
    totalScore: questions.reduce((sum: number, q: QuestionData) => sum + q.score, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Q</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        {["A", "B", "C", "D"].map((section) => (
          <Card key={section}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Section {section}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats[`section${section}` as keyof typeof stats]}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Max Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScore}</div>
          </CardContent>
        </Card>
      </div>

      {/* Question Manager */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Round 1 Questions</CardTitle>
            <CardDescription>Manage MCQ, matching, and simulation questions</CardDescription>
          </div>
          <div className="flex gap-2">
            <AIQuestionGenerator
              onQuestionsGenerated={async (questions) => {
                // Import generated questions
                for (const q of questions) {
                  await fetch("/api/round1/questions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      title: q.title,
                      type: q.type,
                      section: q.section,
                      difficulty: q.difficulty,
                      score: q.score,
                      timeLimit: 45,
                      scenario: q.scenario,
                      options: q.options,
                      correctAnswer: q.correctAnswer,
                      explanation: q.explanation,
                    }),
                  });
                }
                refreshQuestions();
              }}
            />
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Assign to Participants
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Round 1 Question</DialogTitle>
                  <DialogDescription>
                    Create a new question for Round 1 of the competition
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Question title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="multi-select">Multi-Select</SelectItem>
                          <SelectItem value="matching">Matching</SelectItem>
                          <SelectItem value="logic">Logic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Section</label>
                      <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
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
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
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

                    <div>
                      <label className="text-sm font-medium">Score</label>
                      <Input
                        type="number"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Time (s)</label>
                      <Input
                        type="number"
                        value={formData.timeLimit}
                        onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddQuestion}>Add Question</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question: QuestionData) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-mono text-sm">{question.id}</TableCell>
                    <TableCell>{question.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{question.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Section {question.section}</Badge>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="font-semibold">{question.score}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {question.timeLimit}s
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No questions yet. Create your first Round 1 question.
            </div>
          )}
        </CardContent>
      </Card>

      <QuestionFilterAssign
        open={filterOpen}
        onOpenChange={setFilterOpen}
        questions={questions}
        participants={participantsData?.participants || []}
        onAssign={async (questionIds, participantIds) => {
          // In production, this would save the assignment to database
          // For now, we just notify the user
          console.log("Assigned questions", questionIds, "to participants", participantIds);
        }}
      />
    </div>
  );
}
