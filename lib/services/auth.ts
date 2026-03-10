import type { SupabaseClient } from "@supabase/supabase-js";

export async function signUp(
  supabase: SupabaseClient,
  email: string,
  password: string,
  displayName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) return { user: null, error };

  if (data.user) {
    await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", data.user.id);
  }

  return { user: data.user, error: null };
}

export async function signIn(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error };
}

export async function signInWithGoogle(
  supabase: SupabaseClient,
  redirectTo: string
) {
  // Google OAuth requires Google Client ID and Secret configured in Supabase Dashboard:
  // Authentication → Providers → Google → enable and paste credentials.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  return { url: data?.url ?? null, error };
}

export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

export async function resetPassword(supabase: SupabaseClient, email: string, redirectTo: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { error };
}

export async function updatePassword(supabase: SupabaseClient, newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error };
}

export async function resendVerification(supabase: SupabaseClient, email: string) {
  const { error } = await supabase.auth.resend({ type: "signup", email });
  return { error };
}
