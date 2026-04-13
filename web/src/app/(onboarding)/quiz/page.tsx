import Link from "next/link";
import { swipeCards } from "@lib/onboarding/cards";

export default function QuizPage() {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      <h1 className="font-display font-black text-3xl text-neutral-900">
        Travel Personality Quiz
      </h1>
      <p className="font-body text-neutral-600 max-w-md">
        Swipe through {swipeCards.length} travel scenarios to discover your
        traveler type. There are no right or wrong answers — just go with your
        gut.
      </p>

      <div className="w-full bg-neutral-100 rounded-2xl h-[300px] flex items-center justify-center">
        <p className="font-body text-sm text-neutral-400">
          Placeholder: Swipe Card Stack ({swipeCards.length} cards)
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/interests"
          className="h-[52px] rounded-[12px] bg-primary px-8 flex items-center font-body text-base font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Continue to Interests
        </Link>
      </div>
    </div>
  );
}
