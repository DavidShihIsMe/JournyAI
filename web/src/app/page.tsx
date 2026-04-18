"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Masthead from "@/components/landing/Masthead";
import Hero from "@/components/landing/Hero";
import Premise from "@/components/landing/Premise";
import Notations from "@/components/landing/Notations";
import Process from "@/components/landing/Process";
import Archive from "@/components/landing/Archive";
import { FinalCTA, Footer, SignInModal } from "@/components/landing/Ending";

export default function LandingPage() {
  const router = useRouter();
  const [signInOpen, setSignInOpen] = useState(false);

  const handleStart = () => {
    router.push("/quiz");
  };

  const handleSample = () => {
    const el = document.getElementById("archive");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div
      className="journy-root journy-paper-texture"
      style={{
        background: "#F2EAD6",
        color: "#1B1A18",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <Masthead onSignIn={() => setSignInOpen(true)} onStart={handleStart} />
        <Hero onStart={handleStart} onSample={handleSample} />
        <Premise />
        <Notations onStart={handleStart} />
        <Process onStart={handleStart} />
        <Archive onSample={handleSample} />
        <FinalCTA onStart={handleStart} onSample={handleSample} />
        <Footer />
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      </div>
    </div>
  );
}
