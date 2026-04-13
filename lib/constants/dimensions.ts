export const DIMENSION_KEYS = [
  "plan_flow",
  "busy_relaxed",
  "comfort_adventure",
  "immerse_observe",
] as const;

export type DimensionKey = (typeof DIMENSION_KEYS)[number];

export interface DimensionInfo {
  key: DimensionKey;
  label: string;
  lowPole: string;
  highPole: string;
  lowCode: string;
  highCode: string;
  description: string;
}

export const DIMENSIONS: DimensionInfo[] = [
  {
    key: "plan_flow",
    label: "Plan vs Flow",
    lowPole: "Plan",
    highPole: "Flow",
    lowCode: "P",
    highCode: "F",
    description: "Do you prefer structured itineraries or spontaneous exploration?",
  },
  {
    key: "busy_relaxed",
    label: "Busy vs Relaxed",
    lowPole: "Busy",
    highPole: "Relaxed",
    lowCode: "B",
    highCode: "R",
    description: "Do you pack your days full or leave room to breathe?",
  },
  {
    key: "comfort_adventure",
    label: "Comfort vs Adventure",
    lowPole: "Comfort",
    highPole: "Adventure",
    lowCode: "C",
    highCode: "A",
    description: "Do you seek familiar luxury or unfamiliar challenge?",
  },
  {
    key: "immerse_observe",
    label: "Immerse vs Observe",
    lowPole: "Immerse",
    highPole: "Observe",
    lowCode: "I",
    highCode: "O",
    description: "Do you dive into local culture or take it in from a distance?",
  },
];
