"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

const links = [
  {
    href: "/#story",   ko: "브랜드 이야기", en: "Brand Story",
    sub: [
      { href: "/brand/founder",  ko: "대표님 스토리",   en: "Founder's Story" },
      { href: "/brand/story",    ko: "카피엔드 스토리", en: "Caffiend Story"   },
      { href: "/brand/gallery",  ko: "사진첩",          en: "Gallery"          },
    ],
  },
  {
    href: "/#menu",    ko: "메뉴",          en: "Menu",
    sub: [
      { href: "/menu",           ko: "메뉴",            en: "Menu"             },
    ],
  },
  {
    href: "/#reserve", ko: "예약",          en: "Reservation",
    sub: [
      { href: "/reserve",        ko: "단체주문 예약",   en: "Group Reservation" },
    ],
  },
  {
    href: "/#visit",   ko: "찾아오시는 길", en: "Location",
    sub: [
      { href: "/visit",          ko: "위치 보기",       en: "View Location"    },
    ],
  },
  {
    href: "/#notice",  ko: "공지",          en: "Notice",
    sub: [
      { href: "/notice/news",    ko: "새소식",          en: "News"             },
      { href: "/notice/allergy", ko: "알레르기 정보",   en: "Allergy Info"     },
    ],
  },
];

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en";
  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;
    const onScroll = () => setScrolled(container.scrollTop > 60);
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = isHome && !scrolled && !megaOpen;
  const closeMega = () => { setMegaOpen(false); setHoveredIndex(null); };

  // Prefix hrefs with /en when in English so links stay on the correct site.
  // "/#story" → "/en#story",  "/menu" → "/en/menu"
  const h = (href: string) =>
    lang === "en"
      ? href.startsWith("/#") ? "/en" + href.slice(1) : "/en" + href
      : href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">

      {/* ── Nav bar background ─────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-[60px] pointer-events-none"
        style={{
          transition: "background 200ms ease, box-shadow 200ms ease",
          background: scrolled || megaOpen ? "#fff" : "transparent",
          boxShadow: scrolled && !megaOpen ? "0 1px 0 rgba(0,0,0,0.08)" : "none",
        }}
      />

      {/* ── Mega panel background + edge line ──────── */}
      <div
        className="absolute inset-x-0 top-[60px] bg-white"
        style={{
          transition: "opacity 200ms ease",
          height: 160,
          opacity: megaOpen ? 1 : 0,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          pointerEvents: megaOpen ? "auto" : "none",
        }}
        onMouseEnter={() => setMegaOpen(true)}
        onMouseLeave={closeMega}
      />

      {/* ── Desktop: Logo + Right controls ─────────── */}
      <div className="relative hidden md:flex w-full px-16 h-[60px] items-center z-10">
        <a
          href="/"
          style={{ fontFamily: "var(--font-playfair)", color: isDark ? "#fff" : "#000" }}
          className="text-3xl font-bold tracking-wide flex-none transition-colors duration-300"
        >
          Caffiend
        </a>

        <div className="ml-auto flex items-center gap-5">
          <button
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className={`inline-flex items-center justify-center gap-1.5 h-7 px-3 rounded-full border font-sans text-xs font-semibold tracking-wider transition-all duration-300 ${
              isDark
                ? "border-white/50 text-white hover:bg-white hover:text-black"
                : "border-black/40 text-black hover:bg-black hover:text-white"
            }`}
            style={{ minWidth: 90 }}
            aria-label="언어 전환"
          >
            <span key={lang} className="inline-flex items-center gap-1.5 lang-in">
              {lang === "ko" ? <><GlobeIcon />English</> : <>🇰🇷 한국어</>}
            </span>
          </button>

          <a
            href="https://instagram.com/caffiend__"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center border w-7 h-7 rounded-full transition-all duration-300 ${
              isDark
                ? "border-white/50 text-white hover:bg-white hover:text-black hover:scale-105"
                : "border-black/40 text-black hover:bg-black hover:text-white hover:scale-105"
            }`}
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>

      {/* ── Desktop: Unified nav columns ────────────── */}
      <div className="absolute inset-x-0 top-0 hidden md:flex justify-center gap-20 z-20 pointer-events-none">
        {links.map((link, i) => {
          const isActive = hoveredIndex === i && megaOpen;
          return (
            <div
              key={link.href}
              className="flex flex-col min-w-max"
            >
              {/* Nav link inside the 60px bar */}
              <div className="h-[60px] flex items-center pointer-events-auto">
                <a
                  href={h(link.sub[0].href)}
                  style={{ fontFamily: "var(--font-playfair)", transition: "color 200ms ease" }}
                  className={`text-[18px] font-bold tracking-normal whitespace-nowrap ${
                    isActive
                      ? "text-[#7D4E24]"
                      : isDark
                      ? "text-white hover:text-white/70"
                      : "text-black hover:text-black/60"
                  }`}
                  onMouseEnter={() => { setMegaOpen(true); setHoveredIndex(i); }}
                >
                  {lang === "ko" ? link.ko : link.en}
                </a>
              </div>

              {/* Sub-items — fade + slide in, same speed as panel */}
              <div
                className="flex flex-col gap-3 pb-8 pointer-events-auto"
                style={{
                  transition: "opacity 200ms ease, transform 200ms ease",
                  opacity: megaOpen ? 1 : 0,
                  transform: megaOpen ? "translateY(0)" : "translateY(-8px)",
                  pointerEvents: megaOpen ? "auto" : "none",
                }}
                onMouseEnter={() => { setMegaOpen(true); setHoveredIndex(i); }}
                onMouseLeave={closeMega}
              >
                {link.sub.map((item) => (
                  <a
                    key={item.ko}
                    href={h(item.href)}
                    onClick={closeMega}
                    style={{ fontFamily: "var(--font-playfair)" }}
                    className={`text-[14px] whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? "text-[#4A2C1A] hover:text-[#7D4E24]"
                        : "text-black/50 hover:text-[#7D4E24]"
                    }`}
                  >
                    {lang === "ko" ? item.ko : item.en}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile bar ──────────────────────────────── */}
      <div
        className="md:hidden flex items-center justify-between px-5 h-14 transition-colors duration-300"
        style={{ background: isDark ? "transparent" : "#fff" }}
      >
        <a
          href="/"
          style={{ color: isDark ? "#fff" : "#000", fontFamily: "var(--font-playfair)" }}
          className="text-lg font-bold tracking-wide"
        >
          Caffiend
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === "ko" ? "en" : "ko")}
            className={`relative h-7 px-3 rounded-full border font-sans text-[11px] font-semibold overflow-hidden transition-all duration-300 ${
              isDark
                ? "border-white/50 text-white hover:bg-white hover:text-black"
                : "border-black/40 text-black hover:bg-black hover:text-white"
            }`}
            style={{ minWidth: 72 }}
            aria-label="언어 전환"
          >
            <span key={lang} className="block lang-in">
              {lang === "ko"
                ? <span className="inline-flex items-center gap-1.5"><GlobeIcon />English</span>
                : "🇰🇷 한국어"}
            </span>
          </button>

          <button
            className="text-xl leading-none transition-colors duration-300"
            style={{ color: isDark ? "#fff" : "#000" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ─────────────────────────── */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white px-6 pb-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={h(link.sub[0].href)}
              className="block font-sans text-sm text-black hover:text-black/50 transition-colors py-3 border-b border-black/10 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {lang === "ko" ? link.ko : link.en}
            </a>
          ))}
          <a
            href="https://instagram.com/caffiend__"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans text-sm text-black pt-3"
            onClick={() => setMenuOpen(false)}
          >
            <InstagramIcon />
            {lang === "ko" ? "@caffiend__ 인스타그램" : "@caffiend__ Instagram"}
          </a>
        </div>
      </div>
    </nav>
  );
}
