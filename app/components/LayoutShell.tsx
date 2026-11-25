"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Nav from "./Nav";
import ScrollAnimationObserver from "./ScrollAnimationObserver";
import ScrollProgressBar from "./ScrollProgressBar";
import OrderButtonClient from "./OrderButtonClient";
import ScrollToTop from "./ScrollToTop";
import ScrollSnapController from "./ScrollSnapController";
import { PublicInformationProvider } from "./PublicInformationContext";

export default function LayoutShell({ children, publicInformation, qrInformation }: { children: React.ReactNode; publicInformation?: React.ReactNode; qrInformation?: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith("/order") || pathname.startsWith("/admin");
  const hideOrderButton = /^\/(?:en\/)?(?:menu\/(?:prices|details)|policies|games)(?:\/|$)/.test(pathname);

  useEffect(() => {
    if (isAppRoute) {
      document.body.classList.remove("overflow-hidden");
    } else {
      document.body.classList.add("overflow-hidden");
    }
  }, [isAppRoute]);

  if (isAppRoute) {
    return <PublicInformationProvider content={qrInformation ?? publicInformation}>{children}</PublicInformationProvider>;
  }

  return (
    <>
      <Nav />
      <ScrollAnimationObserver />
      <ScrollProgressBar />
      {!hideOrderButton && <OrderButtonClient />}
      <ScrollToTop />
      <ScrollSnapController />
      <div
        id="scroll-container"
        style={{ height: "100vh", overflowY: "scroll" }}
      >
        {children}
        {publicInformation}
      </div>
    </>
  );
}
