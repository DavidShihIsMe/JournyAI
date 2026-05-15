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

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function validate() {
    let ok = true;

    if (!firstName.trim()) {
      setFirstNameError("Required");
      ok = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName.trim()) {
      setLastNameError("Required");
      ok = false;
    } else {
      setLastNameError("");
    }

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
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });
    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    if (data.session) {
      router.push("/home");
    } else {
      router.push("/verify-email");
    }
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
        Create your Account
      </h1>
      <p className="mt-2 font-body text-base text-[#9CA3AF] text-center">
        Save your traveler profile and start planning (soon)
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

        <div className="flex flex-col sm:flex-row gap-4">
          <AuthInput
            type="text"
            autoComplete="given-name"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={firstNameError}
            aria-label="First Name"
          />
          <AuthInput
            type="text"
            autoComplete="family-name"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={lastNameError}
            aria-label="Last Name"
          />
        </div>

        <div className="h-4" />

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
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          aria-label="Password"
        />

        <div className="mt-6">
          <AuthButton loading={loading} loadingText="Creating account...">
            Create Account
          </AuthButton>
        </div>

        <div className="mt-6">
          <AuthDivider />
        </div>

        <div className="mt-6">
          <GoogleButton loading={googleLoading} onClick={handleGoogle} />
        </div>

        <p className="mt-8 text-center font-body text-sm text-[#9CA3AF]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
