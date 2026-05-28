"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthDivider from "@/components/auth/AuthDivider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validate() {
    let ok = true;
    if (!email) {
      setEmailError("Email is required");
      ok = false;
    } else if (!EMAIL_RE.test(email)) {
      setEmailError("Enter a valid email address");
      ok = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      ok = false;
    } else {
      setPasswordError("");
    }
    return ok;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    router.push("/home");
  }

  async function handleGoogle() {
    setFormError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });
    if (error) {
      setGoogleLoading(false);
      setFormError(error.message);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center px-5 pt-[140px] pb-16">
      <Link
        href="/"
        className="font-display font-bold text-[28px] text-primary leading-none"
      >
        Journy
      </Link>

      <h1 className="mt-8 font-display font-bold text-[32px] text-[#111827] text-center leading-tight">
        Welcome back
      </h1>
      <p className="mt-2 font-body text-base text-[#9CA3AF] text-center">
        Sign in to see your traveler profile.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 w-full max-w-[400px] flex flex-col"
      >
        {formError && (
          <div className="mb-4 rounded-[10px] border border-error/30 bg-error/10 px-4 py-3 font-body text-sm text-error">
            {formError}
          </div>
        )}

        <AuthInput
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          aria-label="Email"
        />

        <div className="h-4" />

        <AuthInput
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          aria-label="Password"
        />

        <div className="mt-1 flex justify-end">
          <Link
            href="/forgot-password"
            className="font-body text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-6">
          <AuthButton loading={loading} loadingText="Signing in...">
            Sign In
          </AuthButton>
        </div>

        <div className="mt-6">
          <AuthDivider />
        </div>

        <div className="mt-6">
          <GoogleButton loading={googleLoading} onClick={handleGoogle} />
        </div>

        <p className="mt-8 text-center font-body text-sm text-[#9CA3AF]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
