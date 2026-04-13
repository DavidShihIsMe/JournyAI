"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/services/auth";
import { getTravelerProfile, updateDimensionScores } from "@/lib/services/profile";
import { getInterests } from "@/lib/services/interests";
import { getDreamDayResponses } from "@/lib/services/dreamDay";
import { determineTypeCode } from "@/lib/onboarding/scoring";
import { getTypeInfo } from "@/lib/constants/types";
import { DIMENSIONS } from "@/lib/constants/dimensions";
import { FIXED_STEPS, DYNAMIC_OPTIONS } from "@/lib/onboarding/dreamDay";
import type { TravelerProfile, DreamDayResponse } from "@/lib/onboarding/types";
import { Button } from "@/components/ui/button";

const SCORE_KEYS = [
  "plan_flow_score",
  "busy_relaxed_score",
  "comfort_adventure_score",
  "immerse_observe_score",
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<TravelerProfile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [dreamDayResponses, setDreamDayResponses] = useState<DreamDayResponse[]>([]);

  // Editable scores (for sliders)
  const [scores, setScores] = useState({
    plan_flow_score: 50,
    busy_relaxed_score: 50,
    comfort_adventure_score: 50,
    immerse_observe_score: 50,
  });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getCurrentUser(supabase).then(async ({ user }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const [
        { data: travelerProfile },
        { data: userInterests },
        { data: dreamDay },
      ] = await Promise.all([
        getTravelerProfile(supabase, user.id),
        getInterests(supabase, user.id),
        getDreamDayResponses(supabase, user.id),
      ]);

      if (travelerProfile) {
        setProfile(travelerProfile);
        setScores({
          plan_flow_score: travelerProfile.plan_flow_score,
          busy_relaxed_score: travelerProfile.busy_relaxed_score,
          comfort_adventure_score: travelerProfile.comfort_adventure_score,
          immerse_observe_score: travelerProfile.immerse_observe_score,
        });
      }

      setInterests(userInterests);
      setDreamDayResponses(dreamDay ?? []);
      setLoading(false);
    });
  }, [router]);

  // Live type calculation from current slider values
  const liveType = determineTypeCode(scores);
  const liveTypeInfo = getTypeInfo(liveType.type_code);

  const handleSliderChange = useCallback(
    (key: (typeof SCORE_KEYS)[number], value: number) => {
      setScores((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    await updateDimensionScores(supabase, userId, scores);
    setDirty(false);
    setSaving(false);
  }, [userId, scores]);

  // Profile completion
  const completionPercent =
    profile?.onboarding_completed
      ? interests.length > 0
        ? 75
        : 65
      : 0;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No traveler profile found.</p>
        <Button onClick={() => router.push("/onboarding")}>
          Start Onboarding
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Section 1 — Traveler Type */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">{liveType.type_name}</h1>
        <p className="font-mono text-lg text-muted-foreground">
          {liveType.type_code}
        </p>
        {liveTypeInfo && (
          <>
            <p className="text-lg italic text-muted-foreground">
              &ldquo;{liveTypeInfo.tagline}&rdquo;
            </p>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {liveTypeInfo.portrait}
            </p>
          </>
        )}
      </section>

      {/* Section 2 — Dimension Sliders */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Dimensions</h2>
          {dirty && (
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? "Saving..." : "Save changes"}
            </Button>
          )}
        </div>
        <div className="space-y-6">
          {DIMENSIONS.map((dim, i) => {
            const key = SCORE_KEYS[i];
            const value = scores[key];
            return (
              <div key={dim.key}>
                <div className="mb-1 flex justify-between text-sm font-medium">
                  <span>{dim.lowPole}</span>
                  <span>{dim.highPole}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) =>
                    handleSliderChange(key, Number(e.target.value))
                  }
                  className="w-full accent-primary"
                />
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  {dim.description} &middot;{" "}
                  <span className="font-mono">{value}</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3 — Interests */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Interests</h2>
          <Button variant="outline" size="sm" disabled>
            Edit
          </Button>
        </div>
        {interests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {interests.map((name) => (
              <span
                key={name}
                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No interests selected yet.
          </p>
        )}
      </section>

      {/* Section 4 — Dream Day Summary */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Dream Day</h2>
          <Button variant="outline" size="sm" disabled>
            Retake
          </Button>
        </div>
        {dreamDayResponses.length > 0 ? (
          <DreamDayTimeline responses={dreamDayResponses} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No dream day responses found.
          </p>
        )}
      </section>

      {/* Section 5 — Profile Completion */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Profile Completion</h2>
        <div className="flex items-center gap-3">
          <div className="h-3 flex-1 rounded-full bg-muted">
            <div
              className="h-3 rounded-full bg-primary transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-sm font-mono font-medium">
            {completionPercent}%
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Answer more questions to improve your recommendations.
        </p>
      </section>
    </div>
  );
}

function DreamDayTimeline({ responses }: { responses: DreamDayResponse[] }) {
  // Build a lookup of all possible steps for matching
  const allStepOptions = [
    ...FIXED_STEPS,
    ...Object.values(DYNAMIC_OPTIONS).flatMap((opts) => [
      opts.evening,
      opts.night,
    ]),
  ];

  return (
    <div className="space-y-0">
      {responses.map((r, i) => {
        // Find matching step by step_number and dimension
        const step = allStepOptions.find(
          (s) => s.step_number === r.step_number && s.dimension === r.dimension
        );
        const chosenText = step
          ? r.choice === "left"
            ? step.left_option
            : step.right_option
          : `Step ${r.step_number} — ${r.choice}`;

        return (
          <div key={r.step_number} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </div>
              {i < responses.length - 1 && (
                <div className="w-px flex-1 bg-border" />
              )}
            </div>
            <div className="pb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {step?.time_of_day ?? `Step ${r.step_number}`}
              </p>
              <p className="mt-1 text-sm">{chosenText}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
