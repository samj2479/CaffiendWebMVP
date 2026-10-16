"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

const ORDER_URL = "/order";
const ORDER_GREEN = "#174C35";
const HIDDEN_PATHS = ["/notice/allergy", "/en/notice/allergy", "/brand/dessert-friends", "/en/brand/dessert-friends", "/menu/souffle-guide", "/en/menu/souffle-guide"];
const EXPANDED_FONT = "clamp(0.75rem, 2.2vw, 2.1rem)";
const LABEL_REVEAL_TRANSITION = "opacity 0.12s ease 0.38s, visibility 0s linear 0.38s";

export default function OrderButton() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [size, setSize] = useState(0);       // 0 = not yet measured (SSR-safe sentinel)
  const [isMobile, setIsMobile] = useState(false);
  const [isOnGreenSection, setIsOnGreenSection] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  // Measure on mount (client-only — window is available here)
  useEffect(() => {
    function measure() {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(mobile);
      setSize(mobile ? 72 : Math.round(Math.min(Math.max(window.innerWidth * 0.18, 80), 192)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Match the section beneath the control, including partial scroll positions.
  useEffect(() => {
    if (size === 0) return;
    const container = document.getElementById("scroll-container");
    const section = document.getElementById("dessert-friends-intro");
    let frame = 0;
    const update = () => {
      frame = 0;
      const button = ref.current;
      if (!button || !section) {
        setIsOnGreenSection(false);
        return;
      }
      const buttonRect = button.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const centerY = buttonRect.top + buttonRect.height / 2;
      setIsOnGreenSection(centerY >= sectionRect.top && centerY < sectionRect.bottom);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (section) observer.observe(section);
    container?.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      container?.removeEventListener("scroll", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [pathname, size]);

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
  const inverted = (pathname === "/" || pathname === "/en") && isOnGreenSection;
  const expandedWidth = isMobile ? "min(420px, calc(100vw - 2rem))" : "min(680px, 88vw)";
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
        right: isMobile ? "1rem" : "2rem",
        height: `${size}px`,
        width: expanded ? expandedWidth : `${size}px`,
        borderRadius: `${radius}px`,
        background: inverted ? "#fff" : ORDER_GREEN,
        boxShadow: "0 4px 24px rgba(23,76,53,0.4)",
        cursor: "pointer",
        color: inverted ? ORDER_GREEN : "#fff",
        zIndex: 50,
        overflow: "hidden",
        textDecoration: "none",
        transition: "width 0.38s cubic-bezier(0.34, 1.4, 0.64, 1)",
      }}
    >
      {/* Expanded text */}
      <span style={{
        position: "absolute", right: 0, top: 0, bottom: 0,
        width: expandedWidth,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "0 24px" : 0,
        whiteSpace: isMobile ? "normal" : "nowrap",
        textAlign: "center",
        lineHeight: isMobile ? 1.3 : undefined,
        fontSize: isMobile ? "18px" : EXPANDED_FONT,
        fontFamily: "var(--font-lato), system-ui, sans-serif",
        fontWeight: 600, color: "inherit",
        opacity: expanded ? 1 : 0,
        visibility: expanded ? "visible" : "hidden",
        transition: expanded ? LABEL_REVEAL_TRANSITION : "none",
        pointerEvents: "none", zIndex: 1,
      }}>
        {isMobile ? <>
          <span>{lang === "ko" ? "카페에 계시다면?" : "At the Cafe?"}</span>
          <span>{lang === "ko" ? "테이블에서 주문하기" : "Order from your table"}</span>
        </> : long}
      </span>

      {/* Circle label */}
      <span style={{
        position: "absolute", right: 0, top: 0,
        width: `${size}px`, height: `${size}px`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "2px", color: "inherit", zIndex: 2,
        opacity: expanded ? 0 : 1,
        visibility: expanded ? "hidden" : "visible",
        transition: expanded ? "none" : LABEL_REVEAL_TRANSITION,
      }}>
        <span style={{ fontSize: `${Math.round(size * 0.28)}px`, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>QR</span>
        <span style={{ fontSize: `${Math.round(size * 0.28)}px`, fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>
          {lang === "ko" ? "주문" : "Order"}
        </span>
      </span>
    </a>
  );
}
