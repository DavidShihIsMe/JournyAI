import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
        <Link href="/" className="font-display font-black text-2xl text-primary">
          Journy
        </Link>

        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
          <span className="text-primary text-2xl">&#9993;</span>
        </div>

        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">
            Check your email
          </h1>
          <p className="mt-2 font-body text-sm text-neutral-600">
            We sent a verification link to your email address. Click it to
            activate your account.
          </p>
        </div>

        <Link
          href="/login"
          className="h-[52px] rounded-[12px] bg-primary px-8 flex items-center font-body text-base font-semibold text-white hover:bg-primary-dark transition-colors"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
