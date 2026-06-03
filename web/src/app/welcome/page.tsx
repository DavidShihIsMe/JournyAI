"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { INK, INK2, INK3, OXBLOOD, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import CityAutocomplete from "@/components/plan/CityAutocomplete";
import { supabase } from "@/lib/supabase";
import { getProfile, updateProfile } from "@lib/services/profile";

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/home";

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [homeCityPlaceId, setHomeCityPlaceId] = useState("");
  const [homeCountry, setHomeCountry] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from email-derived hint if display_name is empty
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled || !user) return;
      const { data: profile } = await getProfile(supabase, user.id);
      if (cancelled) return;
      if (profile?.display_name) setDisplayName(profile.display_name);
      else if (user.email) {
        const local = user.email.split("@")[0];
        setDisplayName(prettify(local));
      }
      if (profile?.age) setAge(String(profile.age));
      if (profile?.home_city) setHomeCity(profile.home_city);
      if (profile?.home_country) setHomeCountry(profile.home_country);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Derive country from CityAutocomplete's placeId (geo:CC:admin1:slug) if user hasn't set one
  useEffect(() => {
    if (!homeCityPlaceId.startsWith("geo:")) return;
    const cc = homeCityPlaceId.split(":")[1];
    if (!cc || homeCountry) return;
    void (async () => {
      try {
        const res = await fetch("/cities.json", { cache: "force-cache" });
        if (!res.ok) return;
        const data = (await res.json()) as { countries?: Record<string, string> };
        const name = data.countries?.[cc];
        if (name) setHomeCountry(name);
      } catch {
        // best-effort
      }
    })();
  }, [homeCityPlaceId, homeCountry]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }
    const ageNum = age.trim() ? Number(age) : null;
    if (ageNum !== null && (!Number.isFinite(ageNum) || ageNum < 13 || ageNum > 120)) {
      setError("Age must be between 13 and 120 (or leave blank).");
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const { error: updateError } = await updateProfile(supabase, user.id, {
      display_name: displayName.trim(),
      age: ageNum,
      home_city: homeCity.trim() || null,
      home_country: homeCountry.trim() || null,
    });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.push(nextPath);
  }

  function handleSkip() {
    router.push(nextPath);
  }

  return (
    <div
      className="journy-root journy-paper-texture mx-auto my-8 max-w-[560px]"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Reader Record · Welcome
        </div>
        <h1
          style={{
            marginTop: 10,
            fontFamily: SERIF,
            fontSize: "clamp(28px, 4.4vw, 44px)",
            lineHeight: 1.04,
          }}
        >
          A few <span style={{ fontStyle: "italic", fontWeight: 400 }}>basics</span>
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 15, lineHeight: 1.5, color: INK2 }}>
          So your guidebook can address you by name and use your home city for context. You can
          skip and fill these in later from your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 md:p-8" style={{ background: PAPER }}>
        {error ? (
          <p
            className="px-3 py-2"
            style={{
              border: `1px solid ${OXBLOOD}`,
              background: `${OXBLOOD}14`,
              color: OXBLOOD,
              fontFamily: SERIF,
              fontSize: 14,
            }}
          >
            {error}
          </p>
        ) : null}

        <Field
          label="Display name"
          value={displayName}
          onChange={setDisplayName}
          placeholder="What should the guidebook call you?"
        />
        <Field
          label="Age (optional)"
          type="number"
          inputMode="numeric"
          value={age}
          onChange={setAge}
          placeholder="e.g. 32"
        />

        <div className="flex flex-col gap-2">
          <span
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            Home city (optional)
          </span>
          <CityAutocomplete
            value={homeCity}
            placeId={homeCityPlaceId}
            onChange={({ value, placeId }) => {
              setHomeCity(value);
              setHomeCityPlaceId(placeId);
              if (!value || !placeId) {
                // user cleared or typed freely — keep their country edits
              } else {
                // new pick — let the placeId effect refresh country
                setHomeCountry("");
              }
            }}
            placeholder="Start typing — e.g. Paris, Tokyo, Brooklyn"
          />
        </div>

        <Field
          label="Home country (optional)"
          value={homeCountry}
          onChange={setHomeCountry}
          placeholder="Auto-filled from your home city"
        />

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleSkip}
            style={{
              fontFamily: SERIF,
              fontSize: 14,
              color: INK3,
              background: "none",
              border: "none",
              padding: 0,
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
            }}
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={loading || !loaded}
            className="inline-flex items-center justify-center px-5 py-3 transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              background: loading || !loaded ? INK3 : INK,
              color: PAPER,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {loading ? "Saving..." : "Continue →"}
          </button>
        </div>

        <Link href="/" style={{ fontFamily: SERIF, fontSize: 13, color: INK3, marginTop: 4 }}>
          ← Back to home
        </Link>
      </form>
    </div>
  );
}

function prettify(s: string): string {
  return s
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function Field({
  label,
  type = "text",
  inputMode,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: "text" | "number";
  inputMode?: "numeric";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const style: CSSProperties = {
    border: `1px solid ${INK3}`,
    borderRadius: 0,
    background: PAPER2,
    color: INK,
    fontFamily: SERIF,
    fontSize: 15,
  };
  return (
    <label className="flex flex-col gap-2">
      <span
        style={{
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK3,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 outline-none"
        style={style}
      />
    </label>
  );
}
