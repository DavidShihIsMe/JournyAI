import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display font-bold text-2xl text-neutral-900">
          Profile
        </h1>
        <p className="mt-1 font-body text-sm text-neutral-600">
          Your account and traveler personality details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-display font-bold text-lg text-neutral-900 mb-4">
            Account
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center">
                <span className="font-body text-xs text-neutral-400">
                  Avatar
                </span>
              </div>
              <div>
                <p className="font-body text-sm font-medium text-neutral-900">
                  Display Name
                </p>
                <p className="font-body text-xs text-neutral-400">
                  user@example.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-display font-bold text-lg text-neutral-900 mb-4">
            Traveler Type
          </h2>
          <div className="bg-neutral-100 rounded-xl h-[120px] flex items-center justify-center">
            <span className="font-body text-sm text-neutral-400">
              Placeholder: Type Details
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <h2 className="font-display font-bold text-lg text-neutral-900 mb-4">
          Dimensions
        </h2>
        <div className="bg-neutral-100 rounded-xl h-[160px] flex items-center justify-center">
          <span className="font-body text-sm text-neutral-400">
            Placeholder: Dimension Sliders
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/home"
          className="font-body text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          &larr; Back to home
        </Link>
        <Link
          href="/quiz"
          className="font-body text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Retake quiz
        </Link>
      </div>
    </div>
  );
}
