/**
 * Demo hotel names keyed by common destination substrings.
 * Replace with a real places API when you wire one up.
 */
const BY_KEYWORD: Record<string, string[]> = {
  tokyo: [
    "Park Hyatt Tokyo",
    "Hotel Gracery Shinjuku",
    "The Capitol Hotel Tokyu",
    "Imperial Hotel Tokyo",
    "Trunk Hotel",
  ],
  kyoto: [
    "The Ritz-Carlton Kyoto",
    "Ace Hotel Kyoto",
    "Hotel Kanra Kyoto",
    "Solaria Nishitetsu Hotel Kyoto Premier",
  ],
  paris: [
    "Hôtel de Crillon",
    "Le Meurice",
    "CitizenM Paris Gare de Lyon",
    "Hôtel des Grands Boulevards",
  ],
  london: [
    "The Savoy",
    "The Hoxton Shoreditch",
    "Zedwell Piccadilly",
    "The Ned",
  ],
  "new york": [
    "The Plaza",
    "Ace Hotel Brooklyn",
    "Arlo SoHo",
    "The Ludlow Hotel",
  ],
  nyc: [
    "The Plaza",
    "Ace Hotel Brooklyn",
    "Arlo SoHo",
    "The Ludlow Hotel",
  ],
  barcelona: [
    "Hotel Casa Bonay",
    "Cotton House Hotel",
    "W Barcelona",
  ],
  rome: [
    "Hotel de Russie",
    "The St. Regis Rome",
    "Chapter Roma",
  ],
};

const GENERIC = [
  "AC Hotel by Marriott Downtown",
  "Hilton Garden Inn City Center",
  "Hyatt Place Central District",
  "Kimpton Hotel Monaco",
  "The Westin Convention Center",
];

export const HOTEL_OPTION_NA = "__day_trip__";
export const HOTEL_OPTION_OTHER = "__other__";

export function hotelsForDestination(destination: string): string[] {
  const d = destination.trim().toLowerCase();
  if (!d) return GENERIC;
  for (const [keyword, hotels] of Object.entries(BY_KEYWORD)) {
    if (d.includes(keyword)) return [...hotels];
  }
  return [...GENERIC];
}
