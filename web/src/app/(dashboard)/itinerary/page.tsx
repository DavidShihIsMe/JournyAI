import { Suspense } from "react";
import ItineraryClient from "./ItineraryClient";

export default function ItineraryPage() {
  return (
    <Suspense fallback={<div className="p-8 font-body text-neutral-500">Loading…</div>}>
      <ItineraryClient />
    </Suspense>
  );
}
