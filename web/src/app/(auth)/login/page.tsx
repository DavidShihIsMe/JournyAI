import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-5 pt-[140px] pb-16">
      <Link
        href="/"
        className="font-display font-bold text-[28px] text-primary leading-none"
      >
        Journy
      </Link>

      <h1 className="mt-8 font-display font-bold text-[32px] text-[#111827] text-center leading-tight">
        Sign in isn&apos;t set up
      </h1>
      <p className="mt-2 max-w-[400px] font-body text-base text-[#9CA3AF] text-center">
        This build runs on your OpenAI key only. There is no hosted
        account—go straight to planning.
      </p>

      <div className="mt-10 flex w-full max-w-[400px] flex-col gap-3">
        <Link
          href="/plan"
          className="flex h-[52px] items-center justify-center rounded-[12px] bg-primary font-body text-base font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Plan a trip
        </Link>
        <Link
          href="/home"
          className="flex h-[52px] items-center justify-center rounded-[12px] border border-neutral-200 font-body text-base font-semibold text-[#111827] transition-colors hover:bg-neutral-50"
        >
          Home
        </Link>
        <p className="mt-4 text-center font-body text-sm text-[#9CA3AF]">
          Need an account later?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Sign up
          </Link>{" "}
          is disabled for now.
        </p>
      </div>
    </div>
  );
}
