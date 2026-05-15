import { NextResponse } from "next/server";
import { enrichItineraryWalksWithGoogle } from "@/lib/enrichItineraryWalksGoogle";
import type { MustHaveCard } from "@/lib/tripTypes";
import { normalizeItineraryDays, type GeneratedItinerary } from "@/lib/tripTypes";

interface TripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  tripPurpose: string;
  flightBookingStatus: "not_booked" | "booked" | "ground_travel";
  flightPreferencesText?: string;
  flightNumber?: string;
  flightAirline?: string;
  groundTravelMode?: string;
  groundTravelOther?: string;
  groundTravelDuration?: string;
  groundTravelDeparture?: string;
  budget: string;
  travelPace: string;
  interests: string;
  preferredTransport: string;
  transportOther?: string;
  stayingHotel: string;
  hotelAddress?: string;
  accessibility: boolean;
  partySize: number;
  tripParty: "friends" | "family" | "friends_and_family" | "myself";
  mustHaves: MustHaveCard[];
}

export async function POST(request: Request) {
  const raw = (await request.json()) as Partial<TripRequest>;
  const body: TripRequest = {
    destination: String(raw.destination ?? ""),
    startDate: String(raw.startDate ?? ""),
    endDate: String(raw.endDate ?? ""),
    tripPurpose: String(raw.tripPurpose ?? "vacation"),
    flightBookingStatus:
      raw.flightBookingStatus === "booked"
        ? "booked"
        : raw.flightBookingStatus === "ground_travel"
          ? "ground_travel"
          : "not_booked",
    flightPreferencesText: raw.flightPreferencesText,
    flightNumber: raw.flightNumber,
    flightAirline: raw.flightAirline,
    groundTravelMode: raw.groundTravelMode,
    groundTravelOther: raw.groundTravelOther,
    groundTravelDuration: raw.groundTravelDuration,
    groundTravelDeparture: raw.groundTravelDeparture,
    budget: String(raw.budget ?? ""),
    travelPace: String(raw.travelPace ?? ""),
    interests: String(raw.interests ?? ""),
    preferredTransport: String(raw.preferredTransport ?? "public_transit"),
    transportOther: raw.transportOther,
    stayingHotel: String(raw.stayingHotel ?? "__day_trip__"),
    hotelAddress: raw.hotelAddress,
    accessibility: Boolean(raw.accessibility),
    partySize: typeof raw.partySize === "number" ? raw.partySize : Number(raw.partySize) || 1,
    tripParty:
      raw.tripParty === "friends" ||
      raw.tripParty === "family" ||
      raw.tripParty === "friends_and_family" ||
      raw.tripParty === "myself"
        ? raw.tripParty
        : "friends_and_family",
    mustHaves: Array.isArray(raw.mustHaves) ? raw.mustHaves : [],
  };
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY. Add it to web/.env.local." },
      { status: 500 }
    );
  }

  const prompt = buildPrompt(body);
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. Always return valid JSON matching the requested schema exactly.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "Failed to generate itinerary", details: errorText },
      { status: 500 }
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "AI returned an empty response." }, { status: 500 });
  }

  try {
    const parsed = JSON.parse(content) as GeneratedItinerary;
    if (!Array.isArray(parsed.days)) {
      throw new Error("Invalid itinerary shape");
    }
    const normalized: GeneratedItinerary = {
      ...parsed,
      days: normalizeItineraryDays(parsed.days),
    };

    const googleKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
    if (googleKey) {
      try {
        const { attempts, updates } = await enrichItineraryWalksWithGoogle(normalized, body, googleKey);
        normalized.meta = {
          walkTimesVerifiedWithGoogle: updates > 0,
          googleWalkAttempts: attempts,
          googleWalkUpdates: updates,
        };
      } catch {
        normalized.meta = {
          walkTimesVerifiedWithGoogle: false,
          googleWalkAttempts: 0,
          googleWalkUpdates: 0,
        };
      }
    }

    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json(
      {
        error: "AI response could not be parsed as itinerary JSON.",
        raw: content,
      },
      { status: 500 }
    );
  }
}

function formatGroundTravelMode(input: TripRequest): string {
  const m = input.groundTravelMode?.trim() || "";
  if (m === "other") {
    return input.groundTravelOther?.trim() || "Other (not specified)";
  }
  const labels: Record<string, string> = {
    driving: "Driving",
    train: "Train",
    bus: "Bus",
  };
  return labels[m] || m || "Ground travel";
}

function formatFlight(input: TripRequest): string {
  const status = input.flightBookingStatus ?? "not_booked";
  if (status === "booked") {
    const airline = input.flightAirline?.trim() || "";
    const fn = input.flightNumber?.trim() || "";
    return [
      "Flight already booked.",
      airline ? `Airline: ${airline}.` : "",
      fn ? `Flight number: ${fn}.` : "Flight number not provided.",
      "Exact landing time varies by day — confirm in the airline app or via a flight-status search.",
      "This app does not call Google or airline APIs for live times yet.",
    ]
      .filter(Boolean)
      .join(" ");
  }
  if (status === "ground_travel") {
    const how = formatGroundTravelMode(input);
    const dep = input.groundTravelDeparture?.trim() || "(not specified)";
    const dur = input.groundTravelDuration?.trim() || "(not specified)";
    return [
      "Not flying — traveler reaches the destination by ground.",
      `Mode: ${how}.`,
      `Planned departure: ${dep}.`,
      `Estimated travel duration: ${dur}.`,
      "Use departure time plus duration as a rough Day 1 arrival window; do not invent precise real-time traffic or rail delays.",
    ].join(" ");
  }
  const prefs = input.flightPreferencesText?.trim() || "(none)";
  return `Flight not booked yet. Preferences: ${prefs}`;
}

function formatTripPurpose(input: TripRequest): string {
  const labels: Record<string, string> = {
    vacation: "Vacation / leisure",
    fun: "Just for fun",
    honeymoon: "Honeymoon",
    family_visit: "Visiting family",
    friends_getaway: "Friends getaway",
    celebration: "Birthday or celebration",
    anniversary: "Anniversary trip",
    solo: "Solo trip",
    work_bleisure: "Work + leisure",
    bucket_list: "Bucket-list adventure",
    cultural_deep_dive: "Culture & learning focus",
  };
  const v = input.tripPurpose?.trim() || "vacation";
  return labels[v] ?? v;
}

function formatTransport(input: TripRequest): string {
  if (input.preferredTransport === "other") {
    return `Other: ${input.transportOther?.trim() || "(not specified)"}`;
  }
  const labels: Record<string, string> = {
    car: "Car (rental or own)",
    public_transit: "Public transportation",
    train: "Train",
    walk: "Walking",
    bike: "Bike",
    rideshare: "Rideshare / taxi",
    mixed: "Mixed (choose best mode per day)",
  };
  return labels[input.preferredTransport] ?? input.preferredTransport;
}

function formatMustHaves(cards: MustHaveCard[]): string {
  if (!cards.length) return "None specified.";
  return cards
    .map((c, i) => {
      const parts = [
        c.timeBlock && `Time: ${c.timeBlock}`,
        c.activity && `Activity: ${c.activity}`,
        c.where && `Where: ${c.where}`,
        c.details && `Details: ${c.details}`,
      ].filter(Boolean);
      return `${i + 1}. ${parts.join(" | ")}`;
    })
    .join("\n");
}

function transportPlanningRules(input: TripRequest): string {
  const mode = input.preferredTransport;
  const common =
    'Each day must use the structured "items" array below: alternate **travel** legs (movement between stops) with **activity** blocks. The first item of a day may be travel (from hotel or arrival point) or an activity if the day starts in place. End each day on an **activity** when possible (e.g. dinner), not mid-transit.';

  const travelRowRules =
    'For every **travel** row: set "kind" to "travel", "time" to departure time (12-hour with AM/PM), "text" to a short description of the route (from → toward), "durationMinutes" to a realistic whole number of minutes for that mode, and "mode" to one of: walk, public_transit, taxi, car, bike, train, ferry, mixed.';

  if (mode === "walk") {
    return `${common}
${travelRowRules}
**Walking is the primary mode.** Cluster stops so nearly every leg is walkable (aim for under 20 minutes walk between stops; if you must exceed ~25 minutes walking, call that out explicitly in the travel row text and keep it rare). Do not default to transit or taxi unless the traveler would reasonably need it (steep terrain, unsafe pedestrian route, or crossing water). Use "mode": "walk" for essentially all travel rows between in-city stops. Include "durationMinutes" on every travel row.`;
  }
  if (mode === "bike") {
    return `${common}
${travelRowRules}
**Cycling is preferred.** Keep distances bike-realistic; mention bike lanes, calm streets, or bike share when helpful. Use "mode": "bike" for most between-stop legs and include "durationMinutes".`;
  }
  if (mode === "public_transit") {
    return `${common}
${travelRowRules}
**Public transit is preferred.** Use trains, buses, trams, or ferries between stops; name lines or systems when useful. Include "durationMinutes" for each travel row (platform walk + ride + transfer buffer as appropriate).`;
  }
  if (mode === "train") {
    return `${common}
${travelRowRules}
**Trains are preferred** for longer hops; use local public transit or short walks for last-mile unless another mode is clearly better. Always include "durationMinutes" on travel rows.`;
  }
  if (mode === "car") {
    return `${common}
${travelRowRules}
**Driving is preferred** between stops when in a spread-out area; mention parking or drop-off friction briefly when relevant. Use "mode": "car" and include "durationMinutes" (traffic-aware estimates).`;
  }
  if (mode === "rideshare") {
    return `${common}
${travelRowRules}
**Rideshare or taxi is preferred** between stops when distances are awkward on foot or transit; include "durationMinutes" and "mode": "taxi" or "mixed" if combined.`;
  }
  if (mode === "mixed") {
    return `${common}
${travelRowRules}
**Choose the best mode per leg** (walk, public_transit, taxi, etc.) and always include "durationMinutes" plus a clear "mode" on each travel row.`;
  }
  if (mode === "other") {
    const note = input.transportOther?.trim() || "user-specified other";
    return `${common}
${travelRowRules}
**Preferred movement:** ${note}. Honor that for between-stop legs; include "durationMinutes" and "mode" on every travel row.`;
  }
  return `${common}
${travelRowRules}`;
}

function buildPrompt(input: TripRequest): string {
  const hotelLine =
    input.stayingHotel === "__day_trip__"
      ? "Lodging: N/A — day trip (no overnight hotel)."
      : input.stayingHotel === "__other__"
        ? `Lodging: other — address provided: ${input.hotelAddress ?? "(none)"}`
        : `Lodging: staying at ${input.stayingHotel}${input.hotelAddress ? ` — ${input.hotelAddress}` : ""}`;

  const lodgingExactCopy =
    input.stayingHotel === "__day_trip__"
      ? "N/A (day trip — no overnight hotel)"
      : input.stayingHotel === "__other__"
        ? (input.hotelAddress?.trim() || "Other lodging — address not provided")
        : [input.stayingHotel.trim(), input.hotelAddress?.trim()].filter(Boolean).join(" — ");

  const party =
    input.tripParty === "myself"
      ? "Traveling alone (myself)"
      : input.tripParty === "friends"
        ? "Friends trip"
        : input.tripParty === "family"
          ? "Family trip"
          : "Friends and family";

  return `
Generate a day-by-day travel itinerary as strict JSON.

Traveler Input:
- Destination: ${input.destination}
- Start Date: ${input.startDate}
- End Date: ${input.endDate}
- ${hotelLine}
- Lodging exact string (copy verbatim whenever you name the hotel, directions say "back to the hotel", or airport transfers reference the stay — do not shorten, translate, substitute a "similar" property, or invent a different brand): ${lodgingExactCopy}
- Trip purpose: ${formatTripPurpose(input)}
- Flights: ${formatFlight(input)}
- Budget: ${input.budget}
- Travel Pace: ${input.travelPace}
- Interests: ${input.interests}
- Preferred transportation: ${formatTransport(input)}
- Accessibility needs: ${input.accessibility ? "Yes — prioritize step-free routes, shorter walks, clear rest breaks, and venues with good access." : "No specific accessibility requirements stated."}
- Group: ${input.partySize} traveler(s); ${party}.

Must-haves (hard commitments — schedule around these):
${formatMustHaves(input.mustHaves ?? [])}

Transport and timing (follow strictly):
${transportPlanningRules(input)}

Return ONLY JSON in this format:
{
  "title": "string",
  "summary": "string",
  "destination": "string",
  "travelDates": "string",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "items": [
        {
          "kind": "travel",
          "time": "9:00 AM",
          "text": "Walk from hotel toward the old quarter",
          "durationMinutes": 12,
          "mode": "walk",
          "detail": "Optional: route hint"
        },
        {
          "kind": "activity",
          "time": "8:00 PM",
          "text": "Coffee in Daikanyama — three concrete picks",
          "detail": null,
          "venueChoices": [
            {
              "id": "daikanyamaA",
              "name": "Named café or venue one",
              "area": "Daikanyama",
              "walkFromPreviousMinutes": 10,
              "walkToFollowingStopMinutes": 14,
              "rating": 4.5,
              "ratingCountApprox": 620,
              "websiteUrl": null,
              "oneLine": "Light roast, standing bar"
            },
            {
              "id": "daikanyamaB",
              "name": "Named café or venue two",
              "area": "Near Saigoyama Park",
              "walkFromPreviousMinutes": 12,
              "walkToFollowingStopMinutes": 11,
              "rating": 4.7,
              "ratingCountApprox": 890,
              "websiteUrl": null,
              "oneLine": "Pastries, garden seating"
            },
            {
              "id": "daikanyamaC",
              "name": "Named café or venue three",
              "area": "Daikanyama Address cluster",
              "walkFromPreviousMinutes": 9,
              "walkToFollowingStopMinutes": 16,
              "rating": 4.4,
              "ratingCountApprox": 410,
              "websiteUrl": null,
              "oneLine": "Third-wave, minimal interior"
            }
          ]
        },
        {
          "kind": "travel",
          "time": "10:15 PM",
          "text": "Walk toward the next neighborhood stop",
          "durationMinutes": 14,
          "mode": "walk",
          "detail": null
        }
      ]
    }
  ]
}

Item rules:
- **activity** rows: "kind" must be "activity", "time" when that visit/block starts (12-hour with AM/PM), "text" required, "detail" optional.
- **travel** rows: "kind" must be "travel", "time" when that leg departs, "text" required (what/where you're moving between), "durationMinutes" required (integer minutes), "mode" required, "detail" optional (line name, landmark, etc.).
- Order items chronologically. Times must advance sensibly through the day (allow buffer after travel before the next activity).
- Keep activity "text" one or two tight sentences; avoid dumping whole paragraphs into one row.

Venue options (any stop where a **specific real place** matters — user picks one of three):
- When the server has **Google Maps** configured, walking **durationMinutes** and venue **walkFromPreviousMinutes** / **walkToFollowingStopMinutes** may be **replaced** with Google Directions walking durations for verification; still output your best initial estimates.
- **Meals (mandatory venue cards):** Any activity that is **sit-down or destination eating** must include **venueChoices** (exactly 3 picks each). That includes **breakfast or sit-down morning coffee**, **brunch**, **lunch**, **afternoon tea or dessert at a named salon**, **dinner**, **supper / late bite**, **market or hall lunch**, **omakase or tasting menus**, **tapas / pintxos crawl anchors**, **street-food clusters as the main stop**, and **bakeries or pastry shops when that stop is the main event**. On every **full calendar day** of the trip, include **at least one** **lunch** activity with **venueChoices** and **at least one** **dinner** activity with **venueChoices**. When the day includes eating out in the morning, add **breakfast or brunch** with **venueChoices** too. Do **not** describe lunch or dinner only as "grab something nearby" or "find a local restaurant" without three named options — use cards even for quick lunch (counter ramen, bistro du quartier, food hall stall row) by naming three real-feeling spots. If **pace** is tight, choose faster formats but still three names per meal row.
- Add **venueChoices** for other concrete venue types where names help: **cafés**, **wine or cocktail bars**, **pubs and breweries**, **nightclubs and late-night venues**, **live music rooms**, **shopping malls and major retail**, **neighborhood shopping streets**, **bookstores and specialty retail**, **spas** when venue-specific, and similar. Use judgment for non-meal stops: if the traveler would reasonably Google a business name, include venueChoices.
- **Hotel / lodging names:** Always use the **lodging exact string** above character-for-character in prose and in travel rows (e.g. "Return to …"). Never replace it with a generic label like "your hotel" unless the traveler is on a day trip (N/A).
- **Clocks and venue legs:** Activity **time** values, **travel** **durationMinutes**, and each **venueChoices** **walkFromPreviousMinutes** / **walkToFollowingStopMinutes** must be **mutually consistent** for the same neighborhood story (no impossible jumps). The three venue options should differ in walk minutes when their **area** implies different distances. The app will shift displayed times when the user picks a farther or nearer venue; your baselines must already reflect realistic gaps between those options.
- **Bars and nightclubs (do not skip):** Unless **interests** or **travel pace** clearly say no nightlife / early bed only, you **must** include **venueChoices** for **evening bars** (cocktail bars, wine bars, pubs, rooftop bars, or similar — three named picks per row) on **most full days** of the trip. You **must** also include **venueChoices** for **nightclubs, dance clubs, or flagship late-night venues** (three named picks per row) on a **regular cadence**: on a **single-day** trip, include **one bar** block and **one nightclub-or-equivalent** block when evening hours exist; at least **one** nightclub-style row on a **2-day** trip; at least **two** across a **3–5 day** trip; and roughly **every other day** on longer trips. If the city is not club-oriented, use the closest honest equivalent (late DJ lounge, live-music room open past midnight, late-night jazz club) and say so in the activity **text** or each **oneLine** — still three concrete venue names.
- **Omit** venueChoices for pure scenery walks, generic "explore the old town" without a lead venue, hotel rest time, simple transit instructions, or broad museum/gallery blocks unless the row is really about **one** famous reservation-worthy spot (then use venueChoices for that spot).
- When present, **venueChoices** must contain **exactly 3** objects. Each must use a unique **id** (short slug, letters/digits only).
- Each choice needs: **name** (real-sounding venue for the destination), **area** (neighborhood or cross streets), **walkFromPreviousMinutes** (integer estimate from the prior itinerary stop to this venue), **walkToFollowingStopMinutes** (integer estimate from this venue to the **next** activity after the following **travel** row — required whenever the next item in the day is **travel** then another **activity**; match the travel row mode, usually walk minutes), **rating** (decimal 3.8–5.0 plausible for the tier), **ratingCountApprox** (integer approximate review volume), **websiteUrl** (full https URL only if you are highly confident it is the official site; otherwise null), **oneLine** (under 20 words on vibe or specialty).
- The travel row immediately after a venueChoices activity should describe the move toward the next stop; its **durationMinutes** should match the **first** venue choice's **walkToFollowingStopMinutes** as the default baseline (the app will adjust when the user picks another venue).
- Never invent precise GPS; minutes are rough planning estimates only.

Rules:
- Include each calendar day of the trip from start date through end date.
- Keep each row concise, specific, and practical.
- Ensure the plan aligns with budget, pace, and trip purpose (tone and pacing should match — e.g. honeymoon vs visiting family vs solo). Still include bar and nightclub **venueChoices** whenever nightlife fits; if pace is "relaxed", use earlier bar times and smaller clubs rather than omitting. Never skip **lunch** or **dinner** **venueChoices** on a full day unless **interests** explicitly describe no sit-down meals.
- If the traveler booked a specific flight, bias Day 1 plans toward realistic arrival and airport transfer timing (without inventing a precise landing clock time unless provided).
- If the traveler is not flying and gave ground departure time and duration, bias Day 1 toward a sensible arrival window from that information (rough estimate only).
${input.tripParty === "myself" ? "- Who is traveling: alone (myself) — keep logistics realistic for one person, include solo-friendly options where natural (dining, tickets, downtime), and avoid assuming a group or companion.\n" : ""}- Honor must-have time blocks and locations whenever possible.
`.trim();
}
