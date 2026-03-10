"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/services/auth";
import { getProfile, getTravelerProfile } from "@/lib/services/profile";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [typeCode, setTypeCode] = useState<string | null>(null);
  const [typeName, setTypeName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    getCurrentUser(supabase).then(async ({ user }) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const [{ data: profile }, { data: travelerProfile }] = await Promise.all([
        getProfile(supabase, user.id),
        getTravelerProfile(supabase, user.id),
      ]);

      setDisplayName(profile?.display_name ?? "Traveler");
      setTypeCode(travelerProfile?.type_code ?? null);
      setTypeName(travelerProfile?.type_name ?? null);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {displayName}</h1>
          {typeCode && typeName && (
            <Link
              href="/dashboard/profile"
              className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20"
            >
              {typeCode} &mdash; {typeName}
            </Link>
          )}
        </div>
        <Link href="/dashboard/trips/new">
          <Button>Create New Trip</Button>
        </Link>
      </div>

      {/* Trip list — empty state for now */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
        <h2 className="text-lg font-semibold">No trips yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your first adventure starts here
        </p>
        <Link href="/dashboard/trips/new" className="mt-6">
          <Button size="lg">Create New Trip</Button>
        </Link>
      </div>
    </div>
  );
}
