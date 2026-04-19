"use client";

import RevealHero from "@/components/typereveal/RevealHero";
import Dossier from "@/components/typereveal/Dossier";
import { FRCO } from "@/components/typereveal/typeData";
import { INK, PAPER } from "@/components/landing/brand";

export default function TypeRevealPage() {
  const type = FRCO;
  const axes = [
    {
      label: "Rhythm",
      left: "Plan",
      right: "Flow",
      active: (type.code[0] === "F" ? 1 : 0) as 0 | 1,
    },
    {
      label: "Pace",
      left: "Busy",
      right: "Relaxed",
      active: (type.code[1] === "R" ? 1 : 0) as 0 | 1,
    },
    {
      label: "Appetite",
      left: "Adventure",
      right: "Cultural",
      active: (type.code[2] === "C" ? 1 : 0) as 0 | 1,
    },
    {
      label: "Setting",
      left: "Indoors",
      right: "Outdoors",
      active: (type.code[3] === "O" ? 1 : 0) as 0 | 1,
    },
  ];

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
          code={type.code}
          name={type.name}
          color={type.color}
          axes={axes}
        />
        <Dossier type={type} />
      </div>
    </div>
  );
}
