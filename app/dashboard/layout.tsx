"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser, signOut } from "@/lib/services/auth";
import { getProfile } from "@/lib/services/profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [initials, setInitials] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    getCurrentUser(supabase).then(async ({ user }) => {
      if (!user) return;
      const { data: profile } = await getProfile(supabase, user.id);
      if (profile?.display_name) {
        const parts = profile.display_name.trim().split(/\s+/);
        setInitials(
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase()
        );
      }
    });
  }, []);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await signOut(supabase);
    router.push("/login");
    router.refresh();
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <nav className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          {/* Left — brand */}
          <Link href="/dashboard" className="text-lg font-bold">
            Itinerary.AI
          </Link>

          {/* Center — nav links */}
          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              My Trips
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Profile
            </Link>
          </div>

          {/* Right — avatar menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
            >
              {initials || "??"}
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                {/* Dropdown */}
                <div className="absolute right-0 z-50 mt-2 w-40 rounded-md border border-border bg-background py-1 shadow-lg">
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-muted"
                  >
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
