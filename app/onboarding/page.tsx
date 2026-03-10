"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/services/auth";
import { saveSwipeResponses } from "@/lib/services/swipe";
import { upsertTravelerProfile } from "@/lib/services/profile";
import { saveInterests } from "@/lib/services/interests";
import { swipeCards } from "@/lib/onboarding/cards";
import { INTERESTS, POPULAR_INTERESTS } from "@/lib/constants/interests";
import { calculateDimensionScores, determineTypeCode } from "@/lib/onboarding/scoring";
import type { CardResponse } from "@/lib/onboarding/types";
import SwipeCardStack from "@/components/onboarding/SwipeCardStack";
import InterestPicker from "@/components/onboarding/InterestPicker";
import { Button } from "@/components/ui/button";

type Stage = "swipe" | "interests" | "dream_day" | "reveal";

export default function OnboardingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("swipe");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  if (stage === "dream_day") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Dream Day Creator coming next</h2>
          <p className="mt-2 text-muted-foreground">
            Your interests have been saved.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>Continue</Button>
      </div>
    );
  }

  return null;
}
