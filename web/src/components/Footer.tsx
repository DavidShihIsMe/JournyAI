import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-display font-black text-lg text-primary">
          Journy
        </Link>
        <p className="font-body text-sm text-neutral-400">
          Discover how you really like to travel.
        </p>
      </div>
    </footer>
  );
}
