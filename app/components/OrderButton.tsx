"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

const ORDER_URL = "/order";
const HIDDEN_PATHS = ["/notice/allergy", "/en/notice/allergy"];
const EXPANDED_FONT = "clamp(0.75rem, 2.2vw, 2.1rem)";

export default function OrderButton() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [size, setSize] = useState(0);       // 0 = not yet measured (SSR-safe sentinel)
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  // Measure on mount (client-only — window is available here)
  useEffect(() => {
    function measure() {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(mobile);
      setSize(mobile ? 34 : Math.round(Math.min(Math.max(window.innerWidth * 0.18, 80), 192)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Close on outside click (mobile expand mode)
  useEffect(() => {
    if (!isMobile || !expanded) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, expanded]);

  // Hide on certain pages or before client measurement
  if (HIDDEN_PATHS.includes(pathname) || size === 0) return null;

  const radius = size / 2;
  const expandedWidth = isMobile ? "calc(100vw - 4rem)" : "min(680px, 88vw)";
  const long = lang === "ko"
    ? "카페에 계시다면? 테이블에서 주문하기"
    : "At the Cafe? Order from your table";

  function handleClick(e: React.MouseEvent) {
    if (!isMobile) return;
    if (!expanded) { e.preventDefault(); setExpanded(true); }
  }

  return (
    <a
      ref={ref}
      href={ORDER_URL}
      aria-label={long}
      onClick={handleClick}
      onMouseEnter={() => { if (!isMobile) setExpanded(true); }}
      onMouseLeave={() => { if (!isMobile) setExpanded(false); }}
      style={{
        position: "fixed",
        bottom: "calc(3rem + 56px)",
        right: "2rem",
        height: `${size}px`,
        width: expanded ? expandedWidth : `${size}px`,
        borderRadius: `${radius}px`,
        background: "#174C35",
        boxShadow: "0 4px 24px rgba(23,76,53,0.4)",
        cursor: "pointer",
        color: "#fff",
        zIndex: 50,
        overflow: "hidden",
        textDecoration: "none",
        transition: "width 0.38s cubic-bezier(0.34, 1.4, 0.64, 1)",
      }}
    >
      {/* Expanded text */}
      <span style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        whiteSpace: "nowrap",
        fontSize: EXPANDED_FONT,
        fontFamily: "var(--font-lato), system-ui, sans-serif",
        fontWeight: 600, color: "#fff",
        opacity: expanded ? 1 : 0,
        transition: "opacity 0.2s ease 0.15s",
        pointerEvents: "none", zIndex: 1,
      }}>
        {long}
      </span>

      {/* Circle label */}
      <span style={{
        position: "absolute", right: 0, top: 0,
        width: `${size}px`, height: `${size}px`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "2px", color: "#fff", zIndex: 2,
        opacity: expanded ? 0 : 1,
        transition: "opacity 0.18s ease",
      }}>
        <span style={{ fontSize: `${Math.round(size * 0.28)}px`, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>QR</span>
        <span style={{ fontSize: `${Math.round(size * 0.28)}px`, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>
          {lang === "ko" ? "주문" : "Order"}
        </span>
      </span>
    </a>
  );
}
