"use client";

import Image from "next/image";
import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
import DessertFriendsSection from "./components/DessertFriendsSection";
import FooterSection from "./components/FooterSection";
import { useT } from "./i18n/useT";

/* ─────────────────────────────────────────────
   Section: CEO's Story
───────────────────────────────────────────── */
const timeline = [
  {
    years: "1993 – 1999",
    titleKo: "유치원 교사",
    titleEn: "Kindergarten Teacher",
    descKo: "6년간 어린 마음들을 돌보며, 만나는 아이 한 명 한 명에게 따뜻함과 호기심, 그리고 창의성의 씨앗을 심었습니다.",
    descEn: "For six years she nurtured young minds, planting seeds of warmth, curiosity, and creativity in every child she met.",
    icon: "🌱",
  },
  {
    years: "2000년대 초 · Early 2000s",
    titleKo: "한국 정부 커피 교육 프로그램",
    titleEn: "Korean Gov't Coffee Education Program",
    descKo: "가르침보다 더 깊은 부름 — 국가 교육 프로그램을 통해 커피의 예술과 과학, 그리고 영혼을 발견했습니다.",
    descEn: "A calling deeper than teaching — through a national education program she discovered the art, science, and soul of coffee.",
    icon: "☕",
  },
  {
    years: "2013 – 2022",
    titleKo: "교육 및 사회 봉사",
    titleEn: "Education & Community Service",
    descKo: "장애인, 예비 카페 창업자, 부모님들에게 아낌없이 지식을 나눴습니다. 언제나 베풀고, 언제나 가르쳤습니다.",
    descEn: "She shared knowledge freely with people with disabilities, aspiring café owners, and parents. Always giving, always teaching.",
    icon: "🤝",
  },
  {
    years: "2022년 9월 · Sept 2022",
    titleKo: "포항에서의 새 출발",
    titleEn: "A New Beginning in Pohang",
    descKo: "평생의 배움과 나눔에 대한 굳건한 믿음을 안고, 포항 양덕에 새로운 첫걸음을 내디뎠습니다.",
    descEn: "Carrying a lifetime of learning and an unwavering belief in giving back, she took her first step in Yangdeok, Pohang.",
    icon: "🏡",
  },
  {
    years: "2022년 12월 · Dec 2022",
    titleKo: "카피엔드 개업",
    titleEn: "Caffiend Opens",
    descKo: "메뉴 하나당 300개의 달걀을 테스트하고, 수년간 모든 레시피를 완성에 이르기까지 — 카피엔드가 사랑의 결실로 세상에 문을 열었습니다.",
    descEn: "After testing 300 eggs per menu item and years perfecting every recipe — Caffiend opened its doors as the fruit of a life's love.",
    icon: "✨",
  },
];

function StorySection() {
  const t = useT();
  return (
    <section
      id="story"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0">
        <Image
          src={`/${encodeURIComponent("김미경 대표님.png")}`}
          alt=""
          fill
          className="object-cover"
          quality={60}
          sizes="100vw"
          style={{ filter: "blur(18px) brightness(0.65) saturate(1.1)", transform: "scale(1.08)" }}
          aria-hidden
        />
      </div>

      {/* Sharp portrait — pushed right, fades + scales in */}
      <div className="sr-replay story-img absolute inset-0" data-delay="0ms">
        <Image
          src={`/${encodeURIComponent("김미경 대표님.png")}`}
          alt={t("김미경 대표님", "CEO Kim Mi-kyung")}
          fill
          className="object-contain"
          quality={90}
          sizes="100vw"
          style={{ objectPosition: "center center" }}
        />
      </div>

      {/* Left + right edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(13,13,13,0.80) 0%, transparent 30%, transparent 70%, rgba(13,13,13,0.80) 100%)",
        }}
      />

      {/* Top + bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.02) 40%, rgba(13,13,13,0.35) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full pt-24 md:pt-36 pb-12 md:pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p
            className="sr-replay font-serif font-bold mb-3"
            data-delay="100ms"
            style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", letterSpacing: "0.12em", color: "rgba(255,255,255,0.75)" }}
          >
            {t("카피엔드", "Caffiend")}
          </p>
          <h2
            className="sr-replay font-serif font-bold leading-[0.9] mb-6"
            data-delay="350ms"
            style={{ fontSize: "clamp(2.2rem, 9vw, 8rem)", letterSpacing: "-0.02em", color: "#fff" }}
          >
            {t("브랜드 이야기", "Brand Story")}
          </h2>
          <p
            className="sr-replay mb-10 max-w-md leading-relaxed"
            data-delay="600ms"
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", color: "rgba(255,255,255,0.72)" }}
          >
            {t(
              "유치원 교사에서 카피엔드의 대표로 — 배움과 나눔을 바탕으로 한 삶이 오늘의 카피엔드를 만들었습니다.",
              "From kindergarten teacher to the founder of Caffiend — a life built on learning and giving back."
            )}
          </p>
          <a
            href="/brand/founder"
            className="sr-replay inline-block font-sans text-sm tracking-widest uppercase bg-white text-black px-10 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-300"
            data-delay="850ms"
          >
            {t("자세히 보기", "Learn More")}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section Ornament Divider
───────────────────────────────────────────── */
function SectionOrnament() {
  return (
    <div
      className="flex items-center justify-center py-10"
      style={{ background: "#F2F2F2" }}
    >
      <div className="flex items-center gap-5">
        <div className="sr-init sr-expand h-px w-20 bg-sienna/30" style={{ transformOrigin: "right" }} />
        <span className="sr-init sr-fade-up text-sienna/50 text-base" style={{ transitionDelay: "120ms" }}>✦</span>
        <div className="sr-init sr-expand h-px w-20 bg-sienna/30" style={{ transformOrigin: "left" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function Page() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <DessertFriendsSection />
      <div id="page-footer"><FooterSection /></div>
    </main>
  );
}
