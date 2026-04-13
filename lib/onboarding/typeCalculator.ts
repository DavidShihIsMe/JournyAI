import { TYPE_NAMES, GROUP_COLORS } from "../constants/travelerTypes";

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
