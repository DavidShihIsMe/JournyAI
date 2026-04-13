/**
 * Verification script for the Relaxed inverse weight fix.
 * Run with: npx tsx lib/onboarding/scoring-verification.ts
 */

import type { CardResponse } from "./types";
import { swipeCards } from "./cards";
import { calculateDimensionScores } from "./scoring";

function makeResponses(
  fn: (cardId: number) => "left" | "right" | "super_like"
): CardResponse[] {
  return swipeCards.map((card) => ({
    cardId: card.id,
    response: fn(card.id),
  }));
}

function printScores(label: string, responses: CardResponse[]) {
  const scores = calculateDimensionScores(responses, swipeCards);
  console.log(`\n=== ${label} ===`);
  console.log(`  plan_flow:          ${scores.plan_flow_score}`);
  console.log(`  busy_relaxed:       ${scores.busy_relaxed_score}`);
  console.log(`  comfort_adventure:  ${scores.comfort_adventure_score}`);
  console.log(`  immerse_observe:    ${scores.immerse_observe_score}`);
}

// Scenario 1: Right-swipe ALL 12 cards (baseline)
printScores(
  "Scenario 1: Right-swipe all 12 cards",
  makeResponses(() => "right")
);

// Scenario 2: Left-swipe all 4 Busy-loading cards (1, 4, 7, 12), right-swipe rest
const busyCards = new Set([1, 4, 7, 12]);
printScores(
  "Scenario 2: Left-swipe Busy cards (1,4,7,12), right-swipe rest",
  makeResponses((id) => (busyCards.has(id) ? "left" : "right"))
);

// Scenario 3: Right-swipe only Relaxed cards (5, 10), left-swipe everything else
const relaxedCards = new Set([5, 10]);
printScores(
  "Scenario 3: Right-swipe only Relaxed cards (5,10), left-swipe rest",
  makeResponses((id) => (relaxedCards.has(id) ? "right" : "left"))
);
