/** Relative duration vs walk for the same leg (rough planner estimates). */
export const TRANSPORT_MODE_FACTORS: Record<string, number> = {
  walk: 1,
  public_transit: 0.82,
  train: 0.75,
  taxi: 0.55,
  car: 0.5,
  rideshare: 0.55,
  bike: 0.85,
  ferry: 0.9,
  mixed: 0.7,
};

export const CALENDAR_TRANSPORT_OPTIONS: { value: string; label: string }[] = [
  { value: "walk", label: "Walk" },
  { value: "public_transit", label: "Public transit" },
  { value: "train", label: "Train" },
  { value: "taxi", label: "Taxi / rideshare" },
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "ferry", label: "Ferry" },
  { value: "mixed", label: "Mixed" },
];

export function durationForTransportMode(baseMinutes: number, mode: string): number {
  const factor = TRANSPORT_MODE_FACTORS[mode.trim().toLowerCase()] ?? 0.85;
  return Math.max(5, Math.round(baseMinutes * factor));
}

export function formatTransportLabel(mode?: string): string {
  if (!mode?.trim()) return "Travel";
  const found = CALENDAR_TRANSPORT_OPTIONS.find((o) => o.value === mode.trim().toLowerCase());
  if (found) return found.label;
  const m = mode.trim().toLowerCase().replaceAll("_", " ");
  return m.replace(/\b\w/g, (c) => c.toUpperCase());
}
