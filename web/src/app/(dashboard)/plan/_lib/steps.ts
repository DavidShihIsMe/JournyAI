export type StepPath =
  | "destination"
  | "dates"
  | "stay"
  | "party"
  | "access"
  | "budget"
  | "must-haves"
  | "prioritize";

export interface StepDef {
  path: StepPath;
  title: string;
  short: string;
}

export const STEPS: StepDef[] = [
  { path: "destination", title: "Where are you going?", short: "Destination" },
  { path: "dates", title: "When are you going?", short: "Dates" },
  { path: "stay", title: "Where are you staying?", short: "Lodging" },
  { path: "party", title: "Who is coming?", short: "Party" },
  { path: "access", title: "Any accessibility needs?", short: "Access" },
  { path: "budget", title: "What is your budget?", short: "Budget" },
  { path: "must-haves", title: "What do you want to do?", short: "Activities" },
  { path: "prioritize", title: "What do you want to prioritize?", short: "Prioritize" },
];

export function stepIndex(path: StepPath): number {
  return STEPS.findIndex((s) => s.path === path);
}

export function nextStepPath(path: StepPath): StepPath | null {
  const i = stepIndex(path);
  return STEPS[i + 1]?.path ?? null;
}

export function prevStepPath(path: StepPath): StepPath | null {
  const i = stepIndex(path);
  return i > 0 ? STEPS[i - 1].path : null;
}
