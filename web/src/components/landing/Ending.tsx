"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { syncQuizWithSupabase } from "@/lib/quizSync";
import {
  INK,
  INK2,
  INK3,
  INK4,
  OXBLOOD,
  PAPER,
  PAPER2,
  PAPER3,
  MONO,
  SANS,
  SERIF,
} from "./brand";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FinalCTAProps {
  onStart: () => void;
  onSample: () => void;
}

export function FinalCTA({ onStart, onSample }: FinalCTAProps) {
  return (
    <section
      style={{
        padding: "120px 40px 140px",
        background: INK,
        color: PAPER,
        borderBottom: `1px solid ${INK}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/journy/passport-stamp.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -80,
          bottom: -80,
          width: 520,
          opacity: 0.06,
          pointerEvents: "none",
          filter: "invert(1)",
        }}
      />

      <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontFamily: SANS,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#E8DCC1AA",
            marginBottom: 28,
          }}
        >
          <span style={{ width: 40, borderTop: `1px solid ${PAPER3}` }} />
          Colophon
          <span style={{ width: 40, borderTop: `1px solid ${PAPER3}` }} />
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontWeight: 900,
            fontVariationSettings: '"opsz" 144',
            fontSize: "clamp(48px, 7vw, 104px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: PAPER,
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}
        >
          The shelf is{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400, color: "#E8DCC1" }}>waiting</span>{" "}
          for your volume.
        </h2>

        <p
          style={{
            margin: "32px auto 0",
            maxWidth: 560,
            fontFamily: SERIF,
            fontSize: 19,
            lineHeight: 1.55,
            color: "#E8DCC1CC",
            textWrap: "pretty" as React.CSSProperties["textWrap"],
          }}
        >
          <em>Twelve statements, a notation, a guidebook.</em> It takes less time than brewing a
          second pot.
        </p>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onStart}
            style={{
              fontFamily: SANS,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "20px 36px",
              background: PAPER,
              color: INK,
              border: `1.5px solid ${PAPER}`,
              borderRadius: 0,
              cursor: "pointer",
              transition: "background 120ms, color 120ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = PAPER;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = PAPER;
              e.currentTarget.style.color = INK;
            }}
          >
            Take the Notation →
          </button>
          <a
            href="#archive"
            onClick={(e) => {
              e.preventDefault();
              onSample();
            }}
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 16,
              color: "#E8DCC1CC",
              textDecoration: "underline",
              textUnderlineOffset: 5,
              textDecorationThickness: "0.5px",
            }}
          >
            — or peek at a sample first
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const COLUMNS: Array<[string, string[]]> = [
    ["The Guidebook", ["Take the quiz", "The sixteen", "Sample dossier", "Pricing"]],
    ["Editors", ["About us", "Our method", "Voice & style", "Press"]],
    ["Readers", ["Sign in", "Your shelf", "Printed edition", "Gift a volume"]],
    ["Fine print", ["Privacy", "Terms", "Contact", "Colophon"]],
  ];

  return (
    <footer style={{ padding: "60px 40px 48px", background: PAPER, color: INK }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="journy-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
            gap: 48,
            paddingBottom: 48,
            borderBottom: `1px solid ${INK}`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 900,
                fontSize: 44,
                fontVariationSettings: '"opsz" 144',
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}
            >
              Journy
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: SANS,
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: INK3,
              }}
            >
              Est. MMXXV · Vol. I · No. 1
            </div>
            <p
              style={{
                margin: "22px 0 0",
                maxWidth: 280,
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.55,
                color: INK2,
              }}
            >
              — a pocket guidebook, issued on demand, for travelers who prefer a point of view.
            </p>
          </div>

          {COLUMNS.map(([head, items]) => (
            <div key={head}>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: INK,
                  marginBottom: 18,
                }}
              >
                {head}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item} style={{ padding: "7px 0" }}>
                    <a
                      href="#"
                      style={{
                        fontFamily: SERIF,
                        fontSize: 15,
                        color: INK2,
                        textDecoration: "none",
                        borderBottom: `0.5px solid transparent`,
                        transition: "border-color 120ms",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderBottomColor = INK2;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderBottomColor = "transparent";
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            © MMXXVI · Journy Editorial Ltd.
          </div>
          <div
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 12, color: INK3 }}
          >
            — set in Fraunces, Inter, and DM Mono. Printed on uncoated cream.
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            usejourny.com
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setFormError("");
    setLoading(false);
    setGoogleLoading(false);
  }, [open]);

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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    if (data?.session) {
      await syncQuizWithSupabase(supabase, data.session.user.id);
    }
    onClose();
    router.refresh();
    router.push("/home");
  }

  async function handleGoogle() {
    setFormError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/home` },
    });
    if (error) {
      setGoogleLoading(false);
      setFormError(error.message);
    }
  }

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(27, 26, 24, 0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "journyFadeIn 220ms cubic-bezier(.2,0,0,1)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: PAPER,
          width: "100%",
          maxWidth: 460,
          border: `1px solid ${INK}`,
          padding: "36px 40px 32px",
          position: "relative",
          animation: "journyLift 320ms cubic-bezier(.2,0,0,1)",
        }}
      >
        <div
          style={{
            margin: "-36px -40px 28px",
            padding: "10px 22px",
            borderBottom: `1px solid ${INK}`,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: SANS,
            fontSize: 9.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK,
          }}
        >
          <span>Journy</span>
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 11,
              letterSpacing: "0.04em",
              textTransform: "none",
              color: INK2,
            }}
          >
            — readers&rsquo; entrance —
          </span>
          <span>Vol. I</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: INK3,
            }}
          >
            Sign in
          </div>
          <h3
            style={{
              margin: "10px 0 6px",
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 32,
              fontVariationSettings: '"opsz" 80',
              lineHeight: 1.05,
            }}
          >
            Return to your shelf.
          </h3>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: INK3 }}>
            — your notation &amp; saved guidebooks await.
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}
        >
          {formError ? (
            <p
              style={{
                margin: 0,
                padding: "8px 12px",
                border: `1px solid ${OXBLOOD}`,
                background: `${OXBLOOD}14`,
                color: OXBLOOD,
                fontFamily: SERIF,
                fontSize: 13,
                lineHeight: 1.45,
              }}
            >
              {formError}
            </p>
          ) : null}

          <ModalField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="reader@journy.co"
            value={email}
            onChange={(v) => {
              setEmail(v);
              if (emailError) setEmailError("");
            }}
            error={emailError}
          />
          <ModalField
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder=""
            value={password}
            onChange={(v) => {
              setPassword(v);
              if (passwordError) setPasswordError("");
            }}
            error={passwordError}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "14px 22px",
              background: loading ? INK3 : INK,
              color: PAPER,
              border: `1.5px solid ${INK}`,
              borderRadius: 0,
              cursor: loading ? "not-allowed" : "pointer",
              textAlign: "center",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Signing in..." : "Continue →"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "6px 0",
              color: INK3,
            }}
          >
            <span style={{ flex: 1, borderTop: `0.5px solid ${INK4}` }} />
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 12 }}>or</span>
            <span style={{ flex: 1, borderTop: `0.5px solid ${INK4}` }} />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              fontFamily: SANS,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "12px 18px",
              background: PAPER,
              color: INK,
              border: `1px solid ${INK}`,
              borderRadius: 0,
              cursor: googleLoading ? "not-allowed" : "pointer",
              textAlign: "center",
              opacity: googleLoading ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <GoogleGlyph />
            <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 6,
              fontFamily: SERIF,
              fontSize: 12,
              color: INK3,
            }}
          >
            <Link href="/forgot-password" onClick={onClose} style={{ color: INK3 }}>
              Forgot password?
            </Link>
          </div>
        </form>

        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: `0.5px solid ${INK4}`,
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 13,
            color: INK3,
          }}
        >
          — a first-time reader?{" "}
          <Link
            href="/signup"
            onClick={onClose}
            style={{ color: OXBLOOD, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Create an account
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: SERIF,
            fontSize: 22,
            color: INK2,
            padding: 4,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function ModalField({
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  type: "email" | "password";
  autoComplete: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label
        style={{
          fontFamily: SANS,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK2,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        style={{
          width: "100%",
          marginTop: 6,
          padding: "12px 12px",
          background: PAPER2,
          border: `1px solid ${error ? OXBLOOD : INK}`,
          borderRadius: 0,
          fontFamily: SERIF,
          fontSize: 15,
          color: INK,
          boxSizing: "border-box",
          outline: "none",
        }}
      />
      {error ? (
        <p style={{ margin: "4px 0 0", fontFamily: SERIF, fontSize: 12, color: OXBLOOD }}>{error}</p>
      ) : null}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
