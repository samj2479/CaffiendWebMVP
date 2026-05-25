"use client";

import { useLanguage } from "../context/LanguageContext";

const itemsKo = [
  "✦ 정성껏 손수 만든",
  "✦ 배워서 남주자",
  "✦ 언제나 무료 레슨",
  "✦ 제철 국내산 재료",
  "✦ 포항 · 양덕",
  "✦ 2022년 12월 개업",
  "✦ 신선하고 건강하게",
  "✦ 낯선 이로 오셔서 가족으로",
];

const itemsEn = [
  "✦ Handcrafted with care",
  "✦ Learn to give",
  "✦ Free lessons always",
  "✦ Seasonal Korean ingredients",
  "✦ Pohang · Yangdeok",
  "✦ Est. December 2022",
  "✦ Fresh and wholesome",
  "✦ Come as strangers, leave as family",
];

export default function Marquee() {
  const { lang } = useLanguage();
  const items = lang === "en" ? itemsEn : itemsKo;
  const repeated = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-4 border-y border-caramel/20"
      style={{ background: "linear-gradient(90deg, #174C35 0%, #0D3224 100%)" }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="marquee-item font-sans text-xs tracking-[0.22em] uppercase text-cream/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
