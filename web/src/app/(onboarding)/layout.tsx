"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";

const PROGRESS_MAP: Record<string, number> = {
  "/quiz": 20,
  "/interests": 75,
  "/type-reveal": 100,
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const progress = PROGRESS_MAP[pathname] ?? 0;
  const showProgress = pathname !== "/type-reveal";

  return (
    <div className="min-h-full flex flex-col bg-white">
      {/* Header */}
      <header className="w-full px-6 pt-4 pb-2">
        <div className="max-w-[500px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-black text-lg text-primary"
          >
            Journy
          </Link>
        </div>
        {showProgress && (
          <div className="max-w-[500px] mx-auto mt-3">
            <ProgressBar progress={progress} />
          </div>
        )}
      </header>

      {/* Content — centered, narrow like Typeform */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-[500px]">{children}</div>
      </main>
    </div>
  );
}
