"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/services/auth";
import { useOnboardingAnalytics } from "@/hooks/useOnboardingAnalytics";
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
import TypeReveal from "@/components/onboarding/TypeReveal";
import { Button } from "@/components/ui/button";

type Stage = "swipe" | "interests" | "dream_day" | "reveal";

export default function OnboardingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("swipe");
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const analytics = useOnboardingAnalytics(userId);
  const analyticsStarted = useRef(false);

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

  // Log onboarding_started once userId is available
  useEffect(() => {
    if (userId && !analyticsStarted.current) {
      analyticsStarted.current = true;
      analytics.logOnboardingStarted();
    }
  }, [userId, analytics]);

  // Best-effort abandoned tracking on page unload
  useEffect(() => {
    const handler = () => {
      if (stage !== "reveal") {
        analytics.logAbandoned(stage);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [stage, analytics]);

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

        analytics.logSwipeCompleted({
          plan_flow: scores.plan_flow_score,
          busy_relaxed: scores.busy_relaxed_score,
          comfort_discomfort: scores.comfort_discomfort_score,
          immerse_observe: scores.immerse_observe_score,
        });

        setSaving(false);
        setStage("interests");
        analytics.logInterestsStarted();
      } catch {
        setError("Something went wrong. Please try again.");
        setSaving(false);
      }
    },
    [userId, analytics]
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

        analytics.logInterestsCompleted(selected);

        setSaving(false);
        setStage("dream_day");
        analytics.logDreamDayStarted();
      } catch {
        setError("Something went wrong. Please try again.");
        setSaving(false);
      }
    },
    [userId, analytics]
  );

  const handleInterestsSkip = useCallback(() => {
    analytics.logInterestsCompleted([]);
    setStage("dream_day");
    analytics.logDreamDayStarted();
  }, [analytics]);

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

        const finalScores = {
          plan_flow: updatedScores.plan_flow_score,
          busy_relaxed: updatedScores.busy_relaxed_score,
          comfort_discomfort: updatedScores.comfort_discomfort_score,
          immerse_observe: updatedScores.immerse_observe_score,
        };
        analytics.logDreamDayCompleted(finalScores);
        analytics.logOnboardingCompleted(type_code, finalScores);

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
    [userId, swipeScores, analytics]
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
        <SwipeCardStack
          cards={swipeCards}
          onComplete={handleSwipeComplete}
          onSwipe={analytics.logSwipe}
        />
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
        onStep={analytics.logDreamDayStep}
      />
    );
  }

  if (stage === "reveal" && revealData) {
    return (
      <TypeReveal
        typeCode={revealData.type_code}
        typeName={revealData.type_name}
        scores={{
          plan_flow_score: revealData.plan_flow_score,
          busy_relaxed_score: revealData.busy_relaxed_score,
          comfort_discomfort_score: revealData.comfort_discomfort_score,
          immerse_observe_score: revealData.immerse_observe_score,
        }}
        onContinue={() => {
          router.push("/dashboard");
          router.refresh();
        }}
      />
    );
  }

  return null;
}
