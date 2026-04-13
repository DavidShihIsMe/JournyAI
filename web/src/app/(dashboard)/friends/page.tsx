import Link from "next/link";

export default function FriendsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display font-bold text-2xl text-neutral-900">
          Friends
        </h1>
        <p className="mt-1 font-body text-sm text-neutral-600">
          Connect with friends and compare traveler types.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-8 flex flex-col items-center text-center gap-4">
        <div className="w-full bg-neutral-100 rounded-xl h-[200px] flex items-center justify-center">
          <span className="font-body text-sm text-neutral-400">
            Placeholder: Friends List
          </span>
        </div>
        <p className="font-body text-sm text-neutral-600 max-w-md">
          Social features coming soon. See how your travel style compares with
          friends.
        </p>
      </div>

      <Link
        href="/home"
        className="font-body text-sm font-medium text-primary hover:text-primary-dark transition-colors"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
