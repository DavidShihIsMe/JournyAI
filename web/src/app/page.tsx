import Link from "next/link";
import NavBar from "@/components/NavBar";
import ScrollIndicator from "@/components/ScrollIndicator";

export default function LandingPage() {
  return (
    <>
      <NavBar />

      <main>
        <section className="relative w-full bg-primary min-h-screen md:h-[900px] overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-5 md:px-20 pt-[160px] md:pt-[298px]">
            <h1 className="font-display font-normal text-[64px] md:text-[96px] leading-none text-white">
              Journy
            </h1>

            <p className="font-body font-bold text-[20px] md:text-[24px] leading-[1.208] text-white/70 mt-10 md:mt-[79px]">
              Discover your travel style
            </p>

            <p className="font-body font-bold text-[18px] md:text-[20px] leading-[1.45] text-white/70 mt-5 md:mt-[20px] max-w-[667px]">
              Take a 2-minute quiz and find out what kind of traveler you
              really are.
            </p>

            <Link
              href="/quiz"
              className="inline-block font-body font-semibold text-[18px] leading-[1.611] text-white mt-8 md:mt-[33px]"
            >
              Find Your Travel Style →
            </Link>
          </div>

          <ScrollIndicator />
        </section>

        <div
          className="h-[100px] w-full"
          style={{
            background: "linear-gradient(to bottom, #1A7D7A 0%, #FFFFFF 100%)",
          }}
        />

        <section id="below" className="bg-white">
          <div className="min-h-[400px] flex items-center justify-center pt-[100px] pb-[100px] px-5">
            <h2 className="font-display font-normal text-[56px] md:text-[96px] leading-none text-black text-center">
              Coming Soon!
            </h2>
          </div>
        </section>
      </main>
    </>
  );
}
