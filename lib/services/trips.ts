import type { SupabaseClient } from "@supabase/supabase-js";

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  status: "planning" | "finalized" | "completed";
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

export async function createTrip(
  supabase: SupabaseClient,
  userId: string,
  tripData: { title: string; destination: string; start_date?: string; end_date?: string }
) {
  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: userId,
      ...tripData,
      status: "planning",
    })
    .select()
    .single();
  return { data: data as Trip | null, error };
}
