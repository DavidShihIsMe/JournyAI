export interface TravelerTypeInfo {
  code: string;
  name: string;
  description: string;
}

export const TRAVELER_TYPES: Record<string, TravelerTypeInfo> = {
  PBCI: {
    code: "PBCI",
    name: "The Director",
    description: "You orchestrate every detail of a packed itinerary with precision.",
  },
  PBCO: {
    code: "PBCO",
    name: "The Collector",
    description: "You curate a full schedule of carefully chosen experiences to witness.",
  },
  PBDI: {
    code: "PBDI",
    name: "The Operator",
    description: "You plan bold, high-intensity adventures and dive in headfirst.",
  },
  PBDO: {
    code: "PBDO",
    name: "The Documentarian",
    description: "You plan a packed schedule to capture and catalog every moment.",
  },
  PRCI: {
    code: "PRCI",
    name: "The Artisan",
    description: "You plan a relaxed pace with deep, comfortable cultural immersion.",
  },
  PRCO: {
    code: "PRCO",
    name: "The Connoisseur",
    description: "You seek refined, curated experiences enjoyed at a leisurely pace.",
  },
  PRDI: {
    code: "PRDI",
    name: "The Apprentice",
    description: "You plan space for slow, meaningful engagement with unfamiliar worlds.",
  },
  PRDO: {
    code: "PRDO",
    name: "The Pilgrim",
    description: "You set out with purpose but let the journey unfold at its own pace.",
  },
  FBCI: {
    code: "FBCI",
    name: "The Spark",
    description: "You follow impulses into a whirlwind of comfortable, immersive experiences.",
  },
  FBCO: {
    code: "FBCO",
    name: "The Flaneur",
    description: "You wander freely through busy streets, watching the world go by.",
  },
  FBDI: {
    code: "FBDI",
    name: "The Adventurer",
    description: "You chase spontaneous thrills and throw yourself into the unknown.",
  },
  FBDO: {
    code: "FBDO",
    name: "The Drifter",
    description: "You go wherever the wind takes you, comfortable with discomfort and distance.",
  },
  FRCI: {
    code: "FRCI",
    name: "The Romantic",
    description: "You let serendipity guide you to cozy, intimate cultural moments.",
  },
  FRCO: {
    code: "FRCO",
    name: "The Dreamer",
    description: "You float through destinations at your own pace, savoring beauty from afar.",
  },
  FRDI: {
    code: "FRDI",
    name: "The Nomad",
    description: "You wander slowly into unfamiliar territory, embracing whatever comes.",
  },
  FRDO: {
    code: "FRDO",
    name: "The Ghost",
    description: "You drift through places unseen, at ease in the margins of the unknown.",
  },
};
