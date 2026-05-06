import { NextResponse } from "next/server";

interface TripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  hotelPreferences: string;
  flightPreferences: string;
  budget: string;
  travelPace: string;
  interests: string;
  notes?: string;
}

interface GeneratedItinerary {
  title: string;
  summary: string;
  destination: string;
  travelDates: string;
  days: Array<{
    day: number;
    title: string;
    items: string[];
  }>;
}

export async function POST(request: Request) {
  const body = (await request.json()) as TripRequest;
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
    return NextResponse.json(parsed);
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

function buildPrompt(input: TripRequest): string {
  return `
Generate a day-by-day travel itinerary as strict JSON.

Traveler Input:
- Destination: ${input.destination}
- Start Date: ${input.startDate}
- End Date: ${input.endDate}
- Hotel Preferences: ${input.hotelPreferences}
- Flight Preferences: ${input.flightPreferences}
- Budget: ${input.budget}
- Travel Pace: ${input.travelPace}
- Interests: ${input.interests}
- Extra Notes: ${input.notes ?? ""}

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
      "items": ["activity 1", "activity 2", "activity 3"]
    }
  ]
}

Rules:
- Include each day of the trip.
- Keep each activity concise, specific, and practical.
- Ensure the plan aligns with budget and pace.
`.trim();
}
