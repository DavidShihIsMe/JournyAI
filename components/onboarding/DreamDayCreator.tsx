"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { DreamDayStep } from "@/lib/onboarding/dreamDay";
import {
  FIXED_STEPS,
  selectDynamicSteps,
  buildAllSteps,
  scoreDreamDayChoice,
} from "@/lib/onboarding/dreamDay";
import type { DimensionKey } from "@/lib/constants/dimensions";
import type { DreamDayResponse } from "@/lib/onboarding/types";

interface DreamDayCreatorProps {
  currentScores: {
    plan_flow_score: number;
    busy_relaxed_score: number;
    comfort_discomfort_score: number;
    immerse_observe_score: number;
  };
  currentConfidence: Record<DimensionKey, number>;
  onComplete: (
    responses: DreamDayResponse[],
    updatedScores: {
      plan_flow_score: number;
      busy_relaxed_score: number;
      comfort_discomfort_score: number;
      immerse_observe_score: number;
    }
  ) => void;
}

type Phase = "intro" | "steps" | "summary";

export default function DreamDayCreator({
  currentScores,
  currentConfidence,
  onComplete,
}: DreamDayCreatorProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState<DreamDayResponse[]>([]);
  const [allSteps, setAllSteps] = useState<DreamDayStep[] | null>(null);
  const [lastTransition, setLastTransition] = useState<string | null>(null);

  // Get the current step list — fixed steps for 1-4, then dynamic after step 4
  const steps = useMemo(() => {
    if (allSteps) return allSteps;
    return FIXED_STEPS;
  }, [allSteps]);

  const currentStep = steps[stepIndex] as DreamDayStep | undefined;

  function handleStart() {
    setPhase("steps");
  }

  function handleChoice(choice: "left" | "right") {
    if (!currentStep) return;

    const response: DreamDayResponse = {
      step_number: currentStep.step_number,
      dimension: currentStep.dimension,
      choice,
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Set transition text for next step
    const transition = currentStep.transitions?.[choice] ?? null;
    setLastTransition(transition);

    const nextIndex = stepIndex + 1;

    // After step 4, calculate dynamic steps if not yet done
    if (currentStep.step_number === 4 && !allSteps) {
      // Update confidence based on fixed steps
      const updatedConfidence = { ...currentConfidence };
      for (const r of newResponses) {
        const dim = r.dimension as DimensionKey;
        // Each dream day response adds some confidence
        updatedConfidence[dim] = Math.min(100, updatedConfidence[dim] + 10);
      }

      const dynamicDimensions = selectDynamicSteps(updatedConfidence);
      const fullSteps = buildAllSteps(dynamicDimensions);
      setAllSteps(fullSteps);
      setStepIndex(nextIndex);
      return;
    }

    // After last step, go to summary
    if (nextIndex >= steps.length) {
      setPhase("summary");
      return;
    }

    setStepIndex(nextIndex);
  }

  function handleFinish() {
    // Calculate updated scores
    const updatedScores = { ...currentScores };
    for (const r of responses) {
      const dim = r.dimension as DimensionKey;
      const key = `${dim}_score` as keyof typeof updatedScores;
      const adjustment = scoreDreamDayChoice(dim, r.choice);
      updatedScores[key] = Math.min(100, Math.max(0, updatedScores[key] + adjustment));
    }

    onComplete(responses, updatedScores);
  }

  // Intro screen
  if (phase === "intro") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Let&apos;s plan your perfect day</h1>
          <p className="mt-2 text-muted-foreground">
            6 moments. Pick the one that feels right.
          </p>
        </div>
        <Button onClick={handleStart} size="lg">
          Start
        </Button>
      </div>
    );
  }

  // Summary screen
  if (phase === "summary") {
    const finalSteps = allSteps ?? FIXED_STEPS;
    return (
      <div className="flex min-h-screen flex-col px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">Here&apos;s the day you built</h1>
        <div className="flex-1 space-y-0">
          {responses.map((r, i) => {
            const step = finalSteps[i];
            const chosenText =
              r.choice === "left" ? step.left_option : step.right_option;
            return (
              <div key={r.step_number} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  {i < responses.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {step.time_of_day}
                  </p>
                  <p className="mt-1 text-sm">{chosenText}</p>
                </div>
              </div>
            );
          })}
        </div>
        <Button className="mt-6 w-full" onClick={handleFinish}>
          See your results
        </Button>
      </div>
    );
  }

  // Step screen
  if (!currentStep) return null;

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {stepIndex + 1} of {steps.length}
        </span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < stepIndex
                  ? "bg-primary"
                  : i === stepIndex
                    ? "bg-primary/60"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Transition text */}
      {lastTransition && (
        <p className="mb-4 text-sm italic text-muted-foreground">
          {lastTransition}
        </p>
      )}

      {/* Time of day */}
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {currentStep.time_of_day}
      </p>

      {/* Prompt */}
      <h2 className="mb-6 text-xl font-semibold">{currentStep.prompt}</h2>

      {/* Option cards */}
      <div className="grid flex-1 grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleChoice("left")}
          className="flex flex-col rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
        >
          <div className="mb-3 aspect-square w-full rounded-lg bg-neutral-200" />
          <p className="text-sm font-medium leading-snug">
            {currentStep.left_option}
          </p>
        </button>
        <button
          type="button"
          onClick={() => handleChoice("right")}
          className="flex flex-col rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
        >
          <div className="mb-3 aspect-square w-full rounded-lg bg-neutral-200" />
          <p className="text-sm font-medium leading-snug">
            {currentStep.right_option}
          </p>
        </button>
      </div>
    </div>
  );
}
