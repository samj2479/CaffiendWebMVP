"use client";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

const ORDER_URL = "https://caffiend-qr-fh.web.app/";

const DESKTOP = { size: 192, expandedWidth: "min(680px, 88vw)", bottom: "7rem"  };
const MOBILE  = { size: 128, expandedWidth: "calc(100vw - 4rem)", bottom: "5.5rem" };

const CIRCLE_FONT   = "clamp(1.1rem, 3vw, 2.25rem)";
const EXPANDED_FONT = "clamp(0.85rem, 2.2vw, 2.1rem)";

const HIDDEN_PATHS = ["/notice/allergy", "/en/notice/allergy"];

function getIsMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export default function OrderButton() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const ref = useRef<HTMLAnchorElement>(null);

  // Sync immediately before paint to avoid flash
  useLayoutEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close on outside click (mobile only)
  useEffect(() => {
    if (!isMobile || !expanded) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [isMobile, expanded]);

  if (HIDDEN_PATHS.includes(pathname)) return null;

  const cfg = isMobile ? MOBILE : DESKTOP;
  const { size, expandedWidth, bottom } = cfg;
  const radius = size / 2;

  const long =
    lang === "ko"
      ? "카페에 계시다면? 테이블에서 주문하기"
      : "At the Cafe? Order from your table";

  function handleClick(e: React.MouseEvent) {
    if (!isMobile) return;
    if (!expanded) {
      e.preventDefault();
      setExpanded(true);
    }
  }

  return (
    <a
      ref={ref}
      href={ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={long}
      onClick={handleClick}
      onMouseEnter={() => { if (!isMobile) setExpanded(true); }}
      onMouseLeave={() => { if (!isMobile) setExpanded(false); }}
      style={{
        position: "fixed",
        bottom,
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
      {/* Extended text */}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          fontSize: EXPANDED_FONT,
          fontFamily: "var(--font-lato), system-ui, sans-serif",
          fontWeight: 600,
          color: "#fff",
          opacity: expanded ? 1 : 0,
          transition: "opacity 0.2s ease 0.15s",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {long}
      </span>

      {/* Circle face */}
      <span
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: `${size}px`,
          height: `${size}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          color: "#fff",
          zIndex: 2,
          opacity: expanded ? 0 : 1,
          transition: "opacity 0.18s ease",
        }}
      >
        <span style={{ fontSize: CIRCLE_FONT, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>QR</span>
        <span style={{ fontSize: CIRCLE_FONT, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>{lang === "ko" ? "주문" : "Order"}</span>
      </span>
    </a>
  );
}
