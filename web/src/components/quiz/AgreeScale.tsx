"use client";

import { INK, INK3, INK4, SANS, SERIF } from "../landing/brand";

interface AgreeScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  size?: "md" | "lg";
  showLabels?: boolean;
}

export default function AgreeScale({
  value,
  onChange,
  size = "md",
  showLabels = true,
}: AgreeScaleProps) {
  const sizes =
    size === "lg" ? [44, 38, 32, 28, 32, 38, 44] : [36, 30, 26, 22, 26, 30, 36];
  const gap = size === "lg" ? 14 : 10;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap,
        }}
      >
        {sizes.map((s, i) => {
          const selected = value === i + 1;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Option ${i + 1} of 7`}
              aria-pressed={selected}
              onClick={() => onChange(i + 1)}
              style={{
                width: s,
                height: s,
                borderRadius: "50%",
                border: `1.5px solid ${INK}`,
                background: selected ? INK : "transparent",
                cursor: "pointer",
                padding: 0,
                transition:
                  "background 120ms, transform 160ms cubic-bezier(.2,0,0,1)",
                transform: selected ? "scale(1.06)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!selected) e.currentTarget.style.background = INK4 + "55";
              }}
              onMouseLeave={(e) => {
                if (!selected) e.currentTarget.style.background = "transparent";
              }}
            />
          );
        })}
      </div>
      {showLabels && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
            fontFamily: SANS,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: INK3,
          }}
        >
          <span>Disagree</span>
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: 0,
              textTransform: "none",
              fontSize: 13,
            }}
          >
            — neutral —
          </span>
          <span>Agree</span>
        </div>
      )}
    </div>
  );
}
