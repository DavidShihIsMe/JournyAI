export type DimensionKey =
  | "plan_flow"
  | "busy_relaxed"
  | "comfort_adventure"
  | "immerse_observe";

export interface PersonalityScore {
  dimension: DimensionKey;
  agreeWeight: number;
  disagreeWeight: number;
}

export interface QuizQuestion {
  id: number;
  statement: string;
  dataKey: string;
  purpose: string;
  personalityScoring: PersonalityScore[] | null;
}

export const QUIZ_CHAPTERS: Record<number, string> = {
  1: "On Starting",
  2: "On Planning",
  3: "On Planning",
  4: "On Comfort",
  5: "On Culture",
  6: "On Food",
  7: "On Sights",
  8: "On Guidance",
  9: "On Evenings",
  10: "On Food",
  11: "On Movement",
  12: "On Nature",
  13: "On Pacing",
  14: "On Otherness",
  15: "On Adventure",
  16: "On Photography",
  17: "On Shopping",
  18: "On Pacing",
  19: "On Culture",
  20: "On Evenings",
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    statement: "I like to start my day early on vacation.",
    dataKey: "early_starter",
    purpose:
      "Determines first activity scheduling time. Early risers get 8am starts, late starters get 11am+. Affects breakfast vs brunch recommendations.",
    personalityScoring: null,
  },
  {
    id: 2,
    statement: "I like to plan my trips in detail before I leave.",
    dataKey: "pre_planner",
    purpose:
      "Determines itinerary rigidity and pre-booking. High = hour-by-hour schedule with reservations. Low = loose suggestions, no time stamps.",
    personalityScoring: [
      { dimension: "plan_flow", agreeWeight: -5, disagreeWeight: 5 },
    ],
  },
  {
    id: 3,
    statement: "I like to pack as many activities as possible into a day.",
    dataKey: "packing_activities",
    purpose:
      "Sets number of activities per day and gap time between them. High = 6+ activities with 30min transitions. Low = 1-2 activities with large free blocks.",
    personalityScoring: [
      { dimension: "busy_relaxed", agreeWeight: -5, disagreeWeight: 5 },
    ],
  },
  {
    id: 4,
    statement: "I prefer familiar and comfortable experiences over unfamiliar ones.",
    dataKey: "comfort_preference",
    purpose:
      "Filters entire recommendation risk level. High = well-reviewed, tourist-friendly, safe options. Low = off-the-beaten-path, unvetted, raw experiences.",
    personalityScoring: [
      { dimension: "comfort_adventure", agreeWeight: -5, disagreeWeight: 5 },
    ],
  },
  {
    id: 5,
    statement: "I like to actively participate in local culture rather than observe it.",
    dataKey: "participation_style",
    purpose:
      "Determines interactive vs observational activities. High = cooking classes, workshops, market haggling. Low = viewpoints, cafés, gardens, photography.",
    personalityScoring: [
      { dimension: "immerse_observe", agreeWeight: -5, disagreeWeight: 5 },
    ],
  },
  {
    id: 6,
    statement: "I enjoy trying local foods I've never seen or heard of before.",
    dataKey: "food_adventurousness",
    purpose:
      "Calibrates restaurant adventurousness. High = street food stalls, no-menu spots, unfamiliar cuisines. Low = reviewed restaurants, familiar cuisines, English menus.",
    personalityScoring: [
      { dimension: "comfort_adventure", agreeWeight: 3, disagreeWeight: -3 },
    ],
  },
  {
    id: 7,
    statement: "I enjoy going to famous landmarks and major attractions.",
    dataKey: "landmark_interest",
    purpose:
      "Determines iconic vs hidden gem ratio in itinerary. High = must-see checklist, all major landmarks. Low = skip tourist spots, focus on local neighborhoods.",
    personalityScoring: null,
  },
  {
    id: 8,
    statement: "I prefer guided tours over exploring on my own.",
    dataKey: "guided_tour_preference",
    purpose:
      "Determines whether to recommend guided tours, walking tours, food tours vs self-directed exploration. High = multiple tours per trip. Low = never recommend tours.",
    personalityScoring: [
      { dimension: "plan_flow", agreeWeight: -2, disagreeWeight: 2 },
    ],
  },
  {
    id: 9,
    statement: "I enjoy exploring at night when I travel.",
    dataKey: "nightlife_interest",
    purpose:
      "Determines whether evenings extend past dinner. High = bar recs, late-night food, live music, day extends past midnight. Low = day ends with dinner by 9pm.",
    personalityScoring: null,
  },
  {
    id: 10,
    statement: "I like to have a variety in my dining experiences when I travel.",
    dataKey: "dining_variety",
    purpose:
      "Determines whether to alternate dining tiers across the trip. High = street food lunch, fine dining dinner, cooking class next day. Low = consistent dining style.",
    personalityScoring: null,
  },
  {
    id: 11,
    statement: "I like to walk a lot when I travel.",
    dataKey: "walking_preference",
    purpose:
      "Determines distance between activities and transport mode. High = walking is primary transport, 30-45min walks between spots. Low = activities near transit, max 10min walks.",
    personalityScoring: null,
  },
  {
    id: 12,
    statement: "I enjoy spending time in nature and being outdoors when I travel.",
    dataKey: "nature_interest",
    purpose:
      "Determines nature activity inclusion and day trips. High = hiking, beaches, parks as priority activities. Low = pure city itinerary, no nature.",
    personalityScoring: null,
  },
  {
    id: 13,
    statement:
      "I like spending a lot of time at a single place over hopping between many activities.",
    dataKey: "depth_over_breadth",
    purpose:
      "Determines time per activity — depth vs breadth. High = 2-3 hours per activity, fewer stops, linger time. Low = 30-60 min per stop, many activities, move quickly.",
    personalityScoring: [
      { dimension: "immerse_observe", agreeWeight: 2, disagreeWeight: -2 },
    ],
  },
  {
    id: 14,
    statement: "I am comfortable dealing with language barriers and cultural differences.",
    dataKey: "cultural_comfort",
    purpose:
      "Filters tourist-friendly vs local-only recommendations. High = no English filter, off-tourist-path neighborhoods. Low = English menus, tourist-friendly, cultural etiquette notes.",
    personalityScoring: [
      { dimension: "comfort_adventure", agreeWeight: 3, disagreeWeight: -3 },
      { dimension: "immerse_observe", agreeWeight: -2, disagreeWeight: 2 },
    ],
  },
  {
    id: 15,
    statement: "I enjoy adventure activities like hiking, diving, or extreme sports.",
    dataKey: "adventure_activity_interest",
    purpose:
      "Determines adventure activity inclusion. High = hiking, kayaking, surfing, zip-lining as priority activities. Low = no physical risk or exertion beyond walking.",
    personalityScoring: [
      { dimension: "comfort_adventure", agreeWeight: 3, disagreeWeight: -3 },
      { dimension: "immerse_observe", agreeWeight: -1, disagreeWeight: 0 },
    ],
  },
  {
    id: 16,
    statement: "I like to plan my trip around photogenic spots for my Instagram.",
    dataKey: "photo_spot_interest",
    purpose:
      "Determines photo spot scheduling and golden hour optimization. High = schedule around golden hour, include Instagram spots, photo angle tips. Low = no photo optimization.",
    personalityScoring: null,
  },
  {
    id: 17,
    statement: "I enjoy shopping and browsing markets while I travel.",
    dataKey: "shopping_interest",
    purpose:
      "Determines whether to include shopping in itinerary. High = dedicated shopping blocks, market visits, boutique recommendations. Low = no shopping activities.",
    personalityScoring: null,
  },
  {
    id: 18,
    statement: "I prefer to have some days packed and some days completely empty.",
    dataKey: "alternating_pacing",
    purpose:
      "Captures non-linear pacing across the trip. High = extreme contrast between busy and chill days. Low = consistent pace every day. Distinct from Q3 which asks about daily intensity.",
    personalityScoring: null,
  },
  {
    id: 19,
    statement: "I enjoy learning about history and culture in depth.",
    dataKey: "cultural_depth",
    purpose:
      "Determines museum inclusion, historical site depth, context-rich descriptions. High = multiple museums, heritage walks, detailed historical context. Low = skip museums, focus on food and vibes.",
    personalityScoring: null,
  },
  {
    id: 20,
    statement: "I like to attend live music, theater, or performances when traveling.",
    dataKey: "live_entertainment",
    purpose:
      "Determines whether to query event APIs (Ticketmaster, PredictHQ) for shows and performances during trip dates. High = actively search for events. Low = don't include entertainment.",
    personalityScoring: null,
  },
];

export interface QuizResponse {
  questionId: number;
  dataKey: string;
  value: number;
}

export interface DimensionScores {
  plan_flow: number;
  busy_relaxed: number;
  comfort_adventure: number;
  immerse_observe: number;
}

export function scoreForValue(scoring: PersonalityScore, value: number): number {
  const t = (value - 1) / 6;
  return scoring.disagreeWeight + (scoring.agreeWeight - scoring.disagreeWeight) * t;
}

export function computeDimensionScores(responses: QuizResponse[]): DimensionScores {
  const scores: DimensionScores = {
    plan_flow: 0,
    busy_relaxed: 0,
    comfort_adventure: 0,
    immerse_observe: 0,
  };

  const byId = new Map(QUIZ_QUESTIONS.map((q) => [q.id, q]));

  for (const response of responses) {
    const question = byId.get(response.questionId);
    if (!question || !question.personalityScoring) continue;
    for (const scoring of question.personalityScoring) {
      scores[scoring.dimension] += scoreForValue(scoring, response.value);
    }
  }

  return scores;
}
