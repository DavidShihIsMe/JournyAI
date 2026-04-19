export interface AxisDetail {
  label: string;
  leans: string;
  left: string;
  right: string;
  pos: number;
}

export interface CompatibilityEntry {
  how: string;
  code: string;
  name: string;
  color: string;
  note: string;
}

export interface CityEntry {
  name: string;
  coord: string;
  why: string;
  vol: string;
}

export interface TypeData {
  code: string;
  name: string;
  short: string;
  group: string;
  color: string;
  tagline: string;
  definition: string;
  definitionPart2: string;
  behaviors: Array<[string, string]>;
  inGroup: string;
  roles: Array<[string, string]>;
  leanIn: string[];
  watchFor: string[];
  axisDetails: AxisDetail[];
  compatibility: CompatibilityEntry[];
  cities: CityEntry[];
}

export const FRCO: TypeData = {
  code: "FRCO",
  name: "The Dreamer",
  short: "Dreamer",
  group: "FR",
  color: "#3A5A78",
  tagline:
    "travels by mood and by weather; keeps the window seat on principle.",
  definition:
    "The Dreamer moves by feel. A schedule is a suggestion, a reservation a convenience — the day bends around weather, sunlight, and whatever appears in the window of a passing tram. A bookshop is a valid itinerary. A view is reason enough to change restaurants.",
  definitionPart2:
    "Among the sixteen, the Dreamer is the least likely to post about a trip while taking it, and the most likely to come home with a notebook of torn receipts and a single photograph, at dusk, of a corner nobody else noticed.",
  behaviors: [
    [
      "Mornings",
      "Begins slowly. Coffee at the café with the best light, not the best beans. Will skip breakfast for a second walk.",
    ],
    [
      "At lunch",
      "Changes restaurants for a better view. Orders the thing the table next to them is having.",
    ],
    [
      "Afternoons",
      "Pockets the map. Gets lost on purpose. Ends up in a cemetery, a garden, or a bookshop, often all three.",
    ],
    [
      "Evenings",
      "Eats where the light is long. Ignores reservations. Stays for the second bottle, loses track of the hour.",
    ],
    [
      "Packing",
      "Two books, one linen shirt too few, and a small notebook with a pencil clipped inside.",
    ],
    [
      "In transit",
      "Window seat, every time. Reads until the landscape starts, then reads less.",
    ],
  ],
  inGroup:
    "The Dreamer is the one who makes the trip feel like a story, rather than an itinerary. They will not lead, but they will remember. Travel with one and you come home with fewer photos and more moments — the long afternoon at the tram window, the dinner nobody planned, the wrong village at sunset.",
  roles: [
    [
      "In a pair",
      "A quiet counterweight. Brings the slower half of the day. Trusts the other to call the cabs.",
    ],
    [
      "In a group",
      "Drifts a half-block behind, then appears with a recommendation nobody asked for but everyone accepts.",
    ],
    [
      "With a Director",
      "A useful contradiction. The Director books the hours; the Dreamer fills them.",
    ],
    [
      "Alone",
      "Best, frankly. The Dreamer is a solo traveler even when not solo.",
    ],
  ],
  leanIn: [
    "Unbooked afternoons. Room for weather, light, and a change of mind.",
    "Window seats on every leg — train, tram, café, dinner.",
    "One book per city, read there and left behind on purpose.",
    "Long walks home instead of short cabs.",
    "Restaurants chosen after arrival, not before.",
  ],
  watchFor: [
    'The seductive ninety-minute "quick stop" that becomes four hours. Set a gentle alarm.',
    "Under-planning dinner in a popular city. The Dreamer still needs to eat.",
    "The notebook full of receipts that you will, in fact, want to re-read later.",
    "Mistaking vagueness for openness. A frame is freeing.",
  ],
  axisDetails: [
    { label: "Rhythm", leans: "flow", left: "Plan", right: "Flow", pos: 82 },
    {
      label: "Pace",
      leans: "relaxed",
      left: "Busy",
      right: "Relaxed",
      pos: 84,
    },
    {
      label: "Appetite",
      leans: "cultural",
      left: "Adventure",
      right: "Cultural",
      pos: 74,
    },
    {
      label: "Setting",
      leans: "outdoors",
      left: "Indoors",
      right: "Outdoors",
      pos: 66,
    },
  ],
  compatibility: [
    {
      how: "Travels with well",
      code: "PBCI",
      name: "The Director",
      color: "#B6832A",
      note: "The Director does the bookings. The Dreamer makes them feel like a story.",
    },
    {
      how: "Complements",
      code: "FBAO",
      name: "The Drifter",
      color: "#C76B3F",
      note: "A shared instinct to wander; the Drifter supplies the adrenaline, the Dreamer the pause.",
    },
    {
      how: "Kindred spirit",
      code: "FRAO",
      name: "The Ghost",
      color: "#3A5A78",
      note: "Both prefer to leave no trace. Two Dreamers in conversation is a valid vacation.",
    },
  ],
  cities: [
    {
      name: "Lisbon",
      coord: "38.72°N · 9.14°W",
      why: "Weather that rewards lingering; trams that are narrative devices.",
      vol: "IV",
    },
    {
      name: "Kyoto",
      coord: "35.01°N · 135.76°E",
      why: "A city for the second, third, fourth cup of tea.",
      vol: "VII",
    },
    {
      name: "Porto",
      coord: "41.15°N · 8.61°W",
      why: "Light on the river at six. The bridges do most of the work.",
      vol: "II",
    },
    {
      name: "Palermo",
      coord: "38.12°N · 13.36°E",
      why: "Unbothered, gorgeous, and late to dinner. So are you.",
      vol: "III",
    },
    {
      name: "Istanbul",
      coord: "41.01°N · 28.98°E",
      why: "A city that swallows plans and returns better ones.",
      vol: "V",
    },
  ],
};
