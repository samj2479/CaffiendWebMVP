"use client";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

const ORDER_URL = "https://caffiend-qr-fh.web.app/";

const DESKTOP = { size: 192, circleFont: "2.25rem", expandedFont: "2.1rem",  expandedWidth: "min(680px, 88vw)", bottom: "7rem"  };
const MOBILE  = { size: 128, circleFont: "1.5rem",  expandedFont: "1.5rem",  expandedWidth: "min(340px, 85vw)", bottom: "5.5rem" };

export default function OrderButton() {
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
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

  const cfg = isMobile ? MOBILE : DESKTOP;
  const { size, circleFont, expandedFont, expandedWidth, bottom } = cfg;
  const radius = size / 2;

  const long =
    lang === "ko"
      ? "카페에 계시다면? 테이블에서 주문하기"
      : "At the Cafe? Order from your table";

  function handleClick(e: React.MouseEvent) {
    if (!isMobile) return; // desktop: href handles navigation normally
    if (!expanded) {
      e.preventDefault();  // first tap: expand, don't navigate
      setExpanded(true);
    }
    // second tap while expanded: let href navigate naturally
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
          fontSize: expandedFont,
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
        <span style={{ fontSize: circleFont, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>QR</span>
        <span style={{ fontSize: circleFont, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>{lang === "ko" ? "주문" : "Order"}</span>
      </span>
    </a>
  );
}
