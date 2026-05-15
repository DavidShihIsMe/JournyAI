"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INK, INK2, INK3, OXBLOOD, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { HOTEL_OPTION_NA, HOTEL_OPTION_OTHER, hotelsForDestination } from "@/lib/demoHotels";
import { RESULT_STORAGE_KEY, TRIP_META_STORAGE_KEY } from "@/lib/tripStorageKeys";
import { normalizeItineraryDays, type GeneratedItinerary, type MustHaveCard } from "@/lib/tripTypes";

interface MustHaveRow extends MustHaveCard {
  id: string;
}

const TRANSPORT_OTHER = "other";

const TRIP_PURPOSE_OPTIONS: { value: string; label: string }[] = [
  { value: "vacation", label: "Vacation / leisure" },
  { value: "fun", label: "Just for fun" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family_visit", label: "Visiting family" },
  { value: "friends_getaway", label: "Friends getaway" },
  { value: "celebration", label: "Birthday or celebration" },
  { value: "anniversary", label: "Anniversary trip" },
  { value: "solo", label: "Solo trip" },
  { value: "work_bleisure", label: "Work + leisure" },
  { value: "bucket_list", label: "Bucket-list adventure" },
  { value: "cultural_deep_dive", label: "Culture & learning focus" },
];

const FLIGHT_NOT_BOOKED = "not_booked";
const FLIGHT_BOOKED = "booked";
const FLIGHT_GROUND = "ground_travel";

const GROUND_TRAVEL_OTHER = "other";
const GROUND_TRAVEL_OPTIONS: { value: string; label: string }[] = [
  { value: "driving", label: "Driving" },
  { value: "train", label: "Train" },
  { value: "bus", label: "Bus" },
  { value: GROUND_TRAVEL_OTHER, label: "Other" },
];

const TRANSPORT_OPTIONS: { value: string; label: string }[] = [
  { value: "car", label: "Car (rental or own)" },
  { value: "public_transit", label: "Public transportation" },
  { value: "train", label: "Train" },
  { value: "walk", label: "Walk" },
  { value: "bike", label: "Bike" },
  { value: "rideshare", label: "Rideshare / taxi" },
  { value: "mixed", label: "Mixed — whatever fits each day" },
  { value: TRANSPORT_OTHER, label: "Other" },
];

function emptyMustHave(): MustHaveRow {
  return {
    id: crypto.randomUUID(),
    timeBlock: "",
    activity: "",
    where: "",
    details: "",
  };
}

export default function PlanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinationInput, setDestinationInput] = useState("");
  const [stayingHotel, setStayingHotel] = useState<string>(HOTEL_OPTION_NA);
  const [preferredTransport, setPreferredTransport] = useState<string>("public_transit");
  const [tripPurpose, setTripPurpose] = useState<string>("vacation");
  const [flightBookingStatus, setFlightBookingStatus] = useState<string>(FLIGHT_NOT_BOOKED);
  const [flightNumberInput, setFlightNumberInput] = useState("");
  const [flightAirlineInput, setFlightAirlineInput] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightLookupStatus, setFlightLookupStatus] = useState<"idle" | "loading" | "found" | "not_found" | "error">("idle");
  const [resolvedFlight, setResolvedFlight] = useState<{
    origin: string;
    destination: string;
    departureScheduled: string;
    arrivalScheduled: string;
    airline: string;
  } | null>(null);
  const [groundTravelMode, setGroundTravelMode] = useState<string>("train");
  const [mustHaves, setMustHaves] = useState<MustHaveRow[]>([emptyMustHave()]);

  const hotelOptions = useMemo(() => hotelsForDestination(destinationInput), [destinationInput]);

  useEffect(() => {
    if (flightBookingStatus !== FLIGHT_BOOKED) return;
    if (!flightDate || !flightNumberInput.trim()) return;

    setFlightLookupStatus("loading");
    setResolvedFlight(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/flight-lookup?flightNumber=${encodeURIComponent(flightNumberInput.trim())}&date=${flightDate}`
        );
        const data = await res.json() as { found: boolean; origin?: string; destination?: string; departureScheduled?: string; arrivalScheduled?: string; airline?: string };
        if (data.found) {
          setResolvedFlight({
            origin: data.origin ?? "",
            destination: data.destination ?? "",
            departureScheduled: data.departureScheduled ?? "",
            arrivalScheduled: data.arrivalScheduled ?? "",
            airline: data.airline ?? "",
          });
          setFlightLookupStatus("found");
        } else {
          setFlightLookupStatus("not_found");
        }
      } catch {
        setFlightLookupStatus("error");
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [flightDate, flightNumberInput, flightBookingStatus]);

  function updateMustHave(id: string, patch: Partial<MustHaveCard>) {
    setMustHaves((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addMustHave() {
    setMustHaves((rows) => [...rows, emptyMustHave()]);
  }

  function removeMustHave(id: string) {
    setMustHaves((rows) => (rows.length <= 1 ? rows : rows.filter((r) => r.id !== id)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");
    const destination = String(formData.get("destination") ?? "").trim();
    const partySize = Math.max(1, Number(formData.get("partySize") ?? 1) || 1);
    const tripParty = String(formData.get("tripParty") ?? "friends_and_family") as
      | "friends"
      | "family"
      | "friends_and_family"
      | "myself";
    const accessibility = formData.get("accessibility") === "on";

    const cleanedMustHaves: MustHaveCard[] = mustHaves
      .map(({ timeBlock, activity, where, details }) => ({
        timeBlock: timeBlock.trim(),
        activity: activity.trim(),
        where: where.trim(),
        details: details.trim(),
      }))
      .filter((c) => c.timeBlock || c.activity || c.where || c.details);

    const hotelAddress = String(formData.get("hotelAddress") ?? "").trim();
    const staying = String(formData.get("stayingHotel") ?? HOTEL_OPTION_NA);
    const preferredTransportValue = String(formData.get("preferredTransport") ?? "public_transit");
    const transportOther =
      preferredTransportValue === TRANSPORT_OTHER
        ? String(formData.get("transportOther") ?? "").trim()
        : "";

    const flightBookingStatusValue = String(formData.get("flightBookingStatus") ?? FLIGHT_NOT_BOOKED);
    const flightPreferencesText = String(formData.get("flightPreferencesText") ?? "").trim();
    const flightNumber = String(formData.get("flightNumber") ?? "").trim();
    const flightAirline = String(formData.get("flightAirline") ?? "").trim();
    const groundTravelModeValue = String(formData.get("groundTravelMode") ?? "train");
    const groundTravelOther =
      groundTravelModeValue === GROUND_TRAVEL_OTHER
        ? String(formData.get("groundTravelOther") ?? "").trim()
        : "";
    const groundTravelDuration = String(formData.get("groundTravelDuration") ?? "").trim();
    const groundTravelDeparture = String(formData.get("groundTravelDeparture") ?? "").trim();

    const payload = {
      destination,
      startDate,
      endDate,
      tripPurpose: String(formData.get("tripPurpose") ?? "vacation"),
      flightBookingStatus: flightBookingStatusValue,
      flightPreferencesText:
        flightBookingStatusValue === FLIGHT_NOT_BOOKED ? flightPreferencesText : "",
      flightNumber: flightBookingStatusValue === FLIGHT_BOOKED ? flightNumber : "",
      flightAirline: flightBookingStatusValue === FLIGHT_BOOKED ? flightAirline : "",
      flightDate: flightBookingStatusValue === FLIGHT_BOOKED ? flightDate : "",
      flightDepartureTime: flightBookingStatusValue === FLIGHT_BOOKED ? (resolvedFlight?.departureScheduled ?? "") : "",
      flightArrivalTime: flightBookingStatusValue === FLIGHT_BOOKED ? (resolvedFlight?.arrivalScheduled ?? "") : "",
      flightOrigin: flightBookingStatusValue === FLIGHT_BOOKED ? (resolvedFlight?.origin ?? "") : "",
      flightDestination: flightBookingStatusValue === FLIGHT_BOOKED ? (resolvedFlight?.destination ?? "") : "",
      groundTravelMode: flightBookingStatusValue === FLIGHT_GROUND ? groundTravelModeValue : "",
      groundTravelOther: flightBookingStatusValue === FLIGHT_GROUND ? groundTravelOther : "",
      groundTravelDuration: flightBookingStatusValue === FLIGHT_GROUND ? groundTravelDuration : "",
      groundTravelDeparture: flightBookingStatusValue === FLIGHT_GROUND ? groundTravelDeparture : "",
      budget: String(formData.get("budget") ?? ""),
      travelPace: String(formData.get("travelPace") ?? ""),
      interests: String(formData.get("interests") ?? ""),
      preferredTransport: preferredTransportValue,
      transportOther,
      stayingHotel: staying,
      hotelAddress: staying === HOTEL_OPTION_OTHER ? hotelAddress : "",
      accessibility,
      partySize,
      tripParty,
      mustHaves: cleanedMustHaves,
    };

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("We could not generate your itinerary right now.");
      }

      const result = (await response.json()) as GeneratedItinerary;
      const canonical: GeneratedItinerary = { ...result, days: normalizeItineraryDays(result.days) };
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(canonical));
        window.sessionStorage.setItem(
          TRIP_META_STORAGE_KEY,
          JSON.stringify({
            startDateIso: startDate,
            endDateIso: endDate,
          })
        );
      }
      router.push("/itinerary");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while generating your itinerary.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle: CSSProperties = {
    border: `1px solid ${INK3}`,
    borderRadius: 0,
    background: PAPER2,
    color: INK,
    fontFamily: SERIF,
    fontSize: 15,
  };

  const labelCaps: CSSProperties = {
    fontFamily: SANS,
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: INK3,
  };

  return (
    <div
      className="journy-root journy-paper-texture"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Itinerary Desk · Issue Form
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.04 }}>
          Plan a <span style={{ fontStyle: "italic", fontWeight: 400 }}>Trip</span>
        </h1>
        <p style={{ marginTop: 10, maxWidth: 800, fontFamily: SERIF, fontSize: 16, lineHeight: 1.5, color: INK2 }}>
          Tell us who is traveling, where you are staying, and your must-haves. We will draft a day-by-day itinerary in
          the Journy guidebook voice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:p-8" style={{ background: PAPER }}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-4 items-start">
          <div className="min-w-0">
            <Field label="Start date" name="startDate" type="date" required />
          </div>
          <div className="min-w-0">
            <Field label="End date" name="endDate" type="date" required />
          </div>
          <div className="min-w-0">
            <Field
              label="Destination"
              name="destination"
              placeholder="Tokyo, Japan"
              required
              value={destinationInput}
              onChange={(v) => setDestinationInput(v)}
            />
          </div>
          <div className="min-w-0">
            <label className="flex flex-col gap-2">
              <span style={labelCaps}>Preferred transportation</span>
              <select
                name="preferredTransport"
                value={preferredTransport}
                onChange={(e) => setPreferredTransport(e.target.value)}
                required
                className="w-full px-3 py-2 outline-none"
                style={inputStyle}
              >
                {TRANSPORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            {preferredTransport === TRANSPORT_OTHER ? (
              <label className="flex flex-col gap-1 mt-2">
                <span style={{ ...labelCaps, fontSize: 9 }}>Describe other</span>
                <input
                  name="transportOther"
                  required
                  placeholder="e.g. ferry, private driver, scooter"
                  className="w-full px-3 py-2 outline-none"
                  style={inputStyle}
                />
              </label>
            ) : null}
          </div>
          <div className="min-w-0">
            <Field label="Budget" name="budget" placeholder="$2500 total" required />
          </div>
          <div className="min-w-0">
            <label className="flex flex-col gap-2">
              <span style={labelCaps}>Trip purpose</span>
              <select
                name="tripPurpose"
                value={tripPurpose}
                onChange={(e) => setTripPurpose(e.target.value)}
                required
                className="w-full px-3 py-2 outline-none"
                style={inputStyle}
              >
                {TRIP_PURPOSE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="min-w-0">
            <Field label="Travel pace" name="travelPace" placeholder="Relaxed, balanced, or packed" required />
          </div>
          <div className="min-w-0">
            <Field label="Interests" name="interests" placeholder="Food, museums, nightlife" required />
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-4 items-start p-4"
          style={{ border: `1px solid ${INK3}`, background: `${PAPER2}88` }}
        >
          <span className="md:col-span-2" style={labelCaps}>
            Flights
          </span>
          <div className="min-w-0">
            <label className="flex flex-col gap-2">
              <span style={labelCaps}>Booking</span>
              <select
                name="flightBookingStatus"
                value={flightBookingStatus}
                onChange={(e) => {
                  const v = e.target.value;
                  setFlightBookingStatus(v);
                  if (v === FLIGHT_NOT_BOOKED || v === FLIGHT_GROUND) {
                    setFlightNumberInput("");
                    setFlightAirlineInput("");
                  }
                  if (v !== FLIGHT_GROUND) {
                    setGroundTravelMode("train");
                  }
                }}
                className="w-full px-3 py-2 outline-none"
                style={inputStyle}
              >
                <option value={FLIGHT_NOT_BOOKED}>My flight is not booked yet</option>
                <option value={FLIGHT_BOOKED}>I already booked my flight</option>
                <option value={FLIGHT_GROUND}>Not flying — driving, train, bus, or other</option>
              </select>
            </label>
          </div>
          {flightBookingStatus === FLIGHT_NOT_BOOKED ? (
            <div className="min-w-0">
              <label className="flex flex-col gap-2">
                <span style={labelCaps}>Flight preferences</span>
                <textarea
                  name="flightPreferencesText"
                  required
                  rows={3}
                  placeholder="Direct vs connections, preferred times, cabin class, airports…"
                  className="w-full px-3 py-2 outline-none"
                  style={inputStyle}
                />
              </label>
            </div>
          ) : null}
          {flightBookingStatus === FLIGHT_GROUND ? (
            <>
              <div className="min-w-0">
                <label className="flex flex-col gap-2">
                  <span style={labelCaps}>How you&apos;re getting there</span>
                  <select
                    name="groundTravelMode"
                    value={groundTravelMode}
                    onChange={(e) => setGroundTravelMode(e.target.value)}
                    required
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                  >
                    {GROUND_TRAVEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="min-w-0 md:col-span-2 grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-4">
                <label className="flex flex-col gap-2 min-w-0">
                  <span style={labelCaps}>When you&apos;re leaving</span>
                  <input
                    name="groundTravelDeparture"
                    required
                    placeholder="e.g. June 6 · 7:30 AM or 2026-06-06 07:30"
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                  />
                </label>
                <label className="flex flex-col gap-2 min-w-0">
                  <span style={labelCaps}>How long the trip takes</span>
                  <input
                    name="groundTravelDuration"
                    required
                    placeholder="e.g. 4 hours, 3h 20m, 90 minutes"
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                  />
                </label>
              </div>
              {groundTravelMode === GROUND_TRAVEL_OTHER ? (
                <div className="min-w-0 md:col-span-2">
                  <label className="flex flex-col gap-2">
                    <span style={{ ...labelCaps, fontSize: 9 }}>Describe other</span>
                    <input
                      name="groundTravelOther"
                      required
                      placeholder="e.g. ferry then rental car, rideshare to station…"
                      className="w-full px-3 py-2 outline-none"
                      style={inputStyle}
                    />
                  </label>
                </div>
              ) : null}
            </>
          ) : null}
          {flightBookingStatus === FLIGHT_BOOKED ? (
            <>
              <div className="min-w-0">
                <label className="flex flex-col gap-2">
                  <span style={labelCaps}>Flight date</span>
                  <input
                    type="date"
                    name="flightDate"
                    value={flightDate}
                    onChange={(e) => {
                      setFlightDate(e.target.value);
                      setFlightLookupStatus("idle");
                      setResolvedFlight(null);
                    }}
                    required
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                  />
                </label>
              </div>
              <div className="min-w-0">
                <label className="flex flex-col gap-2">
                  <span style={labelCaps}>Airline (optional)</span>
                  <input
                    name="flightAirline"
                    value={flightAirlineInput}
                    onChange={(e) => setFlightAirlineInput(e.target.value)}
                    placeholder="e.g. United"
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                  />
                </label>
              </div>
              <div className="min-w-0">
                <label className="flex flex-col gap-2">
                  <span style={labelCaps}>Flight number</span>
                  <input
                    name="flightNumber"
                    value={flightNumberInput}
                    onChange={(e) => {
                      setFlightNumberInput(e.target.value);
                      setFlightLookupStatus("idle");
                      setResolvedFlight(null);
                    }}
                    required
                    placeholder="e.g. UA857"
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                  />
                </label>
              </div>
              <div className="min-w-0 md:col-span-2">
                <FlightLookupStatus status={flightLookupStatus} flight={resolvedFlight} />
              </div>
            </>
          ) : null}
        </div>

        <div
          className="grid gap-4 p-4"
          style={{ border: `1px solid ${INK3}`, background: `${PAPER2}88` }}
        >
          <span style={labelCaps}>Group &amp; access</span>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="accessibility" className="h-4 w-4" style={{ accentColor: INK }} />
            <span style={{ fontFamily: SERIF, fontSize: 16, color: INK2 }}>
              Accessibility considerations (step-free routes, shorter walks, rest breaks)
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span style={labelCaps}>How many people</span>
              <input
                type="number"
                name="partySize"
                min={1}
                defaultValue={1}
                required
                className="w-full px-3 py-2 outline-none"
                style={inputStyle}
              />
            </label>
            <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
              <legend style={labelCaps}>Who is traveling</legend>
              <div className="flex flex-col gap-2" style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tripParty" value="myself" />
                  Myself
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tripParty" value="friends" />
                  Friends
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tripParty" value="family" />
                  Family
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tripParty" value="friends_and_family" defaultChecked />
                  Friends and family
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span style={labelCaps}>Where you are staying</span>
          <select
            name="stayingHotel"
            value={stayingHotel}
            onChange={(e) => setStayingHotel(e.target.value)}
            required
            className="w-full max-w-xl px-3 py-2 outline-none"
            style={inputStyle}
          >
            <option value={HOTEL_OPTION_NA}>N/A — this is a day trip (no overnight hotel)</option>
            {hotelOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
            <option value={HOTEL_OPTION_OTHER}>Other — my hotel is not listed (enter address below)</option>
          </select>
          <p style={{ fontFamily: SERIF, fontSize: 14, color: INK3, marginTop: 0 }}>
            Hotels shown are suggestions based on your destination. Pick &ldquo;Other&rdquo; if yours is not listed.
          </p>
          {stayingHotel === HOTEL_OPTION_OTHER ? (
            <label className="flex flex-col gap-2">
              <span style={labelCaps}>Hotel name &amp; address</span>
              <textarea
                name="hotelAddress"
                rows={3}
                required
                placeholder="Hotel name, street, city"
                className="w-full px-3 py-2 outline-none"
                style={inputStyle}
              />
            </label>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <span style={labelCaps}>Must-haves</span>
            <button
              type="button"
              onClick={addMustHave}
              className="px-3 py-2"
              style={{
                border: `1px solid ${INK}`,
                background: "transparent",
                color: INK,
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Add must-have
            </button>
          </div>
          <p style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>
            Add fixed commitments: time block, what you are doing, and where. Empty cards are ignored.
          </p>
          <div className="flex flex-col gap-4">
            {mustHaves.map((row, index) => (
              <div
                key={row.id}
                className="p-4 grid gap-3"
                style={{ border: `1px solid ${INK3}`, background: PAPER2 }}
              >
                <div className="flex justify-between items-center gap-2">
                  <span style={{ fontFamily: SERIF, fontSize: 18, color: INK }}>Must-have {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeMustHave(row.id)}
                    style={{ fontFamily: SANS, fontSize: 10, color: INK3, letterSpacing: "0.12em" }}
                  >
                    Remove
                  </button>
                </div>
                <label className="flex flex-col gap-1">
                  <span style={labelCaps}>Time block</span>
                  <input
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                    placeholder="e.g. Sat 10:00–14:00"
                    value={row.timeBlock}
                    onChange={(e) => updateMustHave(row.id, { timeBlock: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span style={labelCaps}>Activity</span>
                  <input
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                    placeholder="e.g. Lunch reservation, museum entry"
                    value={row.activity}
                    onChange={(e) => updateMustHave(row.id, { activity: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span style={labelCaps}>Where</span>
                  <input
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                    placeholder="Venue or neighborhood"
                    value={row.where}
                    onChange={(e) => updateMustHave(row.id, { where: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span style={labelCaps}>Details (optional)</span>
                  <textarea
                    className="w-full px-3 py-2 outline-none"
                    style={inputStyle}
                    rows={2}
                    placeholder="Confirmation #, dress code, notes"
                    value={row.details}
                    onChange={(e) => updateMustHave(row.id, { details: e.target.value })}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {error ? (
          <p
            className="px-3 py-2"
            style={{
              border: `1px solid ${OXBLOOD}`,
              background: `${OXBLOOD}14`,
              color: OXBLOOD,
              fontFamily: SERIF,
              fontSize: 15,
            }}
          >
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 transition disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              background: isSubmitting ? INK3 : INK,
              color: PAPER,
              fontFamily: SANS,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {isSubmitting ? "Generating your itinerary..." : "Generate itinerary"}
          </button>
          <Link href="/profile" className="transition-colors" style={{ fontFamily: SERIF, fontSize: 15, color: INK2 }}>
            Back to profile &rarr;
          </Link>
        </div>
      </form>
    </div>
  );
}

function FlightLookupStatus({
  status,
  flight,
}: {
  status: "idle" | "loading" | "found" | "not_found" | "error";
  flight: { origin: string; destination: string; departureScheduled: string; arrivalScheduled: string; airline: string } | null;
}) {
  if (status === "idle") return null;
  if (status === "loading") {
    return <p style={{ fontFamily: SERIF, fontSize: 13, color: INK3 }}>Looking up flight times…</p>;
  }
  if (status === "found" && flight) {
    const dep = new Date(flight.departureScheduled).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const arr = new Date(flight.arrivalScheduled).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return (
      <p style={{ fontFamily: SERIF, fontSize: 13, color: "#15803d" }}>
        ✓ {flight.origin} → {flight.destination} · Departs {dep} · Arrives {arr}
      </p>
    );
  }
  if (status === "not_found") {
    return <p style={{ fontFamily: SERIF, fontSize: 13, color: INK3 }}>Flight not found — times won&apos;t be included, you can still continue.</p>;
  }
  return <p style={{ fontFamily: SERIF, fontSize: 13, color: INK3 }}>Couldn&apos;t reach flight data — you can still continue.</p>;
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "date";
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3 }}>
        {label}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full px-3 py-2 outline-none transition"
        style={{
          border: `1px solid ${INK3}`,
          borderRadius: 0,
          background: "#E8DCC1",
          color: INK,
          fontFamily: SERIF,
          fontSize: 15,
        }}
      />
    </label>
  );
}
