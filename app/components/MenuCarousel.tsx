"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useT } from "../i18n/useT";

const menuItems = [
  {
    nameKo: "클래식 수플레",
    nameEn: "Classic Soufflé",
    descKo: "오리지널 레시피 — 완벽함을 위해 300개의 달걀을 테스트했습니다",
    descEn: "The original recipe — tested with 300 eggs to achieve perfection",
    image: `/${encodeURIComponent("수플레 사진 1.png")}`,
    imageAlt: "Classic soufflé",
    badgeKo: "시그니처",
    badgeEn: "Signature",
    allergyKo: "(예시) 알러지 정보 없음",
    allergyEn: "(example) No allergy information",
  },
  {
    nameKo: "두바이 초코 수플레",
    nameEn: "Dubai Chocolate Soufflé",
    descKo: "진한 다크 코코아와 말차 크림 — 특별한 창작 메뉴",
    descEn: "Rich dark cocoa with matcha cream — a special creation",
    image: `/${encodeURIComponent("두바이 수플레.png")}`,
    imageAlt: "Dubai chocolate soufflé",
    badgeKo: "스페셜",
    badgeEn: "Special",
    allergyKo: "(예시) 견과류 포함",
    allergyEn: "(example) Contains nuts",
  },
  {
    nameKo: "무화과 수플레",
    nameEn: "Fig Soufflé",
    descKo: "제철 한국 무화과, 가을 한정 메뉴",
    descEn: "Seasonal Korean figs, autumn limited edition",
    image: `/${encodeURIComponent("무화과 수플레.png")}`,
    imageAlt: "Fig soufflé",
    badgeKo: "시즌 한정",
    badgeEn: "Seasonal",
    allergyKo: "(예시) 알러지 정보 없음",
    allergyEn: "(example) No allergy information",
  },
  {
    nameKo: "초코 팬케이크",
    nameEn: "Chocolate Pancake",
    descKo: "초콜릿 크림을 곁들인 폭신한 수플레식 팬케이크",
    descEn: "Fluffy soufflé-style pancake topped with homemade chocolate cream",
    image: `/${encodeURIComponent("초코 수플레.png")}`,
    imageAlt: "Chocolate pancake",
    badgeKo: null,
    badgeEn: null,
    allergyKo: "(예시) 글루텐, 유제품 포함",
    allergyEn: "(example) Contains gluten, dairy",
  },
];

const N = menuItems.length;
const extended = [menuItems[N - 1], ...menuItems, menuItems[0]];

const GAP = 16; // px between cards
const CARD_RATIO = 0.74; // card width as fraction of container

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="flex-shrink-0 w-11 h-11 rounded-full border border-sienna/30 bg-cream flex items-center justify-center text-sienna hover:bg-sienna hover:text-cream hover:border-sienna transition-all duration-200 shadow-sm"
    >
      {direction === "left" ? (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 4l-6 6 6 6" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}

export default function MenuCarousel() {
  const [pos, setPos] = useState(1);
  const [sliding, setSliding] = useState(true);
  const { lang } = useLanguage();
  const t = useT();
  const transitioning = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ card: 0, offset: 0 });

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const card = Math.round(w * CARD_RATIO);
      const offset = Math.round((w - card) / 2);
      setDims({ card, offset });
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const currentIdx = pos <= 0 ? N - 1 : pos >= N + 1 ? 0 : pos - 1;

  const go = (direction: "left" | "right") => {
    if (transitioning.current) return;
    transitioning.current = true;
    setSliding(true);
    setPos((p) => direction === "right" ? p + 1 : p - 1);
  };

  const handleTransitionEnd = () => {
    transitioning.current = false;
    if (pos >= N + 1) {
      setSliding(false);
      setPos(1);
      requestAnimationFrame(() => setSliding(true));
    } else if (pos <= 0) {
      setSliding(false);
      setPos(N);
      requestAnimationFrame(() => setSliding(true));
    }
  };

  const translateX = dims.card
    ? dims.offset - pos * (dims.card + GAP)
    : 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-3 w-full max-w-3xl mx-auto">
        <ArrowButton direction="left" onClick={() => go("left")} />

        {/* Track container — overflow hidden clips side cards */}
        <div ref={containerRef} className="flex-1 overflow-hidden">
          <div
            className="flex"
            style={{
              gap: `${GAP}px`,
              transform: dims.card ? `translateX(${translateX}px)` : undefined,
              transition: sliding
                ? "transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((itm, i) => {
              const isActive = i === pos;
              const badge = lang === "ko" ? itm.badgeKo : itm.badgeEn;

              return (
                <div
                  key={i}
                  className="flex-shrink-0 flex flex-col bg-cream rounded-3xl overflow-hidden"
                  style={{
                    width: dims.card > 0 ? `${dims.card}px` : `${CARD_RATIO * 100}%`,
                    transform: isActive ? "scale(1)" : "scale(0.88)",
                    transformOrigin: "center top",
                    transition: "transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    opacity: isActive ? 1 : 0.55,
                  }}
                >
                  {/* Image */}
                  <div className="relative w-full h-56 md:h-72 flex-shrink-0 overflow-hidden">
                    <Image
                      src={itm.image}
                      alt={itm.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 560px"
                    />
                    {badge && (
                      <span className="absolute top-4 left-4 font-sans text-xs tracking-widest uppercase bg-caramel text-cream px-3 py-1 rounded-full shadow-sm">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col">
                    <h3 className="font-serif text-2xl text-black mb-2">
                      {lang === "ko" ? itm.nameKo : itm.nameEn}
                    </h3>
                    <p className="font-sans text-mocha/65 text-sm leading-relaxed">
                      {lang === "ko" ? itm.descKo : itm.descEn}
                    </p>
                    <div className="mt-5 pt-4 border-t border-latte/60 flex justify-end">
                      <span className="font-sans text-xs text-mocha/30 italic">
                        {lang === "ko" ? itm.allergyKo : itm.allergyEn}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ArrowButton direction="right" onClick={() => go("right")} />
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2">
        {menuItems.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (transitioning.current) return;
              setSliding(true);
              setPos(i + 1);
            }}
            className={`rounded-full transition-all duration-300 ${
              i === currentIdx
                ? "w-6 h-2.5 bg-sienna"
                : "w-2.5 h-2.5 bg-latte hover:bg-sienna/50"
            }`}
            aria-label={`Go to item ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
