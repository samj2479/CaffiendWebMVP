"use client";

import Image from "next/image";
import { useEffect } from "react";
import HeroSection from "./components/HeroSection";
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
/* ─────────────────────────────────────────────
   Section: Menu — rotating marquee strip
───────────────────────────────────────────── */
const menuMarqueeImages = [
  "딸기 수플레.png",
  "무화과 수플레.png",
  "복숭아 수플레.png",
  "크림 브륄레 수플레.png",
  "흑임자 수플레.png",
  "인절미 수플레.png",
  "딸기 빙수.png",
  "망고 빙수.png",
  "복숭아 빙수.png",
  "1인 티라미수.png",
  "말차 숲 라떼.png",
  "티라미수볼(코코아 말차 인절미 로투스).png",
];
const doubled = [...menuMarqueeImages, ...menuMarqueeImages];

function MenuSection() {
  const t = useT();
  return (
    <section
      id="menu"
      className="relative h-screen flex flex-col items-center justify-between overflow-hidden"
      style={{ background: "#0D0D0D", paddingTop: "10vh", paddingBottom: "10vh" }}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0">
        <Image
          src={`/${encodeURIComponent("딸기 수플레.png")}`}
          alt=""
          fill
          className="object-cover"
          quality={50}
          sizes="100vw"
          style={{ filter: "blur(22px) brightness(0.45) saturate(1.2)", transform: "scale(1.1)" }}
          aria-hidden
        />
      </div>

      {/* Left + right vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, rgba(13,13,13,0.85) 0%, transparent 25%, transparent 75%, rgba(13,13,13,0.85) 100%)" }}
      />

      {/* Top + bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, #0D0D0D 0%, transparent 30%, transparent 70%, #0D0D0D 100%)" }}
      />

      {/* Title + subtitle */}
      <div className="relative z-20 text-center flex flex-col items-center">
        <h2
          className="sr-replay font-serif font-bold leading-[0.9] text-white mb-3"
          data-delay="100ms"
          style={{ fontSize: "clamp(2rem, 5vh, 5rem)", letterSpacing: "-0.02em" }}
        >
          MENU
        </h2>
        <p
          className="sr-replay max-w-md leading-relaxed text-center"
          data-delay="350ms"
          style={{ fontSize: "clamp(0.8rem, 1.6vh, 1.05rem)", color: "rgba(255,255,255,0.72)" }}
        >
          {t("계절마다 바뀌는 다양한 제철 메뉴들을 고객님들께 선보입니다.", "We present a variety of seasonal menus that change with every season.")}
        </p>
      </div>

      {/* Rotating image strip — plain <img> to prevent lazy-load flicker */}
      <div className="relative z-20 w-full overflow-hidden">
        <div className="marquee-track flex" style={{ animationDuration: "48s" }}>
          {doubled.map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden border border-white/10"
              style={{ width: "clamp(120px, 46vh, 460px)", height: "clamp(120px, 46vh, 460px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/${encodeURIComponent(name)}`}
                alt={name.replace(".png", "")}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA button */}
      <div className="relative z-20">
        <a
          href="/menu"
          className="font-sans text-sm tracking-widest uppercase bg-white text-black px-10 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-300"
        >
          {t("메뉴 상세 바로가기", "View Full Menu")}
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: Visit
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Section: Reserve Order
───────────────────────────────────────────── */
function ReserveSection() {
  const t = useT();

  return (
    <section
      id="reserve"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0">
        <Image
          src={`/${encodeURIComponent("단체주문.png")}`}
          alt=""
          fill
          className="object-cover"
          quality={60}
          sizes="100vw"
          style={{ filter: "blur(18px) brightness(0.55) saturate(1.1)", transform: "scale(1.08)" }}
          aria-hidden
        />
      </div>

      {/* Sharp image */}
      <div className="sr-replay story-img absolute inset-0" data-delay="0ms">
        <Image
          src={`/${encodeURIComponent("단체주문.png")}`}
          alt={t("단체주문", "Group Order")}
          fill
          className="object-cover"
          quality={90}
          sizes="100vw"
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* Left + right vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(13,13,13,0.85) 0%, transparent 40%, transparent 60%, rgba(13,13,13,0.85) 100%)",
        }}
      />

      {/* Top + bottom gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0.45) 0%, rgba(13,13,13,0.05) 40%, rgba(13,13,13,0.05) 60%, rgba(13,13,13,0.45) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full pb-12 md:pb-16 px-6 md:pl-16 md:pr-72">
        <div className="w-full flex justify-start md:justify-end">
          <div>
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
              {t("단체주문", "Group Order")}
            </h2>
            <p
              className="sr-replay mb-10 max-w-md leading-relaxed"
              data-delay="600ms"
              style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", color: "rgba(255,255,255,0.72)" }}
            >
              {t(
                "특별한 날을 더욱 특별하게 — 카피엔드의 단체주문 서비스를 이용해 보세요.",
                "Make special days even more special — try Caffiend's group order service."
              )}
            </p>
            <a
              href="/reserve"
              className="inline-block font-sans text-sm tracking-widest uppercase bg-white text-black px-10 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-300"
            >
              {t("단체주문 예약", "Group Order Reservation")}
            </a>
          </div>
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
      <MenuSection />
      <ReserveSection />
      <div id="page-footer"><FooterSection /></div>
    </main>
  );
}
