"use client";

import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

const krFont = { fontFamily: "var(--font-noto-kr), var(--font-lato), sans-serif" };

export default function HeroSection() {
  const { lang } = useLanguage();
  const isEn = lang === "en";

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0">
        <Image
          src={`/${encodeURIComponent("strawberry souffle.png")}`}
          alt=""
          fill
          className="object-cover"
          priority
          quality={60}
          sizes="100vw"
          style={{ filter: "blur(18px) brightness(0.75) saturate(1.3)", transform: "scale(1.08)" }}
          aria-hidden
        />
      </div>

      {/* Sharp centered image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={`/${encodeURIComponent("strawberry souffle.png")}`}
            alt="Caffiend strawberry soufflé"
            fill
            className="object-contain"
            priority
            quality={90}
            sizes="100vw"
            style={{ opacity: 0.90 }}
          />
        </div>
      </div>

      {/* Left + right edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(13,13,13,0.72) 0%, transparent 22%, transparent 78%, rgba(13,13,13,0.72) 100%)",
        }}
      />

      {/* Top + bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0.30) 0%, rgba(13,13,13,0.02) 40%, rgba(13,13,13,0.10) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full pt-24 md:pt-36 pb-12 md:pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Since 2022 — top left, above CAFFIEND */}
          <p
            className="hero-fade-1 font-serif font-bold text-cream mb-3"
            style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", letterSpacing: "0.12em" }}
          >
            Since 2022
          </p>

          {/* Giant heading */}
          <div className="hero-fade-2 mb-8">
            <div>
              <h1
                className="font-serif font-bold text-cream leading-[0.9]"
                style={{ fontSize: "clamp(5rem, 15vw, 13rem)", letterSpacing: "-0.02em" }}
              >
                CAFFIEND
              </h1>
              {/* 카피엔드 — below CAFFIEND, right-aligned but ends before D */}
              <p
                className="font-serif font-bold text-cream tracking-[0.3em] text-right mt-2"
                style={{ ...krFont, fontSize: "clamp(0.75rem, 2vw, 1.6rem)", paddingRight: "clamp(2%, 21%, 21%)" }}
              >
                카피엔드
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
