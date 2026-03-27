"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Pair {
  id: string;
  left: string;
  right: string;
}

interface DragDropMatchingProps {
  pairs: Pair[];
  currentAnswer?: string;
  onAnswerChange: (answer: string) => void;
  readOnly?: boolean;
  questionId: number;
}

function shuffleDeterministic<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = ((seed * 1009 + i * 37) >>> 0) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function DragDropMatching({
  pairs,
  currentAnswer,
  onAnswerChange,
  readOnly = false,
  questionId,
}: DragDropMatchingProps) {
  const parseAnswer = (raw?: string): Record<string, string> => {
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const [answers, setAnswers] = useState<Record<string, string>>(() => parseAnswer(currentAnswer));
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [dragOverPool, setDragOverPool] = useState(false);
  const draggingRef = useRef<{ rightId: string; fromLeftId?: string } | null>(null);

  useEffect(() => {
    setAnswers(parseAnswer(currentAnswer));
  }, [currentAnswer, questionId]);

  const shuffledPool = shuffleDeterministic(pairs, questionId);

  const placedRightIds = new Set(Object.values(answers));
  const poolItems = shuffledPool.filter((p) => !placedRightIds.has(p.id));
  const pairById = Object.fromEntries(pairs.map((p) => [p.id, p]));

  const commit = (next: Record<string, string>) => {
    setAnswers(next);
    onAnswerChange(JSON.stringify(next));
  };

  const handleDragStart = (
    e: React.DragEvent,
    rightId: string,
    fromLeftId?: string
  ) => {
    if (readOnly) return;
    draggingRef.current = { rightId, fromLeftId };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", rightId);
  };

  const handleDropOnSlot = (leftId: string) => {
    const d = draggingRef.current;
    if (!d || readOnly) return;

    const next = { ...answers };
    if (d.fromLeftId) delete next[d.fromLeftId];
    next[leftId] = d.rightId;
    commit(next);
    draggingRef.current = null;
    setDragOverSlot(null);
  };

  const handleDropOnPool = () => {
    const d = draggingRef.current;
    if (!d || readOnly || !d.fromLeftId) return;

    const next = { ...answers };
    delete next[d.fromLeftId];
    commit(next);
    draggingRef.current = null;
    setDragOverPool(false);
  };

  const answeredCount = Object.keys(answers).length;
  const total = pairs.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs text-cyan-100/60">
        <span>Drag answers from the pool below into the matching slots</span>
        <Badge
          variant="outline"
          className={`border-cyan-200/30 text-cyan-100 ${answeredCount === total ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : ""}`}
        >
          {answeredCount}/{total} matched
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 px-1">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-cyan-400/70">
            Question
          </div>
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-cyan-400/70">
            Answer
          </div>
        </div>

        {pairs.map((pair) => {
          const placedRightId = answers[pair.id];
          const placedPair = placedRightId ? pairById[placedRightId] : null;
          const isOver = dragOverSlot === pair.id;

          return (
            <div key={pair.id} className="grid grid-cols-2 gap-2">
              <div className="flex min-h-[52px] items-center rounded-lg border border-white/15 bg-slate-900/60 px-4 py-3">
                <span className="text-sm text-cyan-100">{pair.left}</span>
              </div>

              <div
                onDragOver={(e) => {
                  if (readOnly) return;
                  e.preventDefault();
                  setDragOverSlot(pair.id);
                }}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnSlot(pair.id);
                }}
                className={`flex min-h-[52px] items-center rounded-lg border-2 border-dashed px-4 py-3 transition-all duration-150 ${
                  isOver
                    ? "border-cyan-400/80 bg-cyan-400/15 shadow-inner"
                    : placedPair
                      ? "border-cyan-300/50 bg-cyan-300/10"
                      : "border-white/20 bg-slate-900/30"
                }`}
              >
                {placedPair ? (
                  <div
                    draggable={!readOnly}
                    onDragStart={(e) =>
                      handleDragStart(e, placedPair.id, pair.id)
                    }
                    className={`w-full select-none rounded text-sm font-medium text-cyan-50 ${
                      readOnly ? "" : "cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    {placedPair.right}
                  </div>
                ) : (
                  <span className="text-xs italic text-cyan-100/35">
                    Drop here
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {readOnly ? (
        <div className="rounded-lg border border-white/10 bg-slate-900/30 px-4 py-3 text-xs text-cyan-100/50">
          Segment locked - answers are read-only
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverPool(true);
          }}
          onDragLeave={() => setDragOverPool(false)}
          onDrop={(e) => {
            e.preventDefault();
            handleDropOnPool();
          }}
          className={`min-h-[72px] rounded-xl border-2 p-4 transition-all duration-150 ${
            dragOverPool
              ? "border-amber-400/60 bg-amber-400/5"
              : "border-white/15 bg-slate-900/35"
          }`}
        >
          <p className="mb-3 text-xs font-medium text-cyan-100/50">
            Answer Pool - drag to match
            {dragOverPool && (
              <span className="ml-2 text-amber-300/80">
                Release to return here
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {poolItems.length === 0 ? (
              <p className="text-xs italic text-emerald-300/60">
                All answers placed - drag back here to change
              </p>
            ) : (
              poolItems.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, p.id)}
                  className="cursor-grab select-none rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100 transition-colors hover:border-cyan-300/60 hover:bg-cyan-300/20 active:cursor-grabbing"
                >
                  {p.right}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
