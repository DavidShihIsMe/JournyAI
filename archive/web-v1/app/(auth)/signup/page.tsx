"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signUp, signInWithGoogle, resendVerification } from "@/lib/services/auth";
import {
  validateSignupForm,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDisplayName,
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

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Verification screen state
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Field errors (only shown when touched)
  const displayNameError = touched.displayName ? validateDisplayName(displayName) : null;
  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmPasswordError = touched.confirmPassword
    ? validateConfirmPassword(password, confirmPassword)
    : null;

  const strength = password.length > 0 ? getPasswordStrength(password) : null;
  const formErrors = validateSignupForm(displayName, email, password, confirmPassword);
  const hasErrors = formErrors.length > 0;

  const clearError = useCallback(() => {
    if (error) setError("");
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ displayName: true, email: true, password: true, confirmPassword: true });
    clearError();

    if (hasErrors) return;

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await signUp(
        supabase,
        email.trim(),
        password,
        displayName.trim()
      );

      if (signUpError) {
        const mapped = mapAuthError(signUpError.message, "signup");
        if (mapped === "ALREADY_REGISTERED") {
          setError("");
          // Render inline with link
          setError("ALREADY_REGISTERED");
        } else {
          setError(mapped);
        }
        setLoading(false);
        return;
      }

      // Show verification screen
      setVerificationEmail(email.trim());
      setShowVerification(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    clearError();

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

  async function handleResend() {
    setResending(true);
    try {
      const supabase = createClient();
      await resendVerification(supabase, verificationEmail);
      setResendCooldown(60);
    } catch {
      // Silently fail
    }
    setResending(false);
  }

  // Email verification screen
  if (showVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{verificationEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account, then come back to log in.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
            >
              {resending
                ? "Sending..."
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend verification email"}
            </Button>
          </CardContent>
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

  const isLoading = loading || googleLoading;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Create an account to start planning trips
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error banner */}
          {error && error !== "ALREADY_REGISTERED" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {error === "ALREADY_REGISTERED" && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              An account with this email already exists.{" "}
              <Link href="/login" className="underline underline-offset-2">
                Try logging in instead.
              </Link>
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
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, displayName: true }))}
                disabled={isLoading}
              />
              {displayNameError && (
                <p className="text-xs text-destructive">{displayNameError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
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
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                disabled={isLoading}
              />
              {passwordError && (
                <p className="text-xs text-destructive">{passwordError}</p>
              )}
              {/* Strength indicator */}
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
                onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                disabled={isLoading}
              />
              {confirmPasswordError && (
                <p className="text-xs text-destructive">{confirmPasswordError}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || hasErrors}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="w-full text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
