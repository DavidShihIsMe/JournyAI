"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/services/auth";
import { saveSwipeResponses } from "@/lib/services/swipe";
import { upsertTravelerProfile } from "@/lib/services/profile";
import { saveInterests } from "@/lib/services/interests";
import { saveDreamDayResponses } from "@/lib/services/dreamDay";
import { swipeCards } from "@/lib/onboarding/cards";
import { INTERESTS, POPULAR_INTERESTS } from "@/lib/constants/interests";
import { calculateDimensionScores, determineTypeCode } from "@/lib/onboarding/scoring";
import type { CardResponse, DimensionScores, DreamDayResponse } from "@/lib/onboarding/types";
import type { DimensionKey } from "@/lib/constants/dimensions";
import SwipeCardStack from "@/components/onboarding/SwipeCardStack";
import InterestPicker from "@/components/onboarding/InterestPicker";
import DreamDayCreator from "@/components/onboarding/DreamDayCreator";
import { Button } from "@/components/ui/button";

type Stage = "swipe" | "interests" | "dream_day" | "reveal";

export default function OnboardingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("swipe");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Persist swipe scores across stages
  const [swipeScores, setSwipeScores] = useState<DimensionScores | null>(null);

  // Final type reveal data
  const [revealData, setRevealData] = useState<{
    type_code: string;
    type_name: string;
    plan_flow_score: number;
    busy_relaxed_score: number;
    comfort_discomfort_score: number;
    immerse_observe_score: number;
  } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    getCurrentUser(supabase).then(({ user }) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.id);
      }
    });
  }, [router]);

  const handleSwipeComplete = useCallback(
    async (responses: CardResponse[]) => {
      if (!userId) return;
      setSaving(true);
      setError("");

      try {
        const supabase = createClient();

        const scores = calculateDimensionScores(responses, swipeCards);
        setSwipeScores(scores);

        const { type_code, type_name } = determineTypeCode(scores);
        const overallConfidence = Math.round(
          (scores.confidence.plan_flow +
            scores.confidence.busy_relaxed +
            scores.confidence.comfort_discomfort +
            scores.confidence.immerse_observe) /
            4
        );

        const { error: swipeError } = await saveSwipeResponses(supabase, userId, responses);
        if (swipeError) {
          setError("Failed to save responses. " + swipeError.message);
          setSaving(false);
          return;
        }

        const { error: profileError } = await upsertTravelerProfile(supabase, {
          user_id: userId,
          plan_flow_score: scores.plan_flow_score,
          busy_relaxed_score: scores.busy_relaxed_score,
          comfort_discomfort_score: scores.comfort_discomfort_score,
          immerse_observe_score: scores.immerse_observe_score,
          type_code,
          type_name,
          profile_confidence: overallConfidence,
        });

        if (profileError) {
          setError("Failed to save profile. " + profileError.message);
          setSaving(false);
          return;
        }

        setSaving(false);
        setStage("interests");
      } catch {
        setError("Something went wrong. Please try again.");
        setSaving(false);
      }
    },
    [userId]
  );

  const handleInterestsComplete = useCallback(
    async (selected: string[]) => {
      if (!userId) return;
      setSaving(true);
      setError("");

      try {
        const supabase = createClient();
        const { error: saveError } = await saveInterests(supabase, userId, selected);

        if (saveError) {
          setError("Failed to save interests. " + saveError.message);
          setSaving(false);
          return;
        }

        setSaving(false);
        setStage("dream_day");
      } catch {
        setError("Something went wrong. Please try again.");
        setSaving(false);
      }
    },
    [userId]
  );

  const handleInterestsSkip = useCallback(() => {
    setStage("dream_day");
  }, []);

  const handleDreamDayComplete = useCallback(
    async (
      responses: DreamDayResponse[],
      updatedScores: {
        plan_flow_score: number;
        busy_relaxed_score: number;
        comfort_discomfort_score: number;
        immerse_observe_score: number;
      }
    ) => {
      if (!userId) return;
      setSaving(true);
      setError("");

      try {
        const supabase = createClient();

        // Save dream day responses
        const { error: dreamError } = await saveDreamDayResponses(
          supabase,
          userId,
          responses
        );

        if (dreamError) {
          setError("Failed to save responses. " + dreamError.message);
          setSaving(false);
          return;
        }

        // Calculate final type
        const { type_code, type_name } = determineTypeCode(updatedScores);

        // Calculate updated confidence (swipe confidence + dream day boost)
        const baseConfidence = swipeScores?.confidence ?? {
          plan_flow: 50,
          busy_relaxed: 50,
          comfort_discomfort: 50,
          immerse_observe: 50,
        };
        const updatedConfidence = { ...baseConfidence };
        for (const r of responses) {
          const dim = r.dimension as DimensionKey;
          updatedConfidence[dim] = Math.min(100, updatedConfidence[dim] + 10);
        }
        const overallConfidence = Math.round(
          (updatedConfidence.plan_flow +
            updatedConfidence.busy_relaxed +
            updatedConfidence.comfort_discomfort +
            updatedConfidence.immerse_observe) /
            4
        );

        // Update traveler profile with final scores
        const { error: profileError } = await upsertTravelerProfile(supabase, {
          user_id: userId,
          plan_flow_score: updatedScores.plan_flow_score,
          busy_relaxed_score: updatedScores.busy_relaxed_score,
          comfort_discomfort_score: updatedScores.comfort_discomfort_score,
          immerse_observe_score: updatedScores.immerse_observe_score,
          type_code,
          type_name,
          profile_confidence: overallConfidence,
          onboarding_completed: true,
        });

        if (profileError) {
          setError("Failed to save profile. " + profileError.message);
          setSaving(false);
          return;
        }

        setRevealData({
          type_code,
          type_name,
          ...updatedScores,
        });
        setSaving(false);
        setStage("reveal");
      } catch {
        setError("Something went wrong. Please try again.");
        setSaving(false);
      }
    },
    [userId, swipeScores]
  );

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Saving...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button onClick={() => setError("")} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  if (stage === "swipe") {
    return (
      <div className="h-screen">
        <SwipeCardStack cards={swipeCards} onComplete={handleSwipeComplete} />
      </div>
    );
  }

  if (stage === "interests") {
    return (
      <InterestPicker
        allInterests={INTERESTS}
        popularInterests={POPULAR_INTERESTS}
        onComplete={handleInterestsComplete}
        onSkip={handleInterestsSkip}
      />
    );
  }

  if (stage === "dream_day" && swipeScores) {
    return (
      <DreamDayCreator
        currentScores={{
          plan_flow_score: swipeScores.plan_flow_score,
          busy_relaxed_score: swipeScores.busy_relaxed_score,
          comfort_discomfort_score: swipeScores.comfort_discomfort_score,
          immerse_observe_score: swipeScores.immerse_observe_score,
        }}
        currentConfidence={swipeScores.confidence}
        onComplete={handleDreamDayComplete}
      />
    );
  }

  if (stage === "reveal" && revealData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            You are
          </p>
          <h1 className="mt-2 text-4xl font-bold">{revealData.type_name}</h1>
          <p className="mt-1 font-mono text-lg text-muted-foreground">
            {revealData.type_code}
          </p>
        </div>
        <div className="w-full max-w-xs space-y-3">
          <ScoreRow label="Plan vs Flow" value={revealData.plan_flow_score} />
          <ScoreRow label="Busy vs Relaxed" value={revealData.busy_relaxed_score} />
          <ScoreRow label="Comfort vs Discomfort" value={revealData.comfort_discomfort_score} />
          <ScoreRow label="Immerse vs Observe" value={revealData.immerse_observe_score} />
        </div>
        <Button
          className="w-full max-w-xs"
          onClick={() => {
            router.push("/dashboard");
            router.refresh();
          }}
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return null;
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
