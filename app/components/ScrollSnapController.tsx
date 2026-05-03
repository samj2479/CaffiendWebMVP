"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollSnapController() {
  const pathname = usePathname();

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;
    const isHome = pathname === "/" || pathname === "/en";
    container.style.scrollSnapType = isHome ? "y mandatory" : "none";
  }, [pathname]);

  return null;
}
