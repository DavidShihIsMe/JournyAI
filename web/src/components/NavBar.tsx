import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-black text-xl text-primary">
          Journy
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="font-body text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/quiz"
            className="h-10 rounded-[10px] bg-primary px-5 flex items-center font-body text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
