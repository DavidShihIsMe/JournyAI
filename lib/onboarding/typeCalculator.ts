import { TYPE_NAMES, GROUP_COLORS } from "../constants/travelerTypes";
import {
  computeDimensionScores,
  type DimensionScores,
  type QuizResponse,
} from "./quizQuestions";

export interface DimensionScoreInput {
  plan_flow: number;
  busy_relaxed: number;
  comfort_adventure: number;
  immerse_observe: number;
}

export interface DimensionResult {
  score: number;
  pole: string;
  label: string;
  confidence: number;
}

export interface TypeResult {
  code: string;
  name: string;
  groupColor: string;
  dimensions: {
    plan_flow: DimensionResult;
    busy_relaxed: DimensionResult;
    comfort_adventure: DimensionResult;
    immerse_observe: DimensionResult;
  };
}

const DIMENSION_CONFIG = [
  { key: "plan_flow" as const, leftLetter: "P", rightLetter: "F", leftLabel: "Plan", rightLabel: "Flow" },
  { key: "busy_relaxed" as const, leftLetter: "B", rightLetter: "R", leftLabel: "Busy", rightLabel: "Relaxed" },
  { key: "comfort_adventure" as const, leftLetter: "C", rightLetter: "A", leftLabel: "Comfort", rightLabel: "Adventure" },
  { key: "immerse_observe" as const, leftLetter: "I", rightLetter: "O", leftLabel: "Immerse", rightLabel: "Observe" },
];

// Max possible score per dimension:
// Swipe cards: max weight is 3, with super_like 2x = 6 per card.
// Multiple cards can affect each dimension. Practical max ~18.
// Dream day: max is +5 per step, up to 2 steps per dimension = 10.
// Combined practical max ≈ 28 per dimension.
const MAX_SCORE = 28;

export function calculateTravelerType(
  swipeScores: DimensionScoreInput,
  dreamDayScores: DimensionScoreInput
): TypeResult {
  const combined: DimensionScoreInput = {
    plan_flow: swipeScores.plan_flow + dreamDayScores.plan_flow,
    busy_relaxed: swipeScores.busy_relaxed + dreamDayScores.busy_relaxed,
    comfort_adventure: swipeScores.comfort_adventure + dreamDayScores.comfort_adventure,
    immerse_observe: swipeScores.immerse_observe + dreamDayScores.immerse_observe,
  };

  let code = "";
  const dimensions = {} as TypeResult["dimensions"];

  for (const dim of DIMENSION_CONFIG) {
    const score = combined[dim.key];
    const isRight = score > 0;
    const pole = isRight ? dim.rightLetter : dim.leftLetter;
    const label = isRight ? dim.rightLabel : dim.leftLabel;
    const confidence = Math.min(100, Math.round((Math.abs(score) / MAX_SCORE) * 100));

    code += pole;
    dimensions[dim.key] = { score, pole, label, confidence };
  }

  const name = TYPE_NAMES[code] || "Unknown Type";
  const group = code.substring(0, 2);
  const groupColor = GROUP_COLORS[group] || "#1A7D7A";

  return { code, name, groupColor, dimensions };
}

/**
 * Convert a raw combined score to a 0-100 slider position.
 * 0 = fully left pole, 100 = fully right pole, 50 = center.
 */
export function scoreToSliderPosition(score: number): number {
  const position = ((score + MAX_SCORE) / (2 * MAX_SCORE)) * 100;
  return Math.min(100, Math.max(0, Math.round(position)));
}

const QUIZ_MAX_SCORE = 12;

export function travelerTypeFromDimensionScores(scores: DimensionScores): TypeResult {
  let code = "";
  const dimensions = {} as TypeResult["dimensions"];

  for (const dim of DIMENSION_CONFIG) {
    const score = scores[dim.key];
    const isRight = score > 0;
    const pole = isRight ? dim.rightLetter : dim.leftLetter;
    const label = isRight ? dim.rightLabel : dim.leftLabel;
    const confidence = Math.min(100, Math.round((Math.abs(score) / QUIZ_MAX_SCORE) * 100));

    code += pole;
    dimensions[dim.key] = { score, pole, label, confidence };
  }

  const name = TYPE_NAMES[code] || "Unknown Type";
  const group = code.substring(0, 2);
  const groupColor = GROUP_COLORS[group] || "#1A7D7A";

  return { code, name, groupColor, dimensions };
}

export function travelerTypeFromQuiz(responses: QuizResponse[]): TypeResult {
  const scores = computeDimensionScores(responses);
  return travelerTypeFromDimensionScores(scores);
}

// ---------------------------------------------------------------------------
// Spec-driven calculator. Uses literal lookup tables per the type-reveal spec
// rather than the linear weights in quizQuestions.ts. The two are intentionally
// separate: quizQuestions.ts continues to drive the live SCORES_KEY in the
// quiz UI, while this function is the source of truth for the type reveal.
// ---------------------------------------------------------------------------

type DimKey = "plan_flow" | "busy_relaxed" | "comfort_adventure" | "immerse_observe";

// Index 0..6 → score for value 1..7
const SCORING: Record<number, Partial<Record<DimKey, readonly number[]>>> = {
  2: { plan_flow: [+5, +4, +2, 0, -2, -4, -5] },
  3: { busy_relaxed: [+5, +4, +2, 0, -2, -4, -5] },
  4: { comfort_adventure: [+5, +4, +2, 0, -2, -4, -5] },
  5: { immerse_observe: [+5, +4, +2, 0, -2, -4, -5] },
  6: { comfort_adventure: [+3, +2, +1, 0, -1, -2, -3] },
  8: { plan_flow: [+2, +1, +1, 0, -1, -1, -2] },
  13: { immerse_observe: [-2, -1, -1, 0, +1, +1, +2] },
  14: {
    comfort_adventure: [+3, +2, +1, 0, -1, -2, -3],
    immerse_observe: [+2, +1, +1, 0, -1, -1, -2],
  },
  15: {
    comfort_adventure: [+3, +2, +1, 0, -1, -2, -3],
    immerse_observe: [+1, +1, 0, 0, 0, -1, -1],
  },
};

const MAX_PER_DIM: Record<DimKey, number> = {
  plan_flow: 7,
  busy_relaxed: 5,
  comfort_adventure: 14,
  immerse_observe: 10,
};

const SPEC_GROUP_COLORS: Record<string, string> = {
  PB: "#4A5899",
  PR: "#9A5B7A",
  FB: "#C4853A",
  FR: "#3A8A7A",
};

const DEFAULT_CODE = "PBCI";

export function calculateTravelerFromResponses(
  responses: ReadonlyArray<{ questionId: number; value: number }>
): TypeResult {
  const valueByQ = new Map<number, number>();
  for (const r of responses) valueByQ.set(r.questionId, r.value);

  const scores: Record<DimKey, number> = {
    plan_flow: 0,
    busy_relaxed: 0,
    comfort_adventure: 0,
    immerse_observe: 0,
  };

  for (const [qIdStr, dimMap] of Object.entries(SCORING)) {
    const qId = Number(qIdStr);
    const raw = valueByQ.get(qId);
    // Skipped questions are treated as neutral (value 4 → score 0).
    const value = raw === undefined || raw === null ? 4 : raw;
    const safeValue = Math.min(7, Math.max(1, Math.round(value)));
    for (const [dimKey, table] of Object.entries(dimMap)) {
      if (!table) continue;
      scores[dimKey as DimKey] += table[safeValue - 1];
    }
  }

  let code = "";
  const dimensions = {} as TypeResult["dimensions"];
  for (const dim of DIMENSION_CONFIG) {
    const score = scores[dim.key as DimKey];
    const isRight = score > 0;
    const pole = isRight ? dim.rightLetter : dim.leftLetter;
    const label = isRight ? dim.rightLabel : dim.leftLabel;
    const max = MAX_PER_DIM[dim.key as DimKey];
    const confidence = Math.min(
      100,
      Math.round((Math.abs(score) / max) * 100)
    );
    code += pole;
    dimensions[dim.key] = { score, pole, label, confidence };
  }

  if (!TYPE_NAMES[code]) {
    console.error(
      `[typeCalculator] Unknown traveler code "${code}", defaulting to ${DEFAULT_CODE}`
    );
    code = DEFAULT_CODE;
  }

  const name = TYPE_NAMES[code];
  const group = code.substring(0, 2);
  const groupColor = SPEC_GROUP_COLORS[group] || GROUP_COLORS[group] || "#1A7D7A";

  return { code, name, groupColor, dimensions };
}
