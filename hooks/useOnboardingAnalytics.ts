"use client";

import { useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { logOnboardingEvent } from "@/lib/services/analytics";

function generateUUID(): string {
  return crypto.randomUUID();
}

export function useOnboardingAnalytics(userId: string | null) {
  const sessionId = useRef(generateUUID());
  const startTime = useRef(Date.now());
  const stageStartTime = useRef(Date.now());

  const log = useCallback(
    (eventType: string, eventData?: Record<string, unknown>) => {
      if (!userId) return;
      const supabase = createClient();
      logOnboardingEvent(
        supabase,
        userId,
        sessionId.current,
        eventType,
        eventData
      ).catch(console.error);
    },
    [userId]
  );

  const logOnboardingStarted = useCallback(() => {
    startTime.current = Date.now();
    stageStartTime.current = Date.now();
    log("onboarding_started");
  }, [log]);

  const logSwipe = useCallback(
    (cardId: number, direction: string, cardNumber: number) => {
      log("swipe", { card_id: cardId, direction, card_number: cardNumber });
    },
    [log]
  );

  const logSwipeCompleted = useCallback(
    (scores: {
      plan_flow: number;
      busy_relaxed: number;
      comfort_discomfort: number;
      immerse_observe: number;
    }) => {
      const durationMs = Date.now() - stageStartTime.current;
      stageStartTime.current = Date.now();
      log("swipe_completed", { duration_ms: durationMs, scores });
    },
    [log]
  );

  const logInterestsStarted = useCallback(() => {
    stageStartTime.current = Date.now();
    log("interests_started");
  }, [log]);

  const logInterestsCompleted = useCallback(
    (interests: string[]) => {
      const durationMs = Date.now() - stageStartTime.current;
      stageStartTime.current = Date.now();
      log("interests_completed", {
        interests,
        count: interests.length,
        duration_ms: durationMs,
      });
    },
    [log]
  );

  const logDreamDayStarted = useCallback(() => {
    stageStartTime.current = Date.now();
    log("dreamday_started");
  }, [log]);

  const logDreamDayStep = useCallback(
    (stepNumber: number, dimension: string, choice: string) => {
      log("dreamday_step", {
        step_number: stepNumber,
        dimension,
        choice,
      });
    },
    [log]
  );

  const logDreamDayCompleted = useCallback(
    (scores: {
      plan_flow: number;
      busy_relaxed: number;
      comfort_discomfort: number;
      immerse_observe: number;
    }) => {
      const durationMs = Date.now() - stageStartTime.current;
      stageStartTime.current = Date.now();
      log("dreamday_completed", { duration_ms: durationMs, scores });
    },
    [log]
  );

  const logOnboardingCompleted = useCallback(
    (
      finalTypeCode: string,
      finalScores: {
        plan_flow: number;
        busy_relaxed: number;
        comfort_discomfort: number;
        immerse_observe: number;
      }
    ) => {
      const totalDurationMs = Date.now() - startTime.current;
      log("onboarding_completed", {
        total_duration_ms: totalDurationMs,
        final_type_code: finalTypeCode,
        final_scores: finalScores,
      });
    },
    [log]
  );

  const logAbandoned = useCallback(
    (lastActivity: string, lastStep?: number) => {
      log("onboarding_abandoned", {
        last_activity: lastActivity,
        ...(lastStep !== undefined ? { last_step: lastStep } : {}),
      });
    },
    [log]
  );

  return {
    sessionId: sessionId.current,
    logOnboardingStarted,
    logSwipe,
    logSwipeCompleted,
    logInterestsStarted,
    logInterestsCompleted,
    logDreamDayStarted,
    logDreamDayStep,
    logDreamDayCompleted,
    logOnboardingCompleted,
    logAbandoned,
  };
}
