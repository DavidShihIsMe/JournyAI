import Link from "next/link";

export default function TypeRevealPage() {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-12">
      <p className="font-body text-sm font-medium text-primary uppercase tracking-wider">
        Your traveler type
      </p>

      <h1 className="font-display font-black text-4xl text-neutral-900">
        The Explorer
      </h1>

      <div className="inline-flex items-center justify-center rounded-full px-4 py-1.5 font-body text-sm font-semibold text-white tracking-wider bg-[#3A8A7A]">
        FRAI
      </div>

      <p className="font-body text-neutral-600 max-w-md leading-relaxed">
        Placeholder type description — this will show the user&apos;s actual
        traveler type once the quiz flow is connected.
      </p>

      <div className="w-full bg-neutral-100 rounded-2xl h-[200px] flex items-center justify-center">
        <p className="font-body text-sm text-neutral-400">
          Placeholder: Dimension Sliders
        </p>
      </div>

      <Link
        href="/signup"
        className="h-[52px] rounded-[12px] bg-primary px-8 flex items-center font-body text-base font-semibold text-white hover:bg-primary-dark transition-colors w-full justify-center"
      >
        Create Account to Save Results
      </Link>
    </div>
  );
}
