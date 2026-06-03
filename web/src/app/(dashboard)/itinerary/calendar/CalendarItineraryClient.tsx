"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CalendarBlockModal from "@/components/itinerary/CalendarBlockModal";
import WeekCalendarGrid from "@/components/itinerary/WeekCalendarGrid";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { itinerarySlotKey } from "@/lib/itineraryScheduleDisplay";
import {
  buildCalendarColumns,
  setBlockStartTimeOnly,
  updateTravelRow,
} from "@/lib/weekCalendarLayout";
import { supabase } from "@/lib/supabase";
import {
  normalizeItineraryDays,
  type GeneratedItinerary,
  type GeneratedItineraryDay,
  type ItineraryVenueChoice,
} from "@/lib/tripTypes";
import { getTrip, updateTripData, updateTripUiState } from "@lib/services/trips";

export default function CalendarItineraryClient() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [venueSelections, setVenueSelections] = useState<Record<string, string>>({});
  const [travelOverrides, setTravelOverrides] = useState<Record<string, number>>({});
  const [startDateIso, setStartDateIso] = useState<string | undefined>();
  const [modalDayIndex, setModalDayIndex] = useState<number | null>(null);
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    hydratedRef.current = false;
    if (!tripId) {
      setItinerary(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const { data, error } = await getTrip(supabase, tripId);
      if (cancelled) return;
      if (error || !data) {
        setItinerary(null);
        return;
      }
      const raw = (data.data ?? {}) as GeneratedItinerary;
      setItinerary({ ...raw, days: normalizeItineraryDays(raw.days) });
      const ui = (data.ui_state ?? {}) as {
        venueSelections?: Record<string, string>;
        travelOverrides?: Record<string, number>;
      };
      setVenueSelections(ui.venueSelections ?? {});
      setTravelOverrides(ui.travelOverrides ?? {});
      setStartDateIso(data.start_date ?? undefined);
      hydratedRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  useEffect(() => {
    if (!hydratedRef.current || !tripId) return;
    const handle = setTimeout(() => {
      void updateTripUiState(supabase, tripId, { venueSelections, travelOverrides });
    }, 500);
    return () => clearTimeout(handle);
  }, [venueSelections, travelOverrides, tripId]);

  useEffect(() => {
    if (!hydratedRef.current || !itinerary || !tripId) return;
    const handle = setTimeout(() => {
      void updateTripData(supabase, tripId, itinerary);
    }, 500);
    return () => clearTimeout(handle);
  }, [itinerary, tripId]);

  const columns = useMemo(() => {
    if (!itinerary) return [];
    return buildCalendarColumns(itinerary, venueSelections, travelOverrides, startDateIso);
  }, [itinerary, venueSelections, travelOverrides, startDateIso]);

  const handleVenueSelect = useCallback((day: GeneratedItineraryDay, activityIndex: number, choice: ItineraryVenueChoice) => {
    const slot = itinerarySlotKey(day.day, activityIndex);
    setVenueSelections((prev) => ({ ...prev, [slot]: choice.id }));
    setTravelOverrides((o) => {
      const next = { ...o };
      const prevIndex = activityIndex - 1;
      if (prevIndex >= 0) {
        const prevRow = day.items[prevIndex];
        if (prevRow?.kind === "travel" && choice.walkFromPreviousMinutes != null) {
          next[itinerarySlotKey(day.day, prevIndex)] = Math.round(choice.walkFromPreviousMinutes);
        }
      }
      const travelAfterIndex = activityIndex + 1;
      const afterRow = day.items[travelAfterIndex];
      if (afterRow?.kind === "travel" && choice.walkToFollowingStopMinutes != null) {
        next[itinerarySlotKey(day.day, travelAfterIndex)] = Math.round(choice.walkToFollowingStopMinutes);
      }
      return next;
    });
  }, []);

  const handleBlockMove = useCallback(
    (slotKey: string, newStartMinutes: number) => {
      if (!itinerary) return;
      const next = setBlockStartTimeOnly(
        itinerary,
        slotKey,
        newStartMinutes,
        venueSelections,
        travelOverrides
      );
      setItinerary(next);
    },
    [itinerary, venueSelections, travelOverrides]
  );

  const handleTransportChange = useCallback(
    (mode: string, durationMinutes: number) => {
      if (!itinerary || modalDayIndex == null || modalRowIndex == null) return;
      const day = itinerary.days[modalDayIndex];
      if (!day) return;
      const slotKey = itinerarySlotKey(day.day, modalRowIndex);
      setTravelOverrides((prev) => ({ ...prev, [slotKey]: durationMinutes }));
      const next = {
        ...itinerary,
        days: updateTravelRow(itinerary.days, day.day, modalRowIndex, {
          mode,
          durationMinutes,
        }),
      };
      setItinerary(next);
    },
    [itinerary, modalDayIndex, modalRowIndex]
  );

  const modalDay = modalDayIndex != null ? itinerary?.days[modalDayIndex] : null;
  const modalRow = modalRowIndex != null ? modalDay?.items[modalRowIndex] : null;

  const listHref = tripId
    ? `/itinerary?tripId=${encodeURIComponent(tripId)}`
    : "/itinerary";

  if (!itinerary) {
    return (
      <div className="journy-root journy-paper-texture" style={{ background: PAPER, border: `1px solid ${INK}`, padding: 24 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: 38, color: INK }}>Calendar</h1>
        <p style={{ marginTop: 8, fontFamily: SERIF, fontSize: 16, color: INK2 }}>No itinerary to show.</p>
        <Link href="/plan" style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: INK3 }}>
          Plan a trip &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="journy-root journy-paper-texture" style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}>
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Personal Volume · Calendar
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.05 }}>{itinerary.title}</h1>
        <p style={{ marginTop: 8, fontFamily: SERIF, fontSize: 16, color: INK2 }}>
          {itinerary.destination} · {itinerary.travelDates}
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            href={listHref}
            className="inline-flex items-center px-4 py-2"
            style={{
              border: `1.5px solid ${INK}`,
              background: INK,
              color: PAPER,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            List view
          </Link>
          <Link href="/plan" style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>
            Plan another trip &rarr;
          </Link>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <p style={{ fontFamily: SERIF, fontSize: 14, color: INK3, marginBottom: 16, maxWidth: 720 }}>
          Seven-day week grid with times on the left. Drag blocks to reschedule; tap activities for venue cards or
          travel legs to change how you get there. Changes sync with list view automatically.
        </p>
        <WeekCalendarGrid
          columns={columns}
          itinerary={itinerary}
          venueSelections={venueSelections}
          travelOverrides={travelOverrides}
          onBlockClick={(dayIndex, rowIndex) => {
            setModalDayIndex(dayIndex);
            setModalRowIndex(rowIndex);
          }}
          onBlockMove={handleBlockMove}
        />
      </div>

      <CalendarBlockModal
        open={modalRow != null && modalDay != null}
        onClose={() => {
          setModalDayIndex(null);
          setModalRowIndex(null);
        }}
        row={modalRow ?? null}
        day={modalDay ?? null}
        rowIndex={modalRowIndex ?? 0}
        destination={itinerary.destination}
        venueSelections={venueSelections}
        travelOverrides={travelOverrides}
        onVenueSelect={(choice) => {
          if (modalDay && modalRowIndex != null) handleVenueSelect(modalDay, modalRowIndex, choice);
        }}
        onTransportChange={handleTransportChange}
      />
    </div>
  );
}
