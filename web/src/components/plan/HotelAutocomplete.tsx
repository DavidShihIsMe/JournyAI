"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { HOTEL_OPTION_NA, HOTEL_OPTION_OTHER } from "@/lib/demoHotels";
import type { HotelOption } from "@/lib/hotelTypes";
import { INK, INK2, INK3, PAPER, SANS, SERIF } from "@/components/landing/brand";

type Props = {
  destination: string;
  inputStyle: CSSProperties;
  labelCaps: CSSProperties;
};

const MIN_QUERY_LEN = 1;

function filterLocal(hotels: HotelOption[], query: string): HotelOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return hotels;
  const tokens = q.split(/\s+/).filter(Boolean);
  return hotels.filter((h) => {
    const hay = `${h.name} ${h.address ?? ""}`.toLowerCase();
    if (hay.includes(q)) return true;
    return tokens.every((t) => hay.includes(t));
  });
}

export default function HotelAutocomplete({ destination, inputStyle, labelCaps }: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDayTrip, setIsDayTrip] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<HotelOption | null>(null);
  const [catalog, setCatalog] = useState<HotelOption[]>([]);
  const [suggestions, setSuggestions] = useState<HotelOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [source, setSource] = useState<"google" | "fallback" | null>(null);

  const dest = destination.trim();
  const canSearch = dest.length > 0;

  const fetchHotels = useCallback(async (destLabel: string, q: string) => {
    const res = await fetch(
      `/api/hotels?destination=${encodeURIComponent(destLabel)}&q=${encodeURIComponent(q)}`
    );
    const data = (await res.json()) as {
      hotels?: HotelOption[];
      source?: "google" | "fallback";
      message?: string;
    };
    return {
      hotels: data.hotels ?? [],
      source: data.source ?? "fallback",
      message: data.message ?? null,
    };
  }, []);

  useEffect(() => {
    if (isDayTrip || manualMode || !canSearch) {
      setCatalog([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const { hotels, source: src, message } = await fetchHotels(dest, "");
        if (!cancelled) {
          setCatalog(hotels);
          setSource(src);
          if (message) setStatusMessage(message);
        }
      } catch {
        if (!cancelled) setCatalog([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dest, canSearch, isDayTrip, manualMode, fetchHotels]);

  useEffect(() => {
    if (isDayTrip || manualMode) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (!canSearch) {
      setSuggestions([]);
      setOpen(false);
      setStatusMessage("Enter your trip destination above first.");
      return;
    }

    const q = query.trim();
    if (q.length < MIN_QUERY_LEN) {
      setSuggestions(catalog);
      setOpen(false);
      setStatusMessage(
        catalog.length ? "Type to search hotels, or focus the field to see suggestions." : null
      );
      return;
    }

    const local = filterLocal(catalog, q);
    setSuggestions(local);
    setOpen(true);
    setHighlightIndex(local.length ? 0 : -1);

    const timer = setTimeout(() => {
      void (async () => {
        setLoading(true);
        try {
          const { hotels, source: src, message } = await fetchHotels(dest, q);
          setSuggestions(hotels.length ? hotels : local);
          setSource(src);
          setStatusMessage(
            message ??
              (hotels.length || local.length
                ? null
                : "No hotels matched — try fewer words or enter manually below.")
          );
          setOpen(true);
          setHighlightIndex((hotels.length ? hotels : local).length ? 0 : -1);
        } catch {
          setSuggestions(local);
          setOpen(true);
          setStatusMessage(local.length ? null : "Could not load suggestions.");
        } finally {
          setLoading(false);
        }
      })();
    }, 280);

    return () => clearTimeout(timer);
  }, [query, dest, canSearch, isDayTrip, manualMode, catalog, fetchHotels]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function pickHotel(hotel: HotelOption) {
    setSelected(hotel);
    setQuery(hotel.name);
    setOpen(false);
    setHighlightIndex(-1);
  }

  function handleDayTripChange(checked: boolean) {
    setIsDayTrip(checked);
    if (checked) {
      setManualMode(false);
      setOpen(false);
      setSelected(null);
      setQuery("");
    }
  }

  const showPanel = open && !isDayTrip && !manualMode && canSearch;

  return (
    <div ref={rootRef} className="flex flex-col gap-3 max-w-xl">
      <span style={labelCaps}>Where you are staying</span>

      <input
        type="hidden"
        name="stayingHotel"
        value={isDayTrip ? HOTEL_OPTION_NA : manualMode ? HOTEL_OPTION_OTHER : selected?.name ?? ""}
      />
      <input type="hidden" name="hotelPlaceId" value={!isDayTrip && !manualMode ? selected?.placeId ?? "" : ""} />
      {!isDayTrip && !manualMode && selected?.address ? (
        <input type="hidden" name="hotelAddress" value={selected.address} />
      ) : null}

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isDayTrip} onChange={(e) => handleDayTripChange(e.target.checked)} />
        <span style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>N/A — day trip (no overnight hotel)</span>
      </label>

      {!isDayTrip ? (
        <>
          {!manualMode ? (
            <div className="relative flex flex-col gap-1 z-30">
              <label htmlFor={`${listId}-hotel`} style={labelCaps}>
                Search your hotel
              </label>
              <input
                ref={inputRef}
                id={`${listId}-hotel`}
                type="text"
                value={query}
                autoComplete="off"
                role="combobox"
                aria-expanded={showPanel}
                aria-controls={`${listId}-listbox`}
                aria-autocomplete="list"
                aria-activedescendant={
                  highlightIndex >= 0 ? `${listId}-option-${highlightIndex}` : undefined
                }
                disabled={!canSearch}
                required={!isDayTrip && !manualMode}
                placeholder={canSearch ? "Start typing a hotel name…" : "Enter destination first"}
                className="w-full px-3 py-2 outline-none"
                style={inputStyle}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelected(null);
                  if (e.target.value.trim().length >= MIN_QUERY_LEN) setOpen(true);
                }}
                onFocus={() => {
                  if (!canSearch) return;
                  const q = query.trim();
                  setSuggestions(q.length >= MIN_QUERY_LEN ? filterLocal(catalog, q) : catalog);
                  setOpen(true);
                }}
                onKeyDown={(e) => {
                  if (!showPanel || !suggestions.length) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightIndex((i) => (i + 1) % suggestions.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
                  } else if (e.key === "Enter" && highlightIndex >= 0) {
                    e.preventDefault();
                    pickHotel(suggestions[highlightIndex]);
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
              />

              {showPanel ? (
                <ul
                  id={`${listId}-listbox`}
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto shadow-lg"
                  style={{ border: `1px solid ${INK}`, background: PAPER }}
                >
                  {loading ? (
                    <li className="px-3 py-2.5" style={{ fontFamily: SERIF, fontSize: 14, color: INK3 }}>
                      Searching…
                    </li>
                  ) : null}
                  {!loading && suggestions.length === 0 ? (
                    <li className="px-3 py-2.5" style={{ fontFamily: SERIF, fontSize: 14, color: INK2 }}>
                      {statusMessage ?? "No hotels found. Try another spelling or enter manually below."}
                    </li>
                  ) : null}
                  {!loading
                    ? suggestions.map((h, index) => {
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
                                fontFamily: SERIF,
                                fontSize: 15,
                                color: INK,
                                background: active ? `${INK}12` : "transparent",
                                border: "none",
                                borderBottom: `1px solid ${INK3}44`,
                              }}
                              onMouseEnter={() => setHighlightIndex(index)}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => pickHotel(h)}
                            >
                              <div style={{ fontWeight: 600 }}>{h.name}</div>
                              {h.address ? (
                                <div style={{ fontSize: 12, color: INK2, marginTop: 2 }}>{h.address}</div>
                              ) : null}
                              {h.googleVerified ? (
                                <div
                                  style={{
                                    fontFamily: SANS,
                                    fontSize: 9,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: INK3,
                                    marginTop: 4,
                                  }}
                                >
                                  Google Places
                                </div>
                              ) : null}
                            </button>
                          </li>
                        );
                      })
                    : null}
                </ul>
              ) : null}

              {selected ? (
                <p style={{ fontFamily: SERIF, fontSize: 14, color: INK2, margin: 0 }}>
                  Selected: <strong>{selected.name}</strong>
                  {selected.address ? ` · ${selected.address}` : ""}
                </p>
              ) : null}

              <p style={{ fontFamily: SERIF, fontSize: 14, color: INK3, margin: 0 }}>
                {source === "google"
                  ? "Suggestions from Google Maps as you type."
                  : "Built-in suggestions (enable Places API (New) on your Google key for live hotel search)."}
              </p>
              {statusMessage && !showPanel ? (
                <p style={{ fontFamily: SERIF, fontSize: 13, color: INK2, margin: 0 }}>{statusMessage}</p>
              ) : null}

              <button
                type="button"
                className="self-start underline-offset-2 hover:underline"
                style={{
                  fontFamily: SERIF,
                  fontSize: 14,
                  color: INK2,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setManualMode(true);
                  setOpen(false);
                  setSelected(null);
                }}
              >
                Hotel not listed? Enter name and address manually
              </button>
            </div>
          ) : (
            <label className="flex flex-col gap-2">
              <span style={labelCaps}>Hotel name &amp; address</span>
              <textarea
                name="hotelAddress"
                rows={3}
                required
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Hotel name, street, city"
                className="w-full px-3 py-2 outline-none"
                style={inputStyle}
              />
              <button
                type="button"
                className="self-start underline-offset-2 hover:underline"
                style={{
                  fontFamily: SERIF,
                  fontSize: 14,
                  color: INK2,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setManualMode(false);
                  setManualAddress("");
                }}
              >
                Search hotels instead
              </button>
            </label>
          )}
        </>
      ) : null}
    </div>
  );
}
