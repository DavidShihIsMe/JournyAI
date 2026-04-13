"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DIMENSIONS } from "@/lib/constants/dimensions";
import { getTypeInfo } from "@/lib/constants/types";
import type { TravelerTypeInfo } from "@/lib/constants/types";

interface TypeRevealProps {
  typeCode: string;
  typeName: string;
  scores: {
    plan_flow_score: number;
    busy_relaxed_score: number;
    comfort_adventure_score: number;
    immerse_observe_score: number;
  };
  onContinue: () => void;
}

const SCORE_KEYS = [
  "plan_flow_score",
  "busy_relaxed_score",
  "comfort_adventure_score",
  "immerse_observe_score",
] as const;

export default function TypeReveal({
  typeCode,
  typeName,
  scores,
  onContinue,
}: TypeRevealProps) {
  const [section, setSection] = useState(0);
  const typeInfo = getTypeInfo(typeCode);

  if (!typeInfo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-2xl font-bold">{typeName}</h1>
        <p className="font-mono text-muted-foreground">{typeCode}</p>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    );
  }

  const sections = [
    <RevealSection key="reveal" typeInfo={typeInfo} />,
    <DimensionsSection key="dimensions" scores={scores} />,
    <PortraitSection key="portrait" typeInfo={typeInfo} />,
    <CompatibilitySection key="compat" typeInfo={typeInfo} />,
    <FunStatsSection key="stats" typeInfo={typeInfo} />,
    <ActionsSection key="actions" typeInfo={typeInfo} onContinue={onContinue} />,
  ];

  const isLast = section === sections.length - 1;

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      {/* Progress dots */}
      <div className="mb-8 flex justify-center gap-1.5">
        {sections.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              i <= section ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Current section */}
      <div className="flex flex-1 flex-col">{sections[section]}</div>

      {/* Navigation */}
      {!isLast && (
        <div className="mt-6 flex gap-3">
          {section > 0 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSection((s) => s - 1)}
            >
              Back
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={() => setSection((s) => s + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function RevealSection({ typeInfo }: { typeInfo: TravelerTypeInfo }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        You are
      </p>
      <h1 className="text-4xl font-bold">{typeInfo.name}</h1>
      <p className="font-mono text-lg text-muted-foreground">
        {typeInfo.code}
      </p>
      <p className="mt-2 text-lg italic text-muted-foreground">
        &ldquo;{typeInfo.tagline}&rdquo;
      </p>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {typeInfo.description}
      </p>
    </div>
  );
}

function DimensionsSection({
  scores,
}: {
  scores: TypeRevealProps["scores"];
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <h2 className="text-center text-xl font-semibold">Your Dimensions</h2>
      <div className="space-y-5">
        {DIMENSIONS.map((dim, i) => {
          const value = scores[SCORE_KEYS[i]];
          return (
            <div key={dim.key}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium">{dim.lowPole}</span>
                <span className="font-medium">{dim.highPole}</span>
              </div>
              <div className="relative h-3 rounded-full bg-muted">
                <div
                  className="absolute h-3 rounded-full bg-primary transition-all"
                  style={{ width: `${value}%` }}
                />
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 h-3 w-px bg-border" />
              </div>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {dim.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PortraitSection({ typeInfo }: { typeInfo: TravelerTypeInfo }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <h2 className="text-center text-xl font-semibold">Your Portrait</h2>
      <p className="leading-relaxed text-muted-foreground">
        {typeInfo.portrait}
      </p>
    </div>
  );
}

function CompatibilitySection({ typeInfo }: { typeInfo: TravelerTypeInfo }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <h2 className="text-center text-xl font-semibold">
        Best Travel Companions
      </h2>
      <div className="space-y-3">
        {typeInfo.compatibility.map((code) => {
          const companion = getTypeInfo(code);
          if (!companion) return null;
          return (
            <div
              key={code}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">{companion.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {companion.code}
                </span>
              </div>
              <p className="mt-1 text-sm italic text-muted-foreground">
                {companion.tagline}
              </p>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Ideal Destinations
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {typeInfo.idealDestinations.map((dest) => (
            <span
              key={dest}
              className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {dest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FunStatsSection({ typeInfo }: { typeInfo: TravelerTypeInfo }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <h2 className="text-center text-xl font-semibold">Fun Facts</h2>
      <div className="space-y-4">
        <StatCard label="Rarity" value={typeInfo.rarity} />
        <StatCard label="Packing Style" value={typeInfo.packingStyle} />
        <StatCard label="Travel Red Flag" value={typeInfo.travelRedFlag} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}

function ActionsSection({
  typeInfo,
  onContinue,
}: {
  typeInfo: TravelerTypeInfo;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div>
        <h2 className="text-xl font-semibold">{typeInfo.name}</h2>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          {typeInfo.code}
        </p>
        <p className="mt-2 italic text-muted-foreground">
          &ldquo;{typeInfo.tagline}&rdquo;
        </p>
      </div>
      <Button className="w-full max-w-xs" size="lg" onClick={onContinue}>
        Start Planning Trips
      </Button>
    </div>
  );
}
