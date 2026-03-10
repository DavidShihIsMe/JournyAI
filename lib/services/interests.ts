import type { SupabaseClient } from "@supabase/supabase-js";

export async function saveInterests(
  supabase: SupabaseClient,
  userId: string,
  interests: string[]
) {
  // Delete existing interests first, then insert new ones
  await supabase.from("interests").delete().eq("user_id", userId);

  if (interests.length === 0) return { error: null };

  const { error } = await supabase.from("interests").insert(
    interests.map((name) => ({
      user_id: userId,
      interest_name: name,
    }))
  );
  return { error };
}

export async function getInterests(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("interests")
    .select("interest_name")
    .eq("user_id", userId);

  const interests = data?.map((row) => row.interest_name as string) ?? [];
  return { data: interests, error };
}
