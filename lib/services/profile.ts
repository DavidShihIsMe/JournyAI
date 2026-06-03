// Single profile service covering: profiles (auth user basics), traveler_profiles
// (quiz scores + computed type), and interests rows. Mirrors trips.ts —
// structural client typing keeps lib/ portable per CLAUDE.md.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseClient = any;

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  age: number | null;
  home_city: string | null;
  home_country: string | null;
  created_at: string;
  updated_at: string;
}

export interface TravelerProfile {
  id?: string;
  user_id: string;
  plan_flow_score: number;
  busy_relaxed_score: number;
  // Schema column is `comfort_discomfort_score` (migration 002).
  // A future migration will rename to comfort_adventure_score.
  comfort_discomfort_score: number;
  immerse_observe_score: number;
  type_code: string | null;
  type_name: string | null;
  profile_confidence: number;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

// --- profiles (basic auth user record) ---

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return { data: data as Profile | null, error };
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  patch: Partial<
    Pick<Profile, "display_name" | "avatar_url" | "age" | "home_city" | "home_country">
  >
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select()
    .single();
  return { data: data as Profile | null, error };
}

// --- traveler_profiles (quiz scores + type) ---

export async function getTravelerProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("traveler_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return { data: data as TravelerProfile | null, error };
}

export async function upsertTravelerProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: Omit<TravelerProfile, "id" | "user_id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("traveler_profiles")
    .upsert({ user_id: userId, ...payload }, { onConflict: "user_id" })
    .select()
    .single();
  return { data: data as TravelerProfile | null, error };
}

// --- interests (one row per selected interest_name) ---

export async function getInterestNames(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("interests")
    .select("interest_name")
    .eq("user_id", userId);
  return {
    data: ((data ?? []) as { interest_name: string }[]).map((i) => i.interest_name),
    error,
  };
}

export async function replaceInterests(
  supabase: SupabaseClient,
  userId: string,
  names: string[]
) {
  const { error: deleteError } = await supabase
    .from("interests")
    .delete()
    .eq("user_id", userId);
  if (deleteError) return { error: deleteError };
  if (names.length === 0) return { error: null };
  const { error: insertError } = await supabase
    .from("interests")
    .insert(names.map((name) => ({ user_id: userId, interest_name: name })));
  return { error: insertError };
}
