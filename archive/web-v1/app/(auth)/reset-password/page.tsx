"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updatePassword } from "@/lib/services/auth";
import {
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
  mapAuthError,
} from "@/lib/validation/auth";
import type { PasswordStrength } from "@/lib/validation/auth";
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

const STRENGTH_COLORS: Record<PasswordStrength, string> = {
  weak: "bg-destructive",
  medium: "bg-yellow-500",
  strong: "bg-green-500",
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [expired, setExpired] = useState(false);

  // Check if we have a valid session (Supabase sets it via the URL hash)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is valid for password reset
      }
    });
  }, []);

  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmPasswordError = touched.confirmPassword
    ? validateConfirmPassword(password, confirmPassword)
    : null;
  const strength = password.length > 0 ? getPasswordStrength(password) : null;
  const hasErrors = !!validatePassword(password) || !!validateConfirmPassword(password, confirmPassword);

  // Redirect after success
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      router.push("/login?reset=true");
    }, 2000);
    return () => clearTimeout(timer);
  }, [success, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    setError("");

    if (hasErrors) return;

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await updatePassword(supabase, password);

      if (updateError) {
        const mapped = mapAuthError(updateError.message, "reset");
        if (mapped.includes("expired")) {
          setExpired(true);
        }
        setError(mapped);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Password updated</CardTitle>
            <CardDescription>
              Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Link expired</CardTitle>
            <CardDescription>
              This reset link has expired. Please request a new one.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              href="/forgot-password"
              className="w-full text-center text-sm text-primary underline-offset-4 hover:underline"
            >
              Request new reset link
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
          <CardTitle>Set new password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && !expired && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                disabled={loading}
              />
              {passwordError && (
                <p className="text-xs text-destructive">{passwordError}</p>
              )}
              {strength && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {(["weak", "medium", "strong"] as const).map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          i === 0 || (i === 1 && strength !== "weak") || (i === 2 && strength === "strong")
                            ? STRENGTH_COLORS[strength]
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{strength}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                disabled={loading}
              />
              {confirmPasswordError && (
                <p className="text-xs text-destructive">{confirmPasswordError}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading || hasErrors}>
              {loading ? "Updating..." : "Update password"}
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
