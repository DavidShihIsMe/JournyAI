import type { CardResponse, SwipeCard, DimensionScores, TravelerType } from "./types";
import { DIMENSION_KEYS, type DimensionKey } from "../constants/dimensions";
import { TRAVELER_TYPES } from "../constants/types";

function computeConfidence(contributingCards: number): number {
  if (contributingCards >= 6) return 80 + Math.min((contributingCards - 6) * 5, 20);
  if (contributingCards >= 4) return 55 + (contributingCards - 4) * 10;
  if (contributingCards === 3) return 45;
  if (contributingCards === 2) return 30;
  if (contributingCards === 1) return 15;
  return 0;
}

// Inverse weight applied when a user left-swipes a card.
// Relaxed has only 2 direct cards (5, 10) vs 3-4 for all other poles.
// Higher inverse weight on busy_relaxed compensates for this signal gap.
const DEFAULT_INVERSE_WEIGHT = 0.3;
const RELAXED_INVERSE_WEIGHT = 0.5;

export function calculateDimensionScores(
  responses: CardResponse[],
  cards: SwipeCard[]
): DimensionScores {
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  const rawTotals: Record<DimensionKey, number> = {
    plan_flow: 0,
    busy_relaxed: 0,
    comfort_discomfort: 0,
    immerse_observe: 0,
  };

  const maxPossible: Record<DimensionKey, number> = {
    plan_flow: 0,
    busy_relaxed: 0,
    comfort_discomfort: 0,
    immerse_observe: 0,
  };

  const contributingCards: Record<DimensionKey, number> = {
    plan_flow: 0,
    busy_relaxed: 0,
    comfort_discomfort: 0,
    immerse_observe: 0,
  };

  for (const { cardId, response } of responses) {
    const card = cardMap.get(cardId);
    if (!card) continue;

    for (const dim of DIMENSION_KEYS) {
      const weight = card.weights[dim];
      if (weight === 0) continue;

      contributingCards[dim]++;
      const absWeight = Math.abs(weight);

      maxPossible[dim] += absWeight * 2;

      if (response === "right") {
        rawTotals[dim] += weight;
      } else if (response === "super_like") {
        rawTotals[dim] += weight * 2;
      } else {
        const inverseWeight =
          dim === "busy_relaxed" ? RELAXED_INVERSE_WEIGHT : DEFAULT_INVERSE_WEIGHT;
        rawTotals[dim] += -weight * inverseWeight;
      }
    }
  }

  function normalize(dim: DimensionKey): number {
    const max = maxPossible[dim];
    if (max === 0) return 50;
    const normalized = ((rawTotals[dim] + max) / (2 * max)) * 100;
    return Math.round(Math.min(100, Math.max(0, normalized)));
  }

  return {
    plan_flow_score: normalize("plan_flow"),
    busy_relaxed_score: normalize("busy_relaxed"),
    comfort_discomfort_score: normalize("comfort_discomfort"),
    immerse_observe_score: normalize("immerse_observe"),
    confidence: {
      plan_flow: computeConfidence(contributingCards.plan_flow),
      busy_relaxed: computeConfidence(contributingCards.busy_relaxed),
      comfort_discomfort: computeConfidence(contributingCards.comfort_discomfort),
      immerse_observe: computeConfidence(contributingCards.immerse_observe),
    },
  };
}

export function determineTypeCode(scores: {
  plan_flow_score: number;
  busy_relaxed_score: number;
  comfort_discomfort_score: number;
  immerse_observe_score: number;
}): TravelerType {
  const code =
    (scores.plan_flow_score < 50 ? "P" : "F") +
    (scores.busy_relaxed_score < 50 ? "B" : "R") +
    (scores.comfort_discomfort_score < 50 ? "C" : "D") +
    (scores.immerse_observe_score < 50 ? "I" : "O");

  const typeInfo = TRAVELER_TYPES[code];
  return {
    type_code: code,
    type_name: typeInfo?.name ?? "Unknown",
  };
}
