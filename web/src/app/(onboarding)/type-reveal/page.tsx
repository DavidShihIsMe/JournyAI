"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RevealHero from "@/components/typereveal/RevealHero";
import Dossier from "@/components/typereveal/Dossier";
import { FRCO } from "@/components/typereveal/typeData";
import {
  INK,
  INK2,
  INK3,
  MONO,
  PAPER,
  SANS,
  SERIF,
} from "@/components/landing/brand";
import { calculateTravelerFromResponses, type TypeResult } from "@lib/onboarding/typeCalculator";

const RESPONSES_KEY = "journy_quiz_responses";

interface RawResponse {
  questionId: number;
  dataKey?: string;
  value: number;
}

export default function TypeRevealPage() {
  const router = useRouter();
  const [result, setResult] = useState<TypeResult | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(RESPONSES_KEY);
    let responses: RawResponse[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as RawResponse[];
        if (Array.isArray(parsed)) responses = parsed;
      } catch {
        // fall through to redirect
      }
    }

    if (responses.length === 0) {
      router.replace("/quiz");
      return;
    }

    console.log("[type-reveal] quiz responses from localStorage:", responses);

    const computed = calculateTravelerFromResponses(
      responses.map((r) => ({ questionId: r.questionId, value: r.value }))
    );

    console.log("[type-reveal] dimension scores:", {
      plan_flow: computed.dimensions.plan_flow.score,
      busy_relaxed: computed.dimensions.busy_relaxed.score,
      comfort_adventure: computed.dimensions.comfort_adventure.score,
      immerse_observe: computed.dimensions.immerse_observe.score,
    });
    console.log("[type-reveal] confidence per dimension (%):", {
      plan_flow: computed.dimensions.plan_flow.confidence,
      busy_relaxed: computed.dimensions.busy_relaxed.confidence,
      comfort_adventure: computed.dimensions.comfort_adventure.confidence,
      immerse_observe: computed.dimensions.immerse_observe.confidence,
    });
    console.log(
      `[type-reveal] result → code=${computed.code}  name="${computed.name}"  groupColor=${computed.groupColor}`
    );

    setResult(computed);
    setStatus("ready");
  }, [router]);

  const axes = useMemo(() => {
    if (!result) return [];
    const code = result.code;
    return [
      {
        label: "Rhythm",
        left: "Plan",
        right: "Flow",
        active: (code[0] === "F" ? 1 : 0) as 0 | 1,
      },
      {
        label: "Pace",
        left: "Busy",
        right: "Relaxed",
        active: (code[1] === "R" ? 1 : 0) as 0 | 1,
      },
      {
        label: "Appetite",
        left: "Comfort",
        right: "Adventure",
        active: (code[2] === "A" ? 1 : 0) as 0 | 1,
      },
      {
        label: "Setting",
        left: "Immerse",
        right: "Observe",
        active: (code[3] === "O" ? 1 : 0) as 0 | 1,
      },
    ];
  }, [result]);

  if (status === "loading" || !result) {
    return (
      <div
        className="journy-root journy-paper-texture"
        style={{
          background: PAPER,
          color: INK,
          position: "relative",
          minHeight: "100vh",
        }}
      />
    );
  }

  return (
    <div
      className="journy-root journy-paper-texture"
      style={{
        background: PAPER,
        color: INK,
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <RevealHero
          code={result.code}
          name={result.name}
          color={result.groupColor}
          axes={axes}
        />
        {result.code === "FRCO" ? (
          <Dossier type={FRCO} />
        ) : (
          <DossierTypeset result={result} />
        )}
      </div>
    </div>
  );
}

function DossierTypeset({ result }: { result: TypeResult }) {
  const dims: Array<["Rhythm" | "Pace" | "Appetite" | "Setting", { label: string; confidence: number }]> = [
    ["Rhythm", result.dimensions.plan_flow],
    ["Pace", result.dimensions.busy_relaxed],
    ["Appetite", result.dimensions.comfort_adventure],
    ["Setting", result.dimensions.immerse_observe],
  ];

  return (
    <section
      id="dossier"
      style={{
        padding: "120px 40px 140px",
        background: PAPER,
        borderTop: `1px solid ${INK}`,
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: INK3,
            letterSpacing: "0.14em",
          }}
        >
          § 01
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: SANS,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: INK,
          }}
        >
          The Dossier
        </div>

        <h2
          style={{
            margin: "22px 0 0",
            fontFamily: SERIF,
            fontWeight: 700,
            fontVariationSettings: '"opsz" 96',
            fontSize: "clamp(36px, 4.6vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          Your full dossier is{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>being typeset.</span>
        </h2>

        <p
          style={{
            margin: "24px auto 0",
            maxWidth: 560,
            fontFamily: SERIF,
            fontSize: 17,
            lineHeight: 1.6,
            color: INK2,
          }}
        >
          The editor&rsquo;s notation has been entered — {result.name} ({result.code}) — and a
          full guidebook entry is in production. In the meantime, here is the cartouche we
          drew for you.
        </p>

        <div
          style={{
            marginTop: 56,
            border: `1px solid ${INK}`,
            background: PAPER,
            textAlign: "left",
          }}
        >
          {dims.map(([axis, dim], i) => (
            <div
              key={axis}
              style={{
                padding: "20px 28px",
                borderBottom: i < dims.length - 1 ? `0.5px solid ${INK3}33` : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: INK3,
                }}
              >
                {axis}
              </span>
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  fontWeight: 700,
                  color: INK,
                }}
              >
                {dim.label}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  color: result.groupColor,
                }}
              >
                {dim.confidence}% confident
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
