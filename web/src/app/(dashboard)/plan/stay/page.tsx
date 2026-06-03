"use client";

import { HOTEL_OPTION_NA, HOTEL_OPTION_OTHER } from "@/lib/demoHotels";
import HotelAutocomplete from "@/components/plan/HotelAutocomplete";
import StepShell from "../_components/StepShell";
import { usePlan } from "../_components/PlanContext";

export default function StayStep() {
  const { state, update } = usePlan();
  const isDayTrip = state.stayingHotel === HOTEL_OPTION_NA;
  const isManual = state.stayingHotel === HOTEL_OPTION_OTHER;
  // In manual mode, require at least line 1 + city. In search mode, require a non-empty name.
  const canContinue =
    isDayTrip ||
    (isManual
      ? state.addressLine1.trim().length > 0 && state.addressCity.trim().length > 0
      : state.stayingHotel.trim().length > 0);

  return (
    <StepShell
      step="stay"
      title="Where are you staying?"
      subtitle="Type a hotel name and pick from the dropdown — address comes for free. Staying at an Airbnb? Enter the address manually. No overnight stay? Mark it a day trip."
      canContinue={canContinue}
    >
      <HotelAutocomplete
        destination={state.destination}
        destinationPlaceId={state.destinationPlaceId}
        stayingHotel={state.stayingHotel}
        hotelAddress={state.hotelAddress}
        hotelPlaceId={state.hotelPlaceId}
        addressLine1={state.addressLine1}
        addressLine2={state.addressLine2}
        addressCity={state.addressCity}
        addressRegion={state.addressRegion}
        addressCountry={state.addressCountry}
        addressPostal={state.addressPostal}
        addressLocationEdited={state.addressLocationEdited}
        onChange={(next) => update(next)}
      />
    </StepShell>
  );
}
