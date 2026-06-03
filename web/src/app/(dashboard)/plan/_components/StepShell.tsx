"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  INK,
  INK2,
  INK3,
  OXBLOOD,
  PAPER,
  PAPER2,
  SANS,
  SERIF,
} from "@/components/landing/brand";
import ProgressTrack from "./ProgressTrack";
import {
  STEPS,
  nextStepPath,
  prevStepPath,
  stepIndex,
  type StepPath,
} from "../_lib/steps";

interface StepShellProps {
  step: StepPath;
  title: string;
  subtitle?: string;
  children: ReactNode;
  canContinue: boolean;
  continueLabel?: string;
  /** Called when the user submits the step. Return false to block navigation. */
  onContinue?: () => void | boolean | Promise<void | boolean>;
  error?: string | null;
  busy?: boolean;
}

export default function StepShell({
  step,
  title,
  subtitle,
  children,
  canContinue,
  continueLabel,
  onContinue,
  error,
  busy = false,
}: StepShellProps) {
  const router = useRouter();
  const i = stepIndex(step);
  const next = nextStepPath(step);
  const prev = prevStepPath(step);
  const isLast = next === null;

  async function handleSubmit() {
    if (!canContinue || busy) return;
    if (onContinue) {
      const result = await onContinue();
      if (result === false) return;
    }
    if (next) router.push(`/plan/${next}`);
  }

  return (
    <div
      className="journy-root journy-paper-texture mx-auto my-6 max-w-[640px]"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <ProgressTrack current={step} />

      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          Step {i + 1} of {STEPS.length} · {STEPS[i].short}
        </div>
        <h1
          style={{
            marginTop: 8,
            fontFamily: SERIF,
            fontSize: "clamp(28px, 4.4vw, 40px)",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              marginTop: 8,
              fontFamily: SERIF,
              fontSize: 15,
              color: INK2,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="flex flex-col gap-5 p-6 md:p-8"
        style={{ background: PAPER }}
        noValidate
      >
        {children}

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

        <div className="flex items-center justify-between gap-3 pt-1">
          {prev ? (
            <Link
              href={`/plan/${prev}`}
              style={{ fontFamily: SERIF, fontSize: 14, color: INK3 }}
            >
              ← Back
            </Link>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={!canContinue || busy}
            className="inline-flex items-center justify-center px-5 py-3 transition disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              background: !canContinue || busy ? INK3 : INK,
              color: PAPER,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {busy
              ? "Working..."
              : continueLabel
                ? continueLabel
                : isLast
                  ? "Generate itinerary"
                  : "Continue →"}
          </button>
        </div>
      </form>
    </div>
  );
}
