"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Nav from "./Nav";
import ScrollAnimationObserver from "./ScrollAnimationObserver";
import ScrollProgressBar from "./ScrollProgressBar";
import OrderButtonClient from "./OrderButtonClient";
import ScrollToTop from "./ScrollToTop";
import ScrollSnapController from "./ScrollSnapController";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith("/order") || pathname.startsWith("/admin");

  useEffect(() => {
    if (isAppRoute) {
      document.body.classList.remove("overflow-hidden");
    } else {
      document.body.classList.add("overflow-hidden");
    }
  }, [isAppRoute]);

  if (isAppRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <ScrollAnimationObserver />
      <ScrollProgressBar />
      <OrderButtonClient />
      <ScrollToTop />
      <ScrollSnapController />
      <div
        id="scroll-container"
        style={{ height: "100vh", overflowY: "scroll" }}
      >
        {children}
      </div>
    </>
  );
}
