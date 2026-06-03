"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { INK, INK2, INK3, OXBLOOD, PAPER, PAPER2, SANS, SERIF } from "@/components/landing/brand";
import { supabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div
      className="journy-root journy-paper-texture mx-auto my-8 max-w-[520px]"
      style={{ background: PAPER, color: INK, border: `1px solid ${INK}` }}
    >
      <div style={{ borderBottom: `1px solid ${INK}`, background: PAPER2, padding: "18px 24px" }}>
        <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: INK3 }}>
          Reader Record · Reset password
        </div>
        <h1 style={{ marginTop: 10, fontFamily: SERIF, fontSize: "clamp(28px, 4.4vw, 44px)", lineHeight: 1.04 }}>
          Forgot your <span style={{ fontStyle: "italic", fontWeight: 400 }}>password</span>?
        </h1>
        <p style={{ marginTop: 10, fontFamily: SERIF, fontSize: 15, lineHeight: 1.5, color: INK2 }}>
          We&apos;ll send you a one-time link to set a new one.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 md:p-8" style={{ background: PAPER }}>
        {sent ? (
          <p
            className="px-3 py-3"
            style={{
              border: `1px solid ${INK3}`,
              background: PAPER2,
              color: INK,
              fontFamily: SERIF,
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            Reset email sent to <strong>{email}</strong>. Check your inbox and click the link to set a new password.
          </p>
        ) : (
          <>
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

            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(v) => {
                setEmail(v);
                if (emailError) setEmailError("");
              }}
              error={emailError}
              required
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
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}

        <Link href="/login" style={{ fontFamily: SERIF, fontSize: 14, color: INK2, marginTop: 4 }}>
          &larr; Back to sign in
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
}: {
  label: string;
  name: string;
  type: "text" | "email" | "password";
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
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
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <span id={`${name}-error`} style={{ fontFamily: SERIF, fontSize: 13, color: OXBLOOD }}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
