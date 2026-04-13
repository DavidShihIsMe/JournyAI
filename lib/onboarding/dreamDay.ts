import type { DimensionKey } from "../constants/dimensions";

export interface DreamDayStep {
  step_number: number;
  dimension: DimensionKey;
  time_of_day: string;
  prompt: string;
  left_option: string;
  right_option: string;
  transitions?: {
    left: string;
    right: string;
  };
}

// Fixed steps 1-4 (always shown in order)
export const FIXED_STEPS: DreamDayStep[] = [
  {
    step_number: 1,
    dimension: "busy_relaxed",
    time_of_day: "Morning",
    prompt: "Your trip starts tomorrow. How does the morning look?",
    left_option: "Alarm set. Out the door by 7am.",
    right_option: "No alarm. The day starts when you wake up.",
    transitions: {
      left: "It's early. Streets are quiet. You're heading to your first stop.",
      right: "It's mid-morning. You're finally heading out.",
    },
  },
  {
    step_number: 2,
    dimension: "comfort_adventure",
    time_of_day: "Getting There",
    prompt: "How do you get there?",
    left_option: "Pre-booked car. Smooth ride. AC on.",
    right_option: "Hop on the local bus. Ask someone which stop.",
    transitions: {
      left: "You arrive right on time. Stomach's growling.",
      right: "You got off one stop too far. Doesn't matter. You're hungry.",
    },
  },
  {
    step_number: 3,
    dimension: "plan_flow",
    time_of_day: "Lunch",
    prompt: "Where are you eating?",
    left_option: "The spot you saved on your phone two weeks ago.",
    right_option: "Whatever place has the longest line of locals.",
    transitions: {
      left: "Lunch was exactly as good as the reviews said. You wander into a market nearby.",
      right: "Lunch was incredible. No idea what you ate. You wander into a market nearby.",
    },
  },
  {
    step_number: 4,
    dimension: "immerse_observe",
    time_of_day: "Afternoon",
    prompt: "You find a beautiful market. What do you do?",
    left_option: "Start chatting with vendors. Try everything they offer.",
    right_option: "Grab a coffee nearby and watch the whole scene unfold.",
    transitions: {
      left: "Your bag's full of things you didn't plan on buying. Evening's coming.",
      right: "You've been sitting here longer than you realized. Evening's coming.",
    },
  },
];

// Dynamic options pool for steps 5 and 6
export const DYNAMIC_OPTIONS: Record<DimensionKey, { evening: DreamDayStep; night: DreamDayStep }> = {
  plan_flow: {
    evening: {
      step_number: 5,
      dimension: "plan_flow",
      time_of_day: "Evening",
      prompt: "Dinner tonight?",
      left_option: "Already reserved. You've been looking forward to this one.",
      right_option: "Ask the bartender where they'd go tonight.",
      transitions: {
        left: "The night's just getting started.",
        right: "The night's just getting started.",
      },
    },
    night: {
      step_number: 6,
      dimension: "plan_flow",
      time_of_day: "Night",
      prompt: "One last stop tonight.",
      left_option: "The place you've had bookmarked for months.",
      right_option: "Wherever the night takes you.",
    },
  },
  busy_relaxed: {
    evening: {
      step_number: 5,
      dimension: "busy_relaxed",
      time_of_day: "Evening",
      prompt: "The evening's wide open. What's the move?",
      left_option: "There's a food tour, a live show, and a rooftop bar. Hit all three.",
      right_option: "One good dinner. That's all you need tonight.",
      transitions: {
        left: "The night's just getting started.",
        right: "The night's winding down, but there's one more call to make.",
      },
    },
    night: {
      step_number: 6,
      dimension: "busy_relaxed",
      time_of_day: "Night",
      prompt: "How does the night end?",
      left_option: "Three more stops. Sleep when the trip's over.",
      right_option: "Back to the room. Book in hand. Window open.",
    },
  },
  comfort_adventure: {
    evening: {
      step_number: 5,
      dimension: "comfort_adventure",
      time_of_day: "Evening",
      prompt: "Time for dinner. Where do you end up?",
      left_option: "The place with the candlelit terrace and the wine list.",
      right_option: "The loud, crowded spot with no menu where you point and hope.",
      transitions: {
        left: "The night's just getting started.",
        right: "The night's just getting started.",
      },
    },
    night: {
      step_number: 6,
      dimension: "comfort_adventure",
      time_of_day: "Night",
      prompt: "Last stop of the night.",
      left_option: "The rooftop bar with the skyline view everyone talks about.",
      right_option: "A basement spot down a side street you almost walked past.",
    },
  },
  immerse_observe: {
    evening: {
      step_number: 5,
      dimension: "immerse_observe",
      time_of_day: "Evening",
      prompt: "You pass a street musician drawing a crowd.",
      left_option: "You push to the front and start clapping along.",
      right_option: "You lean against the wall across the street and just listen.",
      transitions: {
        left: "The night's just getting started.",
        right: "The night's winding down, but there's one more call to make.",
      },
    },
    night: {
      step_number: 6,
      dimension: "immerse_observe",
      time_of_day: "Night",
      prompt: "You stumble into a small live music venue.",
      left_option: "You're in the front row. The band pulls you on stage.",
      right_option: "You grab a seat in the back corner and soak it in.",
    },
  },
};

// Tie-break priority: immerse_observe > comfort_adventure > busy_relaxed > plan_flow
const PRIORITY_ORDER: DimensionKey[] = [
  "immerse_observe",
  "comfort_adventure",
  "busy_relaxed",
  "plan_flow",
];

export function selectDynamicSteps(
  confidence: Record<DimensionKey, number>
): [DimensionKey, DimensionKey] {
  const sorted = [...PRIORITY_ORDER].sort((a, b) => {
    const diff = confidence[a] - confidence[b];
    if (diff !== 0) return diff;
    // On tie, earlier in PRIORITY_ORDER wins (lower index = higher priority)
    return PRIORITY_ORDER.indexOf(a) - PRIORITY_ORDER.indexOf(b);
  });

  return [sorted[0], sorted[1]];
}

export function scoreDreamDayChoice(
  _dimension: DimensionKey,
  choice: "left" | "right"
): number {
  return choice === "left" ? -5 : 5;
}

export function buildAllSteps(
  dynamicDimensions: [DimensionKey, DimensionKey]
): DreamDayStep[] {
  const [dim5, dim6] = dynamicDimensions;
  return [
    ...FIXED_STEPS,
    { ...DYNAMIC_OPTIONS[dim5].evening, step_number: 5 },
    { ...DYNAMIC_OPTIONS[dim6].night, step_number: 6 },
  ];
}
