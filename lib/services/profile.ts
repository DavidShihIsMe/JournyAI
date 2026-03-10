import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, TravelerProfile } from "../onboarding/types";

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data: data as Profile | null, error };
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Pick<Profile, "display_name" | "avatar_url">>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return { data: data as Profile | null, error };
}

export async function getTravelerProfile(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("traveler_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data: data as TravelerProfile | null, error };
}

export async function upsertTravelerProfile(
  supabase: SupabaseClient,
  profile: {
    user_id: string;
    plan_flow_score: number;
    busy_relaxed_score: number;
    comfort_discomfort_score: number;
    immerse_observe_score: number;
    type_code: string;
    type_name: string;
    profile_confidence: number;
    onboarding_completed?: boolean;
  }
) {
  const { data, error } = await supabase
    .from("traveler_profiles")
    .upsert(profile, { onConflict: "user_id" })
    .select()
    .single();
  return { data: data as TravelerProfile | null, error };
}
