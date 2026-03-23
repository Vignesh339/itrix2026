"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, CheckCircle2 } from "lucide-react";

interface Question {
  id: number;
  title: string;
  section: "A" | "B" | "C" | "D";
  difficulty: "Easy" | "Medium" | "Hard";
  score: number;
  type: string;
}

interface Participant {
  id: string;
  name: string;
  assigned_round: string;
}

interface QuestionFilterAssignProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: Question[];
  participants: Participant[];
  onAssign: (questionIds: number[], participantIds: string[]) => Promise<void>;
}

export function QuestionFilterAssign({
  open,
  onOpenChange,
  questions,
  participants,
  onAssign,
}: QuestionFilterAssignProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [sectionFilter, setSectionFilter] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const round1Participants = participants.filter(p => p.assigned_round === "round1");

  const filteredQuestions = questions.filter((q) => {
    if (sectionFilter && q.section !== sectionFilter) return false;
    if (difficultyFilter && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  const handleAssign = async () => {
    if (selectedQuestions.length === 0 || selectedParticipants.length === 0) return;
    
    setLoading(true);
    try {
      await onAssign(selectedQuestions, selectedParticipants);
      setSelectedQuestions([]);
      setSelectedParticipants([]);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (id: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedQuestions(filteredQuestions.map((q) => q.id));
  };

  const clearSelection = () => {
    setSelectedQuestions([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Assign Questions to Participants</DialogTitle>
          <DialogDescription>
            Select questions and participants to create customized question sets
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="questions" className="w-full">
          <TabsList>
            <TabsTrigger value="questions">Select Questions ({selectedQuestions.length})</TabsTrigger>
            <TabsTrigger value="participants">Select Participants ({selectedParticipants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex gap-2">
              <Select value={sectionFilter || ""} onValueChange={(v) => setSectionFilter(v || null)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                </SelectContent>
              </Select>

              <Select value={difficultyFilter || ""} onValueChange={(v) => setDifficultyFilter(v || null)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={selectAllFiltered}
                disabled={filteredQuestions.length === 0}
                size="sm"
              >
                Select All Filtered
              </Button>
              <Button variant="outline" onClick={clearSelection} size="sm">
                Clear
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4">
              {filteredQuestions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No questions match filters</p>
              ) : (
                filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <Checkbox
                      checked={selectedQuestions.includes(q.id)}
                      onCheckedChange={() => toggleQuestion(q.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{q.title}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="outline">{q.section}</Badge>
                      <Badge variant={q.difficulty === "Easy" ? "secondary" : q.difficulty === "Medium" ? "outline" : "destructive"}>
                        {q.difficulty}
                      </Badge>
                      <Badge>{q.score} pts</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Showing {filteredQuestions.length} of {questions.length} questions</span>
              <span>Selected: {selectedQuestions.length}</span>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Only Round 1 participants are shown. Currently: {round1Participants.length} participant(s)
            </p>

            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4">
              {round1Participants.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No Round 1 participants. Create participants and assign them to Round 1 first.
                </p>
              ) : (
                round1Participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => toggleParticipant(p.id)}
                  >
                    <Checkbox
                      checked={selectedParticipants.includes(p.id)}
                      onCheckedChange={() => toggleParticipant(p.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Selected: {selectedParticipants.length} participant(s)
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              loading ||
              selectedQuestions.length === 0 ||
              selectedParticipants.length === 0
            }
            className="gap-2"
          >
            {loading ? (
              "Assigning..."
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Assign {selectedQuestions.length} Questions
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
