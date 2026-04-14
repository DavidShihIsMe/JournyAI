import Link from "next/link";
import NavBar from "@/components/NavBar";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function LandingPage() {
  return (
    <>
      <NavBar />

      <main>
        <section className="relative h-screen w-full bg-primary flex flex-col items-center justify-center px-5 text-center">
          <h1 className="font-display font-black text-[56px] md:text-[96px] text-white leading-none">
            Journy
          </h1>
          <p className="font-body font-normal text-[18px] md:text-[24px] text-white/70 mt-5">
            Discover your travel style.
          </p>
          <p className="font-body font-normal text-[14px] md:text-[16px] text-white/50 mt-3 max-w-[500px]">
            Take a 2-minute quiz, discover your traveler personality, and get
            personalized trip recommendations.
          </p>
          <p className="font-body font-normal text-[12px] md:text-[14px] text-white/40 mt-2">
            Personalized itinerary generation coming soon.
          </p>
          <Link
            href="/quiz"
            className="mt-12 font-body font-semibold text-[16px] md:text-[18px] text-primary bg-white px-10 py-4 rounded-[30px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-[1.03]"
          >
            Find Your Travel Style
          </Link>

          <ScrollIndicator />
        </section>

        <section id="below" className="bg-white">
          <div
            className="h-[100px] w-full"
            style={{
              background:
                "linear-gradient(to bottom, #1A7D7A 0%, #FFFFFF 100%)",
            }}
          />
          <div className="min-h-[400px] flex flex-col items-center justify-center px-5 py-20">
            <h2 className="font-display font-black text-[40px] md:text-[64px] text-neutral-900 text-center leading-none">
              Coming Soon!
            </h2>
            <p className="font-body font-normal text-[18px] text-neutral-400 text-center mt-6">
              We&apos;re building something special. Stay tuned.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
