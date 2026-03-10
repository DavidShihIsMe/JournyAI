import type { SupabaseClient } from "@supabase/supabase-js";
import type { DreamDayResponse } from "../onboarding/types";

export async function saveDreamDayResponses(
  supabase: SupabaseClient,
  userId: string,
  responses: DreamDayResponse[]
) {
  const { error } = await supabase.from("dream_day_responses").insert(
    responses.map((r) => ({
      user_id: userId,
      step_number: r.step_number,
      dimension: r.dimension,
      choice: r.choice,
    }))
  );
  return { error };
}

export async function getDreamDayResponses(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("dream_day_responses")
    .select("*")
    .eq("user_id", userId)
    .order("step_number", { ascending: true });
  return { data: data as DreamDayResponse[] | null, error };
}
