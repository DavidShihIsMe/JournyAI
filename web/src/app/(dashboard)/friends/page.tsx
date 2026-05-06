import Link from "next/link";
import { INK, INK2, INK3, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";

export default function FriendsPage() {
  return (
    <div className="journy-root journy-paper-texture flex flex-col gap-6" style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}>
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Social Ledger · Friends
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(32px, 4.8vw, 50px)", lineHeight: 1.04 }}>
          Your <span style={{ fontStyle: "italic", fontWeight: 400 }}>Friends</span>
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 16, color: INK2 }}>
          Connect with friends and compare traveler notation once social features go live.
        </p>
      </div>

      <div className="px-6 pt-2">
        <div className="p-8 flex flex-col items-center text-center gap-4" style={{ border: `1px solid ${INK3}`, background: `${PAPER2}99` }}>
          <div className="w-full h-[200px] flex items-center justify-center" style={{ border: `1px solid ${INK3}`, background: PAPER }}>
            <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: INK3 }}>
              Placeholder: Friends List
            </span>
          </div>
          <p style={{ fontFamily: SERIF, fontSize: 16, color: INK2, maxWidth: 620 }}>
            Social features are coming soon. You will be able to compare styles,
            plan together, and reconcile group itineraries in one shared plan.
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Link
          href="/home"
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
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
