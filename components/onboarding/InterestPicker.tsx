"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InterestPickerProps {
  allInterests: string[];
  popularInterests: string[];
  onComplete: (selected: string[]) => void;
  onSkip: () => void;
}

export default function InterestPicker({
  allInterests,
  popularInterests,
  onComplete,
  onSkip,
}: InterestPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const otherInterests = useMemo(
    () => allInterests.filter((i) => !popularInterests.includes(i)),
    [allInterests, popularInterests]
  );

  const filteredInterests = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allInterests.filter((i) => i.toLowerCase().includes(q));
  }, [search, allInterests]);

  function toggle(interest: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }
      return next;
    });
  }

  function remove(interest: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(interest);
      return next;
    });
  }

  const selectedArray = Array.from(selected);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold">What are you into?</h1>
        <p className="mt-1 text-muted-foreground">Tap everything that excites you</p>
      </div>

      {/* Selected pills */}
      {selectedArray.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-3">
          {selectedArray.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => remove(interest)}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
            >
              {interest}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="px-6 pb-4">
        <Input
          placeholder="Search for anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Interest chips */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        {filteredInterests ? (
          <div>
            {filteredInterests.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No interests found for &ldquo;{search}&rdquo;
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredInterests.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    active={selected.has(interest)}
                    onClick={() => toggle(interest)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Popular
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularInterests.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    active={selected.has(interest)}
                    onClick={() => toggle(interest)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                More
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherInterests.map((interest) => (
                  <Chip
                    key={interest}
                    label={interest}
                    active={selected.has(interest)}
                    onClick={() => toggle(interest)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-background px-6 py-4">
        <Button
          className="w-full"
          onClick={() => onComplete(selectedArray)}
        >
          Continue{selectedArray.length > 0 && ` (${selectedArray.length})`}
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="mt-2 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-primary bg-primary/10 text-primary font-medium"
          : "border-border bg-background text-foreground hover:bg-muted"
      }`}
    >
      {active && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {label}
    </button>
  );
}
