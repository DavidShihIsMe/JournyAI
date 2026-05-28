import { ITINERARY_UI_STATE_KEY } from "@/lib/tripStorageKeys";

export interface ItineraryUiState {
  venueSelections: Record<string, string>;
  travelOverrides: Record<string, number>;
}

const EMPTY: ItineraryUiState = { venueSelections: {}, travelOverrides: {} };

export function loadItineraryUiState(): ItineraryUiState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.sessionStorage.getItem(ITINERARY_UI_STATE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<ItineraryUiState>;
    return {
      venueSelections:
        parsed.venueSelections && typeof parsed.venueSelections === "object"
          ? parsed.venueSelections
          : {},
      travelOverrides:
        parsed.travelOverrides && typeof parsed.travelOverrides === "object"
          ? parsed.travelOverrides
          : {},
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveItineraryUiState(state: ItineraryUiState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ITINERARY_UI_STATE_KEY, JSON.stringify(state));
}
