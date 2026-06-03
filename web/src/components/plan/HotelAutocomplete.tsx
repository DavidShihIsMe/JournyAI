"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { HOTEL_OPTION_NA, HOTEL_OPTION_OTHER } from "@/lib/demoHotels";
import type { HotelOption } from "@/lib/hotelTypes";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";

type Mode = "search" | "manual" | "day_trip";

interface AddressParts {
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressRegion: string;
  addressCountry: string;
  addressPostal: string;
}

interface Props {
  destination: string;
  destinationPlaceId: string;
  stayingHotel: string;
  hotelAddress: string;
  hotelPlaceId: string;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressRegion: string;
  addressCountry: string;
  addressPostal: string;
  addressLocationEdited: boolean;
  onChange: (
    next: Partial<{
      stayingHotel: string;
      hotelAddress: string;
      hotelPlaceId: string;
      addressLocationEdited: boolean;
    } & AddressParts>
  ) => void;
}

function deriveInitialMode(stayingHotel: string): Mode {
  if (stayingHotel === HOTEL_OPTION_NA) return "day_trip";
  if (stayingHotel === HOTEL_OPTION_OTHER) return "manual";
  return "search";
}

// Same cache the city autocomplete uses (separate runtime but same /cities.json HTTP cache)
interface CitiesData {
  countries: Record<string, string>;
  cities: [string, string, string, string, number][];
}
let citiesCache: CitiesData | null = null;
let citiesPending: Promise<CitiesData> | null = null;
async function loadCitiesData(): Promise<CitiesData | null> {
  if (citiesCache) return citiesCache;
  if (citiesPending) return citiesPending;
  citiesPending = fetch("/cities.json", { cache: "force-cache" })
    .then((r) => (r.ok ? (r.json() as Promise<CitiesData>) : Promise.reject()))
    .then((d) => {
      citiesCache = d;
      citiesPending = null;
      return d;
    })
    .catch(() => {
      citiesPending = null;
      return null as unknown as CitiesData;
    });
  return citiesPending;
}

function parseCityPlaceId(placeId: string): { cc: string; admin1: string } | null {
  if (!placeId.startsWith("geo:")) return null;
  const [, cc, admin1] = placeId.split(":");
  if (!cc) return null;
  return { cc, admin1: admin1 || "" };
}

export default function HotelAutocomplete({
  destination,
  destinationPlaceId,
  stayingHotel,
  hotelAddress,
  hotelPlaceId,
  addressLine1,
  addressLine2,
  addressCity,
  addressRegion,
  addressCountry,
  addressPostal,
  addressLocationEdited,
  onChange,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipNextFetchRef = useRef(false);

  const [mode, setMode] = useState<Mode>(deriveInitialMode(stayingHotel));
  const [query, setQuery] = useState(
    mode === "search" && stayingHotel && stayingHotel !== HOTEL_OPTION_OTHER ? stayingHotel : ""
  );
  const [selected, setSelected] = useState<HotelOption | null>(
    mode === "search" && stayingHotel && stayingHotel !== HOTEL_OPTION_OTHER && hotelPlaceId
      ? { name: stayingHotel, address: hotelAddress, placeId: hotelPlaceId, googleVerified: true }
      : null
  );

  const [suggestions, setSuggestions] = useState<HotelOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"google" | "unavailable" | "empty" | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const dest = destination.trim();
  const canSearch = dest.length > 0;

  // --- Day trip / manual sentinel persistence -------------------------------
  // Push the mode sentinel up when day-trip toggles. (Search/manual address
  // updates are pushed via their own per-field handlers below.)
  useEffect(() => {
    if (mode === "day_trip" && stayingHotel !== HOTEL_OPTION_NA) {
      onChange({
        stayingHotel: HOTEL_OPTION_NA,
        hotelAddress: "",
        hotelPlaceId: "",
      });
    }
    if (mode === "manual" && stayingHotel !== HOTEL_OPTION_OTHER) {
      onChange({ stayingHotel: HOTEL_OPTION_OTHER, hotelPlaceId: "" });
    }
    if (mode === "search" && (stayingHotel === HOTEL_OPTION_OTHER || stayingHotel === HOTEL_OPTION_NA)) {
      // Leaving manual or day-trip mode without a pick yet — clear the sentinel.
      onChange({ stayingHotel: selected?.name ?? query.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // --- Search-mode pick handling --------------------------------------------
  useEffect(() => {
    if (mode !== "search") return;
    if (selected) {
      onChange({
        stayingHotel: selected.name,
        hotelAddress: selected.address ?? "",
        hotelPlaceId: selected.placeId ?? "",
      });
    } else {
      onChange({
        stayingHotel: query.trim(),
        hotelAddress: "",
        hotelPlaceId: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, query]);

  // --- Manual-mode pre-fill from step 1 -------------------------------------
  // City + country track the destination unless the user has manually edited them.
  // The addressLocationEdited flag (PlanContext) is the user-touched signal.
  useEffect(() => {
    if (mode !== "manual") return;
    if (addressLocationEdited) return;
    const dest = destination.trim();
    if (!dest) return;

    const patch: Partial<AddressParts> = {};
    if (addressCity !== dest) patch.addressCity = dest;

    const parsed = parseCityPlaceId(destinationPlaceId);
    if (parsed) {
      const cached = citiesCache;
      if (cached) {
        const country = cached.countries[parsed.cc] ?? parsed.cc;
        if (addressCountry !== country) patch.addressCountry = country;
      } else {
        void loadCitiesData().then((data) => {
          if (data) {
            const country = data.countries[parsed.cc] ?? parsed.cc;
            // Only patch country here — city is handled synchronously above.
            onChange({ addressCountry: country });
          }
        });
      }
    }

    if (Object.keys(patch).length > 0) onChange(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, destination, destinationPlaceId, addressLocationEdited]);

  // --- Debounced hotel suggestions search -----------------------------------
  useEffect(() => {
    if (mode !== "search" || !canSearch) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setStatusMessage(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/hotels?destination=${encodeURIComponent(dest)}&q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        const data = (await res.json()) as {
          hotels?: HotelOption[];
          source?: "google" | "unavailable" | "empty";
          message?: string;
        };
        if (controller.signal.aborted) return;
        const list = data.hotels ?? [];
        setSuggestions(list);
        setSource(data.source ?? "unavailable");
        setStatusMessage(data.message ?? null);
        setOpen(list.length > 0);
        setHighlightIndex(list.length > 0 ? 0 : -1);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 80);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, dest, canSearch, mode]);

  // --- Click outside closes dropdown ----------------------------------------
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const pick = useCallback((hotel: HotelOption) => {
    skipNextFetchRef.current = true;
    setSelected(hotel);
    setQuery(hotel.name);
    setOpen(false);
    setHighlightIndex(-1);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      pick(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={mode === "day_trip"}
          onChange={(e) => setMode(e.target.checked ? "day_trip" : "search")}
          style={{ accentColor: INK }}
        />
        <span style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>
          N/A — day trip (no overnight hotel)
        </span>
      </label>

      {mode === "day_trip" ? null : mode === "manual" ? (
        <ManualAddressForm
          hotelName={stayingHotel === HOTEL_OPTION_OTHER ? "" : stayingHotel}
          onHotelNameChange={(v) => onChange({ stayingHotel: HOTEL_OPTION_OTHER, addressLine1, hotelPlaceId: "" })}
          addressLine1={addressLine1}
          addressLine2={addressLine2}
          addressCity={addressCity}
          addressRegion={addressRegion}
          addressCountry={addressCountry}
          addressPostal={addressPostal}
          onPartChange={(patch) => onChange(patch)}
          onLocationEditedChange={() => {
            if (!addressLocationEdited) onChange({ addressLocationEdited: true });
          }}
          onSwitchToSearch={() => setMode("search")}
        />
      ) : (
        <div className="relative flex flex-col gap-1">
          <label
            htmlFor={`${listId}-hotel`}
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            Search your hotel
          </label>
          <input
            ref={inputRef}
            id={`${listId}-hotel`}
            type="text"
            value={query}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${listId}-listbox`}
            aria-autocomplete="list"
            aria-activedescendant={
              highlightIndex >= 0 ? `${listId}-option-${highlightIndex}` : undefined
            }
            disabled={!canSearch}
            placeholder={canSearch ? "Start typing a hotel name…" : "Enter destination first"}
            className="w-full px-3 py-2 outline-none"
            style={{
              border: `1px solid ${INK3}`,
              borderRadius: 0,
              background: PAPER2,
              color: INK,
              fontFamily: SERIF,
              fontSize: 15,
            }}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              setSelected(null);
              if (next.trim().length >= 2) setOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />

          {open && (loading || suggestions.length > 0) ? (
            <ul
              id={`${listId}-listbox`}
              role="listbox"
              className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto shadow-lg"
              style={{ top: "100%", border: `1px solid ${INK}`, background: PAPER }}
            >
              {loading ? (
                <li
                  className="px-3 py-2.5"
                  style={{ fontFamily: SERIF, fontSize: 14, color: INK3 }}
                >
                  Searching…
                </li>
              ) : (
                suggestions.map((h, index) => {
                  const active = index === highlightIndex;
                  return (
                    <li key={h.placeId ?? `${h.name}-${index}`} role="presentation">
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
                        onClick={() => pick(h)}
                      >
                        <div style={{ fontFamily: SERIF, fontSize: 15, color: INK, fontWeight: 600 }}>
                          {h.name}
                        </div>
                        {h.address ? (
                          <div style={{ fontFamily: SERIF, fontSize: 13, color: INK2, marginTop: 2 }}>
                            {h.address}
                          </div>
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          ) : null}

          {selected ? (
            <p style={{ fontFamily: SERIF, fontSize: 14, color: INK2, margin: 0 }}>
              Selected: <strong>{selected.name}</strong>
              {selected.address ? ` · ${selected.address}` : ""}
            </p>
          ) : null}

          {source === "unavailable" && statusMessage ? (
            <p
              className="px-3 py-2"
              style={{
                fontFamily: SERIF,
                fontSize: 13,
                color: INK2,
                margin: 0,
                border: `1px solid ${INK3}`,
                background: `${PAPER}99`,
              }}
            >
              {statusMessage}
            </p>
          ) : null}

          <button
            type="button"
            className="self-start"
            onClick={() => setMode("manual")}
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
              marginTop: 4,
            }}
          >
            Hotel not listed? Enter address manually
          </button>
        </div>
      )}
    </div>
  );
}

function ManualAddressForm({
  hotelName,
  onHotelNameChange,
  addressLine1,
  addressLine2,
  addressCity,
  addressRegion,
  addressCountry,
  addressPostal,
  onPartChange,
  onLocationEditedChange,
  onSwitchToSearch,
}: {
  hotelName: string;
  onHotelNameChange: (v: string) => void;
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressRegion: string;
  addressCountry: string;
  addressPostal: string;
  onPartChange: (patch: Partial<AddressParts & { stayingHotel: string }>) => void;
  onLocationEditedChange: () => void;
  onSwitchToSearch: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <SubField
        label="Hotel / place name"
        placeholder="e.g. Park Hyatt Tokyo, or your Airbnb nickname"
        value={hotelName}
        onChange={(v) => onPartChange({ stayingHotel: v || HOTEL_OPTION_OTHER })}
      />
      <SubField
        label="Address line 1"
        placeholder="Street and number"
        value={addressLine1}
        onChange={(v) => onPartChange({ addressLine1: v })}
      />
      <SubField
        label="Address line 2 (optional)"
        placeholder="Apt, suite, floor"
        value={addressLine2}
        onChange={(v) => onPartChange({ addressLine2: v })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SubField
          label="City"
          placeholder="Pre-filled from your destination"
          value={addressCity}
          onChange={(v) => {
            onPartChange({ addressCity: v });
            onLocationEditedChange();
          }}
        />
        <SubField
          label="State / region"
          placeholder="Optional"
          value={addressRegion}
          onChange={(v) => onPartChange({ addressRegion: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SubField
          label="Country"
          placeholder="Pre-filled from your destination"
          value={addressCountry}
          onChange={(v) => {
            onPartChange({ addressCountry: v });
            onLocationEditedChange();
          }}
        />
        <SubField
          label="Postal code"
          placeholder="Optional"
          value={addressPostal}
          onChange={(v) => onPartChange({ addressPostal: v })}
        />
      </div>
      <button
        type="button"
        className="self-start"
        onClick={onSwitchToSearch}
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
          marginTop: 4,
        }}
      >
        ← Search a listed hotel instead
      </button>
    </div>
  );
}

function SubField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
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
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 outline-none"
        style={{
          border: `1px solid ${INK3}`,
          borderRadius: 0,
          background: PAPER2,
          color: INK,
          fontFamily: SERIF,
          fontSize: 15,
        }}
      />
    </label>
  );
}
