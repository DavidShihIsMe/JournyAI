"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { resetPassword } from "@/lib/services/auth";
import { validateEmail, mapAuthError } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailError = touched ? validateEmail(email) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError("");

    if (validateEmail(email)) return;

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await resetPassword(
        supabase,
        email.trim(),
        `${window.location.origin}/reset-password`
      );

      if (resetError) {
        setError(mapAuthError(resetError.message, "reset"));
        setLoading(false);
        return;
      }

      // Always show success — don't reveal whether email exists
      setSent(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              If an account exists for that email, we sent a reset link. It may take a few minutes.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="/login"
              className="w-full text-center text-sm text-primary underline-offset-4 hover:underline"
            >
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onBlur={() => setTouched(true)}
                disabled={loading}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading || !!validateEmail(email)}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </CardContent>
        </form>
        <CardFooter>
          <Link
            href="/login"
            className="w-full text-center text-sm text-muted-foreground hover:text-primary"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
