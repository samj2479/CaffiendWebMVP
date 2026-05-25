"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;

    function onScroll() {
      setVisible(container!.scrollTop > 300);
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    const container = document.getElementById("scroll-container");
    if (!container) return;

    if (isHome) {
      container.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const start = container.scrollTop;
    const duration = 600;
    let startTime: number | null = null;

    function easeOutExpo(t: number) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollTop = start * (1 - easeOutExpo(progress));
      container.dispatchEvent(new Event("scroll", { bubbles: false }));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: isHome ? "#fff" : "#174C35",
        border: "none",
        boxShadow: isHome
          ? "0 4px 16px rgba(0,0,0,0.25)"
          : "0 4px 16px rgba(23,76,53,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: isHome ? "#000" : "#fff",
        zIndex: 50,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12V4M4 7l4-4 4 4" />
      </svg>
    </button>
  );
}
