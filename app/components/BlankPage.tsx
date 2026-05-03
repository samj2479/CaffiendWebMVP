"use client";
import { useState, useEffect, ReactNode } from "react";
import { useLanguage } from "../context/LanguageContext";
import FooterSection from "./FooterSection";

type Position = "top-left" | "top-center";

export default function BlankPage({
  ko,
  en,
  animate = false,
  position = "top-left",
  children
}: {
  ko: string;
  en: string;
  animate?: boolean;
  position?: Position;
  children?: ReactNode;
}) {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState(animate ? 0 : 2); // 0: hidden, 1: visible center, 2: final position

  useEffect(() => {
    if (!animate) return;
    // Phase 1: Fade in at center
    const t1 = setTimeout(() => setPhase(1), 100);
    // Phase 2: Move to final position
    const t2 = setTimeout(() => setPhase(2), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [animate]);

  const getFinalStyle = () => {
    if (position === "top-center") {
      return { top: "clamp(90px, 12vh, 140px)", left: "50%", transform: "translateX(-50%)" };
    }
    // top-left
    return { top: "clamp(90px, 12vh, 140px)", left: "clamp(1.25rem, 5vw, 80px)", transform: "translate(0, 0)" };
  };

  const finalStyle = getFinalStyle();

  return (
    <main>
      <section className="min-h-screen flex bg-white relative">
        <h1
          className="font-serif font-bold text-caramel absolute z-40"
          style={{
            opacity: phase === 0 ? 0 : 1,
            fontSize: phase === 2 ? "clamp(2rem, 4vw, 3rem)" : "clamp(2.5rem, 6vw, 5rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            top: phase === 2 ? finalStyle.top : "50%",
            left: phase === 2 ? finalStyle.left : "50%",
            transform: phase === 2 ? finalStyle.transform : "translate(-50%, -50%)",
            transition: animate ? "all 1s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
          }}
        >
          {lang === "ko" ? ko : en}
        </h1>
      </section>

      {children && (
        <section className="bg-white py-12 md:py-20 px-5 md:px-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </section>
      )}

      <FooterSection />
    </main>
  );
}
