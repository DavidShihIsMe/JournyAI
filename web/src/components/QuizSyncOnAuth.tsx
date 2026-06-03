"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { syncQuizWithSupabase } from "@/lib/quizSync";

/**
 * Invisible mount-time hook: runs the localStorage ↔ Supabase quiz reconciliation
 * the first time an authenticated user lands on any dashboard page.
 * Idempotent within a session — guarded by sessionStorage flag inside syncQuizWithSupabase.
 */
export default function QuizSyncOnAuth() {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled || !user) return;
      await syncQuizWithSupabase(supabase, user.id);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
