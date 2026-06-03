"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { INK, INK2, INK3, OXBLOOD, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { supabase } from "@/lib/supabase";
import { syncQuizWithSupabase } from "@/lib/quizSync";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmEmailHint, setConfirmEmailHint] = useState(false);
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
    setConfirmEmailHint(false);
    if (!validate()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    if (data.session) {
      await syncQuizWithSupabase(supabase, data.session.user.id);
      // Take new accounts through the welcome step (display name + age + home city)
      router.push(`/welcome?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    setConfirmEmailHint(true);
  }

  async function handleGoogle() {
    setFormError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${nextPath}` },
    });
    if (error) {
      setGoogleLoading(false);
      setFormError(error.message);
    }
  }

  return (
    <div
      className="journy-root journy-paper-texture mx-auto my-8 max-w-[520px]"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Reader Record · Create account
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(28px, 4.4vw, 44px)", lineHeight: 1.04 }}>
          Start your <span style={{ fontStyle: "italic", fontWeight: 400 }}>Journy</span>
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 15, lineHeight: 1.5, color: INK2 }}>
          Save your traveler profile and start planning trips.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 md:p-8" style={{ background: PAPER }}>
        {formError ? (
          <p
            className="px-3 py-2"
            style={{
              border: `1px solid ${OXBLOOD}`,
              background: `${OXBLOOD}14`,
              color: OXBLOOD,
              fontFamily: SERIF,
              fontSize: 14,
            }}
          >
            {formError}
          </p>
        ) : null}

        {confirmEmailHint ? (
          <p
            className="px-3 py-2"
            style={{
              border: `1px solid ${OXBLOOD}`,
              background: `${OXBLOOD}14`,
              color: OXBLOOD,
              fontFamily: SERIF,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Account created, but email confirmation is on in your Supabase project. Disable it in{" "}
            <strong>Auth → Providers → Email → Confirm email</strong>, then{" "}
            <Link href="/login" style={{ color: OXBLOOD, textDecoration: "underline", fontWeight: 600 }}>
              sign in
            </Link>
            .
          </p>
        ) : null}

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={emailError}
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={passwordError}
          required
          hint="At least 8 characters"
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-4 py-3 transition disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            border: `1.5px solid ${INK}`,
            borderRadius: 0,
            background: loading ? INK3 : INK,
            color: PAPER,
            fontFamily: SANS,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <Divider />

        <GoogleButton loading={googleLoading} onClick={handleGoogle} />

        <Link href="/login" style={{ fontFamily: SERIF, fontSize: 14, color: INK2, marginTop: 4 }}>
          Already have an account? <span style={{ color: INK, fontWeight: 600 }}>Sign in &rarr;</span>
        </Link>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  value,
  onChange,
  error,
  required,
  hint,
}: {
  label: string;
  name: string;
  type: "text" | "email" | "password";
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
}) {
  const inputStyle: CSSProperties = {
    border: `1px solid ${error ? OXBLOOD : INK3}`,
    borderRadius: 0,
    background: PAPER2,
    color: INK,
    fontFamily: SERIF,
    fontSize: 15,
  };
  return (
    <label className="flex flex-col gap-2">
      <span
        style={{
          fontFamily: SANS,
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK3,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 outline-none"
        style={inputStyle}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
      />
      {error ? (
        <span id={`${name}-error`} style={{ fontFamily: SERIF, fontSize: 13, color: OXBLOOD }}>
          {error}
        </span>
      ) : hint ? (
        <span id={`${name}-hint`} style={{ fontFamily: SERIF, fontSize: 13, color: INK3 }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function Divider() {
  return (
    <div className="relative my-1 flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: INK3 }} />
      <span
        className="relative px-3"
        style={{ background: PAPER, fontFamily: SANS, fontSize: 10, letterSpacing: "0.2em", color: INK3, textTransform: "uppercase" }}
      >
        or
      </span>
    </div>
  );
}

function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-3 px-4 py-3 transition disabled:cursor-not-allowed disabled:opacity-70"
      style={{
        border: `1.5px solid ${INK}`,
        borderRadius: 0,
        background: PAPER,
        color: INK,
        fontFamily: SANS,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      <GoogleGlyph />
      <span>{loading ? "Connecting..." : "Continue with Google"}</span>
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8431 2.0782-1.7959 2.7164v2.2581h2.9081c1.7018-1.5668 2.6841-3.874 2.6841-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9081-2.2581c-.806.54-1.8368.8595-3.0483.8595-2.344 0-4.3282-1.5832-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 000 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z"
      />
    </svg>
  );
}
