"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INTEREST_OPTIONS } from "@lib/constants/interests";
import ProgressBar from "@/components/ProgressBar";

const STORAGE_KEY = "journy_interests";

export default function InterestsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const arr: string[] = JSON.parse(raw);
      setSelected(new Set(arr));
    } catch {
      // ignore
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INTEREST_OPTIONS;
    return INTEREST_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(q)
    );
  }, [query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function persistAndGo() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(selected))
      );
    }
    router.push("/type-reveal");
  }

  const count = selected.size;
  const hasSelection = count > 0;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <div className="w-full px-5 sm:px-8 pt-6">
        <div className="max-w-[700px] mx-auto">
          <ProgressBar progress={75} />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center px-5 sm:px-8 py-10 sm:py-14">
        <div className="w-full max-w-[700px] flex flex-col">
          <h1 className="font-display font-bold text-[28px] sm:text-[32px] text-[#111827] text-center leading-tight">
            What are you into?
          </h1>
          <p className="mt-3 font-body text-base text-[#4B5563] text-center">
            Pick as many as you want, you can always change these later.
          </p>

          <div className="mt-8 w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search interests..."
              aria-label="Search interests"
              className="
                w-full h-12 rounded-[22px] bg-[#F3F4F6] px-5
                font-body text-sm text-neutral-900
                placeholder:text-[#9CA3AF]
                border border-transparent
                focus:outline-none focus:border-primary focus:bg-white
                transition-colors
              "
            />
          </div>

          <div className="mt-3 flex justify-end">
            <span className="font-body text-sm text-[#111827]">
              Selected: <span className="font-semibold">{count}</span>
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {filtered.length === 0 ? (
              <p className="w-full text-center font-body text-sm text-[#9CA3AF] py-8">
                No interests match &ldquo;{query}&rdquo;
              </p>
            ) : (
              filtered.map((option) => {
                const isSelected = selected.has(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggle(option.id)}
                    aria-pressed={isSelected}
                    className={`
                      rounded-[20px] px-4 py-2
                      font-body text-sm font-medium
                      border transition-colors duration-150
                      ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-[#E5E7EB] text-[#1F2937] hover:border-primary hover:text-primary"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={persistAndGo}
              disabled={!hasSelection}
              className={`
                h-[52px] w-full sm:w-[400px] rounded-[12px]
                font-body font-semibold text-base
                transition-colors
                ${
                  hasSelection
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                }
              `}
            >
              See Your Traveler Type
            </button>
            <Link
              href="/type-reveal"
              className="font-body text-sm text-[#9CA3AF] hover:text-neutral-600 transition-colors"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
