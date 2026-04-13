import Link from "next/link";

export default function InterestsPage() {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      <h1 className="font-display font-black text-3xl text-neutral-900">
        What are you into?
      </h1>
      <p className="font-body text-neutral-600 max-w-md">
        Pick the travel interests that speak to you. This helps us personalize
        your recommendations.
      </p>

      <div className="w-full bg-neutral-100 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
        <p className="font-body text-sm text-neutral-400">
          Placeholder: Interest Chips Grid
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/type-reveal"
          className="h-[52px] rounded-[12px] bg-primary px-8 flex items-center font-body text-base font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          See my results
        </Link>
        <Link
          href="/type-reveal"
          className="h-[52px] rounded-[12px] px-6 flex items-center font-body text-base font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          Skip
        </Link>
      </div>
    </div>
  );
}
