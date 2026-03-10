"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signIn, signInWithGoogle, getCurrentUser, resendVerification } from "@/lib/services/auth";
import { getTravelerProfile } from "@/lib/services/profile";
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Check URL params for messages
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");

    if (errorParam === "oauth") {
      setError("Google sign-in failed. Please try again or use email instead.");
    }
    if (verified === "true") {
      setSuccessMessage("Email verified. You can now log in.");
    }
    if (reset === "true") {
      setSuccessMessage("Password updated. You can now log in.");
    }
  }, [searchParams]);

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password && !password ? "Password is required." : null;
  const hasErrors = !!validateEmail(email) || !password;

  function clearMessages() {
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
    setShowResendConfirmation(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    clearMessages();

    if (hasErrors) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } = await signIn(supabase, email, password);
      if (signInError) {
        const mapped = mapAuthError(signInError.message, "login");
        if (mapped === "EMAIL_NOT_CONFIRMED") {
          setError("Please check your email and confirm your account before logging in.");
          setShowResendConfirmation(true);
        } else {
          setError(mapped);
        }
        setLoading(false);
        return;
      }

      const { user } = await getCurrentUser(supabase);
      if (!user) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const { data: travelerProfile } = await getTravelerProfile(supabase, user.id);

      if (travelerProfile?.onboarding_completed) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    clearMessages();

    try {
      const supabase = createClient();
      const { url, error: oauthError } = await signInWithGoogle(
        supabase,
        `${window.location.origin}/auth/callback`
      );

      if (oauthError) {
        const mapped = mapAuthError(oauthError.message, "oauth");
        if (mapped !== "OAUTH_CANCELLED") {
          setError(mapped);
        }
        setGoogleLoading(false);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch {
      setError("Google sign-in failed. Please try again or use email instead.");
      setGoogleLoading(false);
    }
  }

  async function handleResendConfirmation() {
    if (!email) return;
    setResending(true);
    try {
      const supabase = createClient();
      await resendVerification(supabase, email);
      setError("");
      setSuccessMessage("Verification email resent. Check your inbox.");
      setShowResendConfirmation(false);
    } catch {
      // Silently fail — don't reveal if email exists
    }
    setResending(false);
  }

  const isLoading = loading || googleLoading;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Success banner */}
          {successMessage && (
            <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
              {successMessage}
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
              {showResendConfirmation && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="mt-1 block text-xs underline underline-offset-2"
                >
                  {resending ? "Sending..." : "Resend confirmation email"}
                </button>
              )}
            </div>
          )}

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearMessages(); }}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearMessages(); }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                disabled={isLoading}
              />
              {passwordError && (
                <p className="text-xs text-destructive">{passwordError}</p>
              )}
              <Link
                href="/forgot-password"
                className="block text-xs text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || hasErrors}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
