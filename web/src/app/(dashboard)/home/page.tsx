import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display font-bold text-2xl text-neutral-900">
          Welcome back
        </h1>
        <p className="mt-1 font-body text-sm text-neutral-600">
          Here&apos;s an overview of your travel profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-display font-bold text-lg text-neutral-900 mb-4">
            Your Traveler Type
          </h2>
          <div className="bg-neutral-100 rounded-xl h-[120px] flex items-center justify-center">
            <span className="font-body text-sm text-neutral-400">
              Placeholder: Type Card
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-display font-bold text-lg text-neutral-900 mb-4">
            Upcoming Trips
          </h2>
          <div className="bg-neutral-100 rounded-xl h-[120px] flex items-center justify-center">
            <span className="font-body text-sm text-neutral-400">
              Placeholder: Trips List
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/plan"
          className="font-body text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Plan a trip &rarr;
        </Link>
        <Link
          href="/profile"
          className="font-body text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          View profile &rarr;
        </Link>
      </div>
    </div>
  );
}
