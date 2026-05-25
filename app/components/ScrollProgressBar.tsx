"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollProgressBar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en";
  const [progress, setProgress] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Track scroll progress
  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, clientHeight } = container;
      const footer = container.querySelector("footer#contact") as HTMLElement | null;
      const max = footer
        ? footer.offsetTop - clientHeight
        : container.scrollHeight - clientHeight;
      setProgress(max > 0 ? scrollTop / max : 0);
    };

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Detect dark hero section (non-home pages only — home page is always dark)
  useEffect(() => {
    if (isHome) { setIsDark(true); return; }
    setIsDark(false);
    const hero = document.querySelector("#home");
    if (!hero) return;

    let darkCount = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { darkCount += e.isIntersecting ? 1 : -1; });
        setIsDark(darkCount > 0);
      },
      { threshold: 0.2 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname, isHome]);

  const atBottom = progress > 1;
  const atTop = progress <= 0;
  const fillColor = isDark ? "#fff" : "#174C35";
  const trackColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(23,76,53,0.15)";

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        right: 16,
        top: "50%",
        transform: "translateY(-50%)",
        opacity: atBottom || atTop ? 0 : 1,
        transition: "opacity 300ms ease",
      }}
    >
      <div style={{ width: 6, height: 160, position: "relative", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: trackColor, transition: "background 400ms ease" }} />
        <div
          style={{
            position: "absolute", top: 0, left: 0, width: "100%",
            height: `${Math.min(progress, 1) * 100}%`,
            background: fillColor,
            transition: "background 400ms ease",
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
}
