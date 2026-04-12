"use client";
import { useEffect, useRef } from "react";

const DURATION = 1200; // ms — scroll animation duration

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function scrollToY(targetY: number, onDone: () => void) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  if (Math.abs(diff) < 2) { onDone(); return; }
  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    window.scrollTo(0, startY + diff * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
    else onDone();
  };
  requestAnimationFrame(step);
}

export default function SectionScroller() {
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const getSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("section, footer#contact"));

    const getCurrentIndex = (sections: HTMLElement[]) => {
      const mid = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      sections.forEach((s, i) => { if (s.offsetTop <= mid) idx = i; });
      return idx;
    };

    const goTo = (index: number) => {
      const sections = getSections();
      if (index < 0 || index >= sections.length || isAnimating.current) return;
      isAnimating.current = true;
      scrollToY(sections[index].offsetTop, () => { isAnimating.current = false; });
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sections = getSections();
      const cur = getCurrentIndex(sections);
      goTo(e.deltaY > 0 ? cur + 1 : cur - 1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;
      const sections = getSections();
      const cur = getCurrentIndex(sections);
      goTo(delta > 0 ? cur + 1 : cur - 1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(e.key)) return;
      e.preventDefault();
      const sections = getSections();
      const cur = getCurrentIndex(sections);
      goTo(["ArrowDown", "PageDown"].includes(e.key) ? cur + 1 : cur - 1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
