// lib/ must stay portable per CLAUDE.md (no @supabase/supabase-js import).
// The web app passes its real SupabaseClient — typed as any here, but type-safe
// at every call site since callers import the strongly-typed client themselves.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseClient = any;

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  status: "planning" | "finalized" | "completed";
  data: unknown;
  ui_state: unknown;
  created_at: string;
  updated_at: string;
}

export async function getTrips(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: (data as Trip[] | null) ?? [], error };
}

export async function getTrip(supabase: SupabaseClient, tripId: string) {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();
  return { data: data as Trip | null, error };
}

export async function saveTrip(
  supabase: SupabaseClient,
  userId: string,
  payload: {
    title: string;
    destination: string;
    start_date?: string | null;
    end_date?: string | null;
    data: unknown;
    ui_state?: unknown;
  }
) {
  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: userId,
      title: payload.title,
      destination: payload.destination,
      start_date: payload.start_date ?? null,
      end_date: payload.end_date ?? null,
      data: payload.data,
      ui_state: payload.ui_state ?? {},
      status: "planning",
    })
    .select()
    .single();
  return { data: data as Trip | null, error };
}

export async function updateTripData(
  supabase: SupabaseClient,
  tripId: string,
  data: unknown
) {
  const { error } = await supabase.from("trips").update({ data }).eq("id", tripId);
  return { error };
}

export async function updateTripUiState(
  supabase: SupabaseClient,
  tripId: string,
  ui_state: unknown
) {
  const { error } = await supabase.from("trips").update({ ui_state }).eq("id", tripId);
  return { error };
}

export async function deleteTrip(supabase: SupabaseClient, tripId: string) {
  const { error } = await supabase.from("trips").delete().eq("id", tripId);
  return { error };
}
