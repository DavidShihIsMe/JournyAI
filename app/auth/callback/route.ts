import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const response = NextResponse.redirect(`${origin}/dashboard`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers
              .get("cookie")
              ?.split("; ")
              .map((c) => {
                const [name, ...rest] = c.split("=");
                return { name, value: rest.join("=") };
              }) ?? [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if the user has a profile with a display name; if not, populate from Google metadata
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile && !profile.display_name) {
          const meta = user.user_metadata;
          await supabase
            .from("profiles")
            .update({
              display_name: meta?.full_name || meta?.name || meta?.display_name || "Traveler",
              avatar_url: meta?.avatar_url || meta?.picture || null,
            })
            .eq("id", user.id);
        }

        // Redirect based on onboarding status
        const { data: traveler } = await supabase
          .from("traveler_profiles")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .single();

        if (traveler?.onboarding_completed) {
          return NextResponse.redirect(`${origin}/dashboard`);
        } else {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return response;
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
