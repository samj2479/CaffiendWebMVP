"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useQrInformationLanguage } from "./PublicInformationContext";
import { CookiePreferences } from "./AnalyticsConsent";

/** Only server-rendered public slots cross this boundary; policy drafts never do. */
export default function PublicInfoRegion({ korean, english, publicEmail }: { korean: ReactNode; english: ReactNode; publicEmail?: string }) {
  const path = usePathname();
  const qrLanguage = useQrInformationLanguage();
  if (path.startsWith("/admin")) return null;
  const isOrder = path.startsWith("/order");
  if (isOrder && !qrLanguage) return null;
  const isEnglish = isOrder ? qrLanguage === "en" : path.startsWith("/en");
  const Region = isOrder ? "aside" : "footer";
  return (
    <Region className={isOrder ? "min-w-0 text-[#174C35]" : "snap-end border-t border-cream/8 bg-[#0A0A0A] py-8 pl-6 pr-28 font-sans text-cream/70 md:pr-64"} aria-label={isEnglish ? "Caffiend information" : "카피엔드 안내"}>
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div lang="ko" hidden={isEnglish}>{korean}</div>
        <div lang="en" hidden={!isEnglish}>{english}</div>
        {publicEmail && <p className="text-xs [overflow-wrap:anywhere]">
          {isEnglish ? "Email " : "전자우편 "}<a href={`mailto:${publicEmail}`} className="underline underline-offset-4">{publicEmail}</a>
        </p>}
        {!isOrder && <div className="[&>div]:mt-0 [&>div]:text-inherit"><CookiePreferences lang={isEnglish ? "en" : "ko"} /></div>}
      </div>
    </Region>
  );
}
