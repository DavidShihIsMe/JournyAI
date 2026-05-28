import { Suspense } from "react";
import CalendarItineraryClient from "./CalendarItineraryClient";

export default function ItineraryCalendarPage() {
  return (
    <Suspense fallback={<div className="p-8 font-body text-neutral-500">Loading calendar…</div>}>
      <CalendarItineraryClient />
    </Suspense>
  );
}
