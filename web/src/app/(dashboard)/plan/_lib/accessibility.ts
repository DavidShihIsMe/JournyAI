export interface AccessibilityOption {
  value: string;
  label: string;
  sub: string;
}

export const ACCESSIBILITY_OPTIONS: AccessibilityOption[] = [
  {
    value: "wheelchair",
    label: "Wheelchair",
    sub: "Step-free routes, ramps, no curbs or stairs.",
  },
  {
    value: "shorter_walks",
    label: "Shorter walks",
    sub: "Keep most legs under ~10 minutes.",
  },
  {
    value: "rest_breaks",
    label: "Frequent rest stops",
    sub: "Sit-down breaks built into every day.",
  },
  {
    value: "no_stairs",
    label: "No stairs",
    sub: "Elevators only — skip venues that are stairs-only.",
  },
  {
    value: "service_animal",
    label: "Service animal",
    sub: "Only venues that allow service animals.",
  },
  {
    value: "low_vision",
    label: "Low vision",
    sub: "Large signage, audio descriptions, well-lit venues.",
  },
  {
    value: "hearing",
    label: "Hearing impairment",
    sub: "Captioned tours, written info, visual cues.",
  },
  {
    value: "sensory_friendly",
    label: "Quiet / sensory-friendly",
    sub: "Less crowded spots and times, low-stimulation venues.",
  },
];
