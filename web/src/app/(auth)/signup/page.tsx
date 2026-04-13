import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <Link href="/" className="font-display font-black text-2xl text-primary">
            Journy
          </Link>
          <h1 className="mt-4 font-display font-bold text-2xl text-neutral-900">
            Create your account
          </h1>
          <p className="mt-2 font-body text-sm text-neutral-600">
            Save your traveler type and start planning
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-sm font-medium text-neutral-800">
              Display name
            </label>
            <div className="h-12 rounded-[10px] bg-neutral-100 px-4 flex items-center">
              <span className="font-body text-sm text-neutral-400">
                Placeholder: Name Input
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-sm font-medium text-neutral-800">
              Email
            </label>
            <div className="h-12 rounded-[10px] bg-neutral-100 px-4 flex items-center">
              <span className="font-body text-sm text-neutral-400">
                Placeholder: Email Input
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-sm font-medium text-neutral-800">
              Password
            </label>
            <div className="h-12 rounded-[10px] bg-neutral-100 px-4 flex items-center">
              <span className="font-body text-sm text-neutral-400">
                Placeholder: Password Input
              </span>
            </div>
          </div>
        </div>

        <div className="h-[52px] rounded-[12px] bg-primary flex items-center justify-center">
          <span className="font-body text-base font-semibold text-white">
            Create account
          </span>
        </div>

        <p className="text-center font-body text-sm text-neutral-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
