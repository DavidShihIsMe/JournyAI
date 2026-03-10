import type { SupabaseClient } from "@supabase/supabase-js";
import type { CardResponse } from "../onboarding/types";

export async function saveSwipeResponses(
  supabase: SupabaseClient,
  userId: string,
  responses: CardResponse[]
) {
  const { error } = await supabase.from("swipe_responses").insert(
    responses.map((r) => ({
      user_id: userId,
      card_id: r.cardId,
      response: r.response,
    }))
  );
  return { error };
}

export async function getSwipeResponses(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("swipe_responses")
    .select("*")
    .eq("user_id", userId)
    .order("card_id", { ascending: true });
  return { data, error };
}
