"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { swipeCards } from "@/lib/onboarding/cards";
import { calculateDimensionScores, determineTypeCode } from "@/lib/onboarding/scoring";
import SwipeCardStack, { type CardResponse } from "@/components/onboarding/SwipeCardStack";
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
    supabase.auth.getUser().then(({ data: { user } }) => {
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

        // Calculate scores
        const scores = calculateDimensionScores(
          responses.map((r) => ({ cardId: r.cardId, response: r.response })),
          swipeCards
        );
        const { type_code, type_name } = determineTypeCode(scores);
        const overallConfidence = Math.round(
          (scores.confidence.plan_flow +
            scores.confidence.busy_relaxed +
            scores.confidence.comfort_discomfort +
            scores.confidence.immerse_observe) /
            4
        );

        // Save swipe responses
        const { error: swipeError } = await supabase.from("swipe_responses").insert(
          responses.map((r) => ({
            user_id: userId,
            card_id: r.cardId,
            response: r.response,
          }))
        );

        if (swipeError) {
          setError("Failed to save responses. " + swipeError.message);
          setSaving(false);
          return;
        }

        // Upsert traveler profile
        const { error: profileError } = await supabase
          .from("traveler_profiles")
          .upsert(
            {
              user_id: userId,
              plan_flow_score: scores.plan_flow_score,
              busy_relaxed_score: scores.busy_relaxed_score,
              comfort_discomfort_score: scores.comfort_discomfort_score,
              immerse_observe_score: scores.immerse_observe_score,
              type_code,
              type_name,
              profile_confidence: overallConfidence,
            },
            { onConflict: "user_id" }
          );

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

  // Auth check loading state
  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Saving overlay
  if (saving) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Saving your responses...</p>
      </div>
    );
  }

  // Error state
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
        <SwipeCardStack onComplete={handleSwipeComplete} />
      </div>
    );
  }

  // Placeholder for stages 2-4
  if (stage === "interests") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Interest picker coming next</h2>
          <p className="mt-2 text-muted-foreground">
            Your swipe responses have been saved.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>Continue</Button>
      </div>
    );
  }

  return null;
}
