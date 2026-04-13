import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      <NavBar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32">
        <div className="max-w-2xl text-center flex flex-col items-center gap-8">
          <h1 className="font-display font-black text-5xl md:text-6xl text-neutral-900 leading-tight">
            Travel like yourself,
            <br />
            <span className="text-primary">not like your feed</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-neutral-600 max-w-lg leading-relaxed">
            Take a 2-minute personality quiz and discover your unique traveler
            type. Get recommendations that match how you actually like to
            explore — not what&apos;s trending.
          </p>

          <Link
            href="/quiz"
            className="h-[52px] rounded-[12px] bg-primary px-8 flex items-center font-body text-base font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Find your travel style
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-light mx-auto mb-4 flex items-center justify-center">
              <span className="font-display font-bold text-primary text-lg">1</span>
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">
              Swipe through scenarios
            </h3>
            <p className="font-body text-sm text-neutral-600">
              React to travel moments that reveal your preferences — no right or wrong answers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-light mx-auto mb-4 flex items-center justify-center">
              <span className="font-display font-bold text-primary text-lg">2</span>
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">
              Build your dream day
            </h3>
            <p className="font-body text-sm text-neutral-600">
              Make choices about your ideal travel day to refine your personality profile.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-light mx-auto mb-4 flex items-center justify-center">
              <span className="font-display font-bold text-primary text-lg">3</span>
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">
              Meet your type
            </h3>
            <p className="font-body text-sm text-neutral-600">
              Discover which of 16 traveler types you are and get personalized destination picks.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
