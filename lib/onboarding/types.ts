export type SwipeResponse = "left" | "right" | "super_like";

export interface CardResponse {
  cardId: number;
  response: SwipeResponse;
}

export interface SwipeCard {
  id: number;
  caption: string;
  imageUrl: string;
  tier: "anchor" | "compound" | "full_spectrum";
  weights: DimensionWeights;
}

export interface DimensionWeights {
  plan_flow: number;
  busy_relaxed: number;
  comfort_adventure: number;
  immerse_observe: number;
}

export interface DimensionScores {
  plan_flow_score: number;
  busy_relaxed_score: number;
  comfort_adventure_score: number;
  immerse_observe_score: number;
  confidence: {
    plan_flow: number;
    busy_relaxed: number;
    comfort_adventure: number;
    immerse_observe: number;
  };
}

export interface TravelerType {
  type_code: string;
  type_name: string;
}

export interface TravelerProfile {
  id: string;
  user_id: string;
  plan_flow_score: number;
  busy_relaxed_score: number;
  comfort_adventure_score: number;
  immerse_observe_score: number;
  type_code: string | null;
  type_name: string | null;
  profile_confidence: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DreamDayResponse {
  step_number: number;
  dimension: string;
  choice: "left" | "right";
}
