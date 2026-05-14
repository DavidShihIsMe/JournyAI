import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-5 pt-[140px] pb-16">
      <Link
        href="/"
        className="font-display font-bold text-[28px] text-primary leading-none"
      >
        Journy
      </Link>

      <h1 className="mt-8 font-display font-bold text-[32px] text-[#111827] text-center leading-tight">
        Accounts aren&apos;t enabled
      </h1>
      <p className="mt-2 max-w-[400px] font-body text-base text-[#9CA3AF] text-center">
        This version has no hosted sign-up. Use the planner with your API keys
        in{" "}
        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm text-[#374151]">
          .env.local
        </code>
        .
      </p>

      <div className="mt-10 flex w-full max-w-[400px] flex-col gap-3">
        <Link
          href="/plan"
          className="flex h-[52px] items-center justify-center rounded-[12px] bg-primary font-body text-base font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Plan a trip
        </Link>
        <Link
          href="/login"
          className="text-center font-body text-sm text-primary hover:text-primary-dark transition-colors"
        >
          Back to login info
        </Link>
      </div>
    </div>
  );
}
