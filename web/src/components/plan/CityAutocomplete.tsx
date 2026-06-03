"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";

// Tuple shape from web/public/cities.json (built by scripts/build-cities.mjs)
// [name, asciiNameIfDifferent, countryCode, admin1Code, population]
type CityTuple = [string, string, string, string, number];

interface CitiesData {
  countries: Record<string, string>;
  cities: CityTuple[];
}

// Module-level cache — one fetch per page session, shared across re-mounts
let cache: CitiesData | null = null;
let pending: Promise<CitiesData> | null = null;

async function loadCities(): Promise<CitiesData> {
  if (cache) return cache;
  if (pending) return pending;
  pending = fetch("/cities.json", { cache: "force-cache" })
    .then((r) => {
      if (!r.ok) throw new Error(`/cities.json HTTP ${r.status}`);
      return r.json() as Promise<CitiesData>;
    })
    .then((data) => {
      cache = data;
      pending = null;
      return data;
    })
    .catch((err) => {
      pending = null;
      throw err;
    });
  return pending;
}

function normalize(s: string): string {
  // Lower-case + strip diacritics so "Sao" matches "São"
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface Match {
  name: string;
  ascii: string;
  cc: string;
  admin1: string;
  pop: number;
  score: number; // lower is better
}

function search(data: CitiesData, query: string, max = 8): Match[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  const exactPrefix: Match[] = [];
  const wordPrefix: Match[] = [];
  const substring: Match[] = [];

  for (const c of data.cities) {
    const name = c[0];
    const ascii = c[1] || name;
    const cc = c[2];
    const admin1 = c[3];
    const pop = c[4];
    const lcName = normalize(name);
    const lcAscii = normalize(ascii);

    let bucket: Match[] | null = null;
    if (lcName.startsWith(q) || lcAscii.startsWith(q)) {
      bucket = exactPrefix;
    } else if (
      lcName.split(/\s+/).some((w) => w.startsWith(q)) ||
      lcAscii.split(/\s+/).some((w) => w.startsWith(q))
    ) {
      bucket = wordPrefix;
    } else if (lcName.includes(q) || lcAscii.includes(q)) {
      bucket = substring;
    }
    if (!bucket) continue;
    bucket.push({ name, ascii, cc, admin1, pop, score: 0 });

    // Early exit: enough exact-prefix matches (already sorted by population)
    if (exactPrefix.length >= max * 2 && bucket === exactPrefix) break;
  }

  return [...exactPrefix, ...wordPrefix, ...substring].slice(0, max);
}

interface Props {
  value: string;
  placeId: string;
  onChange: (next: { value: string; placeId: string }) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function CityAutocomplete({
  value,
  placeId,
  onChange,
  placeholder = "Start typing — e.g. Tokyo, Paris, Brooklyn",
  autoFocus = false,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipNextSearchRef = useRef(false);

  const [data, setData] = useState<CitiesData | null>(cache);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [results, setResults] = useState<Match[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const ensureLoaded = useCallback(async () => {
    if (cache || loadError) return cache;
    try {
      const d = await loadCities();
      setData(d);
      return d;
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load cities");
      return null;
    }
  }, [loadError]);

  // Run client-side search whenever value changes (and data is loaded)
  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    if (!data) {
      setResults([]);
      setOpen(false);
      return;
    }
    const matches = search(data, value);
    setResults(matches);
    setOpen(matches.length > 0);
    setHighlightIndex(matches.length > 0 ? 0 : -1);
  }, [value, data]);

  // Click outside closes
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // Build a "needs disambiguation" set for the current result page
  const ambiguous = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of results) {
      const key = `${r.name}|${r.cc}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [results]);

  const pick = useCallback(
    (m: Match) => {
      skipNextSearchRef.current = true;
      // Encode a synthetic id for downstream use (GeoNames format hint)
      onChange({
        value: m.name,
        placeId: `geo:${m.cc}:${m.admin1}:${normalize(m.name).replace(/\s+/g, "-")}`,
      });
      setOpen(false);
      setHighlightIndex(-1);
    },
    [onChange]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      if (!open && results.length > 0) {
        setOpen(true);
        e.preventDefault();
        return;
      }
      if (!results.length) return;
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      if (!results.length) return;
      e.preventDefault();
      setHighlightIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && open && highlightIndex >= 0) {
      e.preventDefault();
      pick(results[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function describe(m: Match): string {
    const country = data?.countries[m.cc] ?? m.cc;
    const ambiguousKey = `${m.name}|${m.cc}`;
    const showAdmin = (ambiguous.get(ambiguousKey) ?? 0) > 1 && m.admin1.length > 0;
    return showAdmin ? `${m.admin1} · ${country}` : country;
  }

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <span
        style={{
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK3,
        }}
      >
        Destination
      </span>
      <input
        ref={inputRef}
        id={`${listId}-input`}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={`${listId}-listbox`}
        aria-autocomplete="list"
        aria-activedescendant={
          highlightIndex >= 0 ? `${listId}-option-${highlightIndex}` : undefined
        }
        autoFocus={autoFocus}
        value={value}
        placeholder={placeholder}
        onFocus={() => {
          void ensureLoaded();
          if (results.length > 0) setOpen(true);
        }}
        onChange={(e) => {
          onChange({
            value: e.target.value,
            placeId: placeId && e.target.value ? placeId : "",
          });
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 outline-none"
        style={{
          border: `1px solid ${INK3}`,
          borderRadius: 0,
          background: PAPER2,
          color: INK,
          fontFamily: SERIF,
          fontSize: 16,
        }}
      />

      {open && results.length > 0 ? (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 z-50 max-h-72 overflow-y-auto shadow-lg"
          style={{ top: "100%", marginTop: 4, border: `1px solid ${INK}`, background: PAPER }}
        >
          {results.map((m, index) => {
            const active = index === highlightIndex;
            return (
              <li key={`${m.name}-${m.cc}-${m.admin1}-${index}`} role="presentation">
                <button
                  type="button"
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={active}
                  className="w-full text-left px-3 py-2.5 cursor-pointer"
                  style={{
                    background: active ? `${INK}12` : "transparent",
                    border: "none",
                    borderBottom: `1px solid ${INK3}44`,
                  }}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(m)}
                >
                  <div style={{ fontFamily: SERIF, fontSize: 15, color: INK, fontWeight: 600 }}>
                    {m.name}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 13, color: INK2, marginTop: 2 }}>
                    {describe(m)}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {loadError ? (
        <span style={{ fontFamily: SERIF, fontSize: 12, color: INK3 }}>
          City suggestions unavailable — type freely.
        </span>
      ) : null}
    </div>
  );
}
