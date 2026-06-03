"use client";

import { INTEREST_OPTIONS, type InterestOption } from "@lib/constants/interests";
import { calculateTravelerFromResponses } from "@lib/onboarding/typeCalculator";
import {
  getInterestNames,
  getTravelerProfile,
  replaceInterests,
  upsertTravelerProfile,
  type TravelerProfile,
} from "@lib/services/profile";

const RESPONSES_KEY = "journy_quiz_responses";
const SCORES_KEY = "journy_dimension_scores";
const SELECTED_KEY = "journy_interests";
const CUSTOM_KEY = "journy_custom_interests";
// One-shot guard so the OAuth/dashboard sync only runs once per session
const SYNCED_FLAG_KEY = "journy_quiz_synced_user";

interface QuizResponse {
  questionId: number;
  value: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = any;

/**
 * Reconcile quiz state between the client (localStorage) and Supabase.
 * - If the user has a DB profile → hydrate localStorage from DB (DB wins).
 * - If the user has no DB profile but local quiz data → flush local → DB.
 * - Otherwise → no-op.
 *
 * Safe to call after any successful sign-in or sign-up.
 */
export async function syncQuizWithSupabase(supabase: Client, userId: string): Promise<void> {
  if (typeof window === "undefined") return;

  // Skip if we've already synced this user this session
  if (window.sessionStorage.getItem(SYNCED_FLAG_KEY) === userId) return;

  try {
    const { data: existing } = await getTravelerProfile(supabase, userId);
    if (existing && existing.onboarding_completed) {
      await hydrateLocalFromDb(supabase, userId, existing);
    } else {
      await flushLocalToDb(supabase, userId);
    }
    window.sessionStorage.setItem(SYNCED_FLAG_KEY, userId);
  } catch (err) {
    console.error("[quizSync] failed:", err);
  }
}

async function flushLocalToDb(supabase: Client, userId: string): Promise<void> {
  const responsesRaw = window.localStorage.getItem(RESPONSES_KEY);
  if (!responsesRaw) return;

  let responses: QuizResponse[] = [];
  try {
    const parsed = JSON.parse(responsesRaw) as QuizResponse[];
    if (Array.isArray(parsed)) responses = parsed;
  } catch {
    return;
  }
  if (responses.length === 0) return;

  const result = calculateTravelerFromResponses(
    responses.map((r) => ({ questionId: r.questionId, value: r.value }))
  );

  const avgConfidence = Math.round(
    (result.dimensions.plan_flow.confidence +
      result.dimensions.busy_relaxed.confidence +
      result.dimensions.comfort_adventure.confidence +
      result.dimensions.immerse_observe.confidence) /
      4
  );

  const { error: profileError } = await upsertTravelerProfile(supabase, userId, {
    plan_flow_score: result.dimensions.plan_flow.score,
    busy_relaxed_score: result.dimensions.busy_relaxed.score,
    comfort_discomfort_score: result.dimensions.comfort_adventure.score,
    immerse_observe_score: result.dimensions.immerse_observe.score,
    type_code: result.code,
    type_name: result.name,
    profile_confidence: avgConfidence,
    onboarding_completed: true,
  });
  if (profileError) {
    console.error("[quizSync] upsertTravelerProfile error:", profileError);
    return;
  }

  // Interests
  const selectedIds: string[] = parseJson(window.localStorage.getItem(SELECTED_KEY)) ?? [];
  const custom: InterestOption[] = parseJson(window.localStorage.getItem(CUSTOM_KEY)) ?? [];

  const builtInById = new Map(INTEREST_OPTIONS.map((i) => [i.id, i.label]));
  const customById = new Map(custom.map((c) => [c.id, c.label]));

  const interestNames = selectedIds
    .map((id) => builtInById.get(id) ?? customById.get(id) ?? null)
    .filter((n): n is string => Boolean(n));

  if (interestNames.length > 0) {
    const { error: interestsError } = await replaceInterests(
      supabase,
      userId,
      interestNames
    );
    if (interestsError) {
      console.error("[quizSync] replaceInterests error:", interestsError);
    }
  }
}

async function hydrateLocalFromDb(
  supabase: Client,
  userId: string,
  profile: TravelerProfile
): Promise<void> {
  // Scores (so the type-reveal page can re-render the user's notation)
  const scores = {
    plan_flow: profile.plan_flow_score,
    busy_relaxed: profile.busy_relaxed_score,
    comfort_adventure: profile.comfort_discomfort_score,
    immerse_observe: profile.immerse_observe_score,
  };
  window.localStorage.setItem(SCORES_KEY, JSON.stringify(scores));

  // Interests — resolve labels back to IDs where possible
  const { data: names } = await getInterestNames(supabase, userId);
  if (names && names.length > 0) {
    const builtInByLabel = new Map(
      INTEREST_OPTIONS.map((i) => [i.label.toLowerCase(), i.id])
    );
    const ids: string[] = [];
    const customOptions: InterestOption[] = [];

    for (const name of names) {
      const builtInId = builtInByLabel.get(name.toLowerCase());
      if (builtInId) {
        ids.push(builtInId);
      } else {
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (!id) continue;
        ids.push(id);
        customOptions.push({ id, label: name, category: "Your Own" });
      }
    }

    window.localStorage.setItem(SELECTED_KEY, JSON.stringify(ids));
    if (customOptions.length > 0) {
      window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(customOptions));
    }
  }
}

function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
