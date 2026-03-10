import type { SupabaseClient } from "@supabase/supabase-js";

export async function logOnboardingEvent(
  supabase: SupabaseClient,
  userId: string,
  sessionId: string,
  eventType: string,
  eventData?: Record<string, unknown>
) {
  const { error } = await supabase.from("onboarding_events").insert({
    user_id: userId,
    session_id: sessionId,
    event_type: eventType,
    event_data: eventData ?? null,
  });
  return { error };
}
