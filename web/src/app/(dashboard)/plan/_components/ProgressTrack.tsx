"use client";

import { INK, INK3, PAPER2 } from "@/components/landing/brand";
import { STEPS, stepIndex, type StepPath } from "../_lib/steps";

export default function ProgressTrack({ current }: { current: StepPath }) {
  const i = stepIndex(current);
  return (
    <div
      className="flex gap-1 px-6 py-3"
      style={{ background: PAPER2, borderBottom: `1px solid ${INK}` }}
      aria-label={`Step ${i + 1} of ${STEPS.length}`}
    >
      {STEPS.map((s, idx) => (
        <div
          key={s.path}
          className="flex-1"
          style={{
            height: 3,
            background: idx <= i ? INK : INK3,
            opacity: idx <= i ? 1 : 0.25,
          }}
          aria-current={idx === i ? "step" : undefined}
          title={`${idx + 1}. ${s.short}`}
        />
      ))}
    </div>
  );
}
