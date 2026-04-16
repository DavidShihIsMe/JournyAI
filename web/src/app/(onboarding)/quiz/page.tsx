"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QUIZ_QUESTIONS,
  computeDimensionScores,
  type QuizResponse,
} from "@lib/onboarding/quizQuestions";
import ProgressBar from "@/components/ProgressBar";

const ADVANCE_DELAY_MS = 400;
const TRANSITION_MS = 250;
const RESPONSES_KEY = "journy_quiz_responses";
const SCORES_KEY = "journy_dimension_scores";

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

export default function QuizPage() {
  const router = useRouter();
  const total = QUIZ_QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<Map<number, number>>(new Map());
  const [transitioning, setTransitioning] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUIZ_QUESTIONS[index];
  const currentValue = responses.get(question.id) ?? null;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const progress = Math.round(((index + (currentValue ? 1 : 0)) / total) * 100);

  const persistResponses = useCallback((map: Map<number, number>) => {
    if (typeof window === "undefined") return;
    const arr: QuizResponse[] = [];
    for (const q of QUIZ_QUESTIONS) {
      const value = map.get(q.id);
      if (value !== undefined) {
        arr.push({ questionId: q.id, dataKey: q.dataKey, value });
      }
    }
    window.localStorage.setItem(RESPONSES_KEY, JSON.stringify(arr));
    const scores = computeDimensionScores(arr);
    window.localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(RESPONSES_KEY);
    if (!raw) return;
    try {
      const parsed: QuizResponse[] = JSON.parse(raw);
      const map = new Map<number, number>();
      for (const r of parsed) map.set(r.questionId, r.value);
      setResponses(map);
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const goToIndex = useCallback((next: number) => {
    setTransitioning(true);
    window.setTimeout(() => {
      setIndex(next);
      setTransitioning(false);
    }, TRANSITION_MS);
  }, []);

  const finish = useCallback(() => {
    setTransitioning(true);
    window.setTimeout(() => {
      router.push("/interests");
    }, TRANSITION_MS);
  }, [router]);

  const handleSelect = useCallback(
    (value: number) => {
      if (transitioning) return;
      const updated = new Map(responses);
      updated.set(question.id, value);
      setResponses(updated);
      persistResponses(updated);

      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        if (isLast) {
          finish();
        } else {
          goToIndex(index + 1);
        }
      }, ADVANCE_DELAY_MS);
    },
    [transitioning, responses, question.id, persistResponses, isLast, goToIndex, finish, index]
  );

  const handleBack = useCallback(() => {
    if (isFirst || transitioning) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    goToIndex(index - 1);
  }, [isFirst, transitioning, goToIndex, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= "1" && e.key <= "7") {
        handleSelect(Number(e.key));
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        if (!isFirst) {
          e.preventDefault();
          handleBack();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSelect, handleBack, isFirst]);

  const circles = useMemo(
    () =>
      SCALE_VALUES.map((n) => ({
        value: n,
        diameter:
          n === 1 || n === 7 ? 56 : n === 2 || n === 6 ? 50 : n === 3 || n === 5 ? 46 : 44,
      })),
    []
  );

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="w-full px-5 sm:px-8 pt-6">
        <div className="max-w-[600px] mx-auto">
          <ProgressBar progress={progress} />
          <div className="mt-3 flex items-center justify-between">
            {isFirst ? (
              <span aria-hidden className="block h-6" />
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="font-body text-sm text-neutral-600 hover:text-primary transition-colors"
              >
                ← Back
              </button>
            )}
            <span className="font-body text-sm text-[#9CA3AF]">
              {index + 1} of {total}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <div
          className={`w-full max-w-[600px] flex flex-col items-center transition-opacity duration-[250ms] ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
          aria-live="polite"
        >
          <h1 className="font-display font-bold text-2xl sm:text-[32px] text-[#111827] text-center leading-snug">
            {question.statement}
          </h1>

          <div className="mt-12 sm:mt-16 w-full">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {circles.map(({ value, diameter }) => {
                const selected = currentValue === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelect(value)}
                    aria-label={`Rate ${value} of 7`}
                    aria-pressed={selected}
                    className={`
                      rounded-full border-2 flex-shrink-0
                      transition-all duration-150
                      ${
                        selected
                          ? "bg-primary border-primary scale-110 shadow-sm"
                          : "bg-white border-[#D1D5DB] hover:border-primary"
                      }
                    `}
                    style={{ width: diameter, height: diameter }}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex justify-between">
              <span className="font-body text-xs sm:text-sm text-[#9CA3AF]">
                Strongly Disagree
              </span>
              <span className="font-body text-xs sm:text-sm text-[#9CA3AF]">
                Strongly Agree
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
