"use client";
import { useLanguage } from "../context/LanguageContext";
import FooterSection from "./FooterSection";

export default function BlankPage({ ko, en }: { ko: string; en: string }) {
  const { lang } = useLanguage();
  return (
    <main>
      <section className="min-h-screen flex items-center justify-center bg-white">
        <h1
          className="font-serif font-bold text-caramel"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          {lang === "ko" ? ko : en}
        </h1>
      </section>
      <FooterSection />
    </main>
  );
}
