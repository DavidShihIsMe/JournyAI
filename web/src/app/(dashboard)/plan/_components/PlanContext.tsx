"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
export interface ActivityWish {
  id: string;
  text: string;
}

export interface Commitment {
  id: string;
  day: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  name: string;
  address: string;
}

export interface PlanState {
  // Step 1 — destination
  destination: string;
  destinationPlaceId: string;
  beenHereBefore: boolean;

  // Step 2 — dates + (optional) flight refinement
  startDate: string;
  endDate: string;
  flightNumber: string;
  flightAirline: string;
  flightDate: string;
  flightDepartureTime: string;
  flightArrivalTime: string;
  flightOrigin: string;
  flightDestination: string;

  // Step 3 — lodging
  stayingHotel: string;
  hotelAddress: string;
  hotelPlaceId: string;
  // Structured address parts (used when stayingHotel === HOTEL_OPTION_OTHER — manual mode)
  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  addressRegion: string;
  addressCountry: string;
  addressPostal: string;
  // True once the user types into city or country — stops the destination-based autofill
  // from overriding them. Reset to false when destination changes.
  addressLocationEdited: boolean;

  // Step 4 — party
  tripParty: "friends" | "family" | "friends_and_family" | "myself";
  partySize: number;

  // Step 5 — accessibility
  accessibilityNeeds: string[];
  accessibilityOther: string;

  // Step 6 — budget
  budgetAmount: string;
  budgetTier: "" | "$" | "$$" | "$$$" | "$$$$" | "no_budget";

  // Step 7 — activities + commitments
  activityWishes: ActivityWish[];
  commitments: Commitment[];

  // Step 8 — prioritize
  tripPurpose: string;
  preferredTransport: string;
  transportOther: string;
}

const INITIAL_STATE: PlanState = {
  destination: "",
  destinationPlaceId: "",
  beenHereBefore: false,

  startDate: "",
  endDate: "",
  flightNumber: "",
  flightAirline: "",
  flightDate: "",
  flightDepartureTime: "",
  flightArrivalTime: "",
  flightOrigin: "",
  flightDestination: "",

  stayingHotel: "",
  hotelAddress: "",
  hotelPlaceId: "",
  addressLine1: "",
  addressLine2: "",
  addressCity: "",
  addressRegion: "",
  addressCountry: "",
  addressPostal: "",
  addressLocationEdited: false,

  tripParty: "myself",
  partySize: 1,

  accessibilityNeeds: [],
  accessibilityOther: "",

  budgetAmount: "",
  budgetTier: "",

  activityWishes: [],
  commitments: [],

  tripPurpose: "vacation",
  preferredTransport: "public_transit",
  transportOther: "",
};

const STORAGE_KEY = "journy_plan_draft";

interface PlanContextValue {
  state: PlanState;
  update: (patch: Partial<PlanState>) => void;
  reset: () => void;
  hydrated: boolean;
}

const PlanCtx = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlanState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PlanState>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore — fall back to initial state
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<PlanState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <PlanCtx.Provider value={{ state, update, reset, hydrated }}>{children}</PlanCtx.Provider>
  );
}

export function usePlan(): PlanContextValue {
  const v = useContext(PlanCtx);
  if (!v) throw new Error("usePlan must be used inside <PlanProvider>");
  return v;
}
