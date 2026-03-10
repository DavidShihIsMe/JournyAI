import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg font-semibold">Settings coming soon</p>
      <Link
        href="/dashboard"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
