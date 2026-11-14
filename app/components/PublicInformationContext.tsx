"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { CookiePreferences } from "./AnalyticsConsent";

type InformationLanguage = "ko" | "en";

const PublicInformationContext = createContext<ReactNode>(null);
const QrInformationLanguageContext = createContext<InformationLanguage | null>(null);

/** Server-rendered information is placed inside each QR screen without a client DB read. */
export function PublicInformationProvider({ content, children }: { content?: ReactNode; children: ReactNode }) {
  return <PublicInformationContext.Provider value={content}>{children}</PublicInformationContext.Provider>;
}

export function useQrInformationLanguage() {
  return useContext(QrInformationLanguageContext);
}

export function QrOrderInformation({ lang, className = "" }: { lang: InformationLanguage; className?: string }) {
  const information = useContext(PublicInformationContext);
  useEffect(() => {
    window.dispatchEvent(new Event("caffiend:order-language"));
  }, [lang]);
  return (
    <QrInformationLanguageContext.Provider value={lang}>
      <section lang={lang} aria-label={lang === "ko" ? "주문·사업자 안내" : "Order and business information"}
        className={`min-w-0 border-t border-[#174C35]/15 bg-[#FAF7F2] px-4 py-5 text-left font-sans text-xs leading-6 text-[#174C35] ${className}`}>
        <p className="font-semibold">
          {lang === "ko" ? "주문한 메뉴는 직원이 테이블로 직접 서빙합니다." : "Staff serve your ordered items directly to your table."}
        </p>
        <p className="mt-1">
          {lang === "ko"
            ? "실제 조리·제조 시작 전 취소·환불은 매장 직원에게 요청해 주세요. 주문 접수만으로 조리가 시작된 것으로 보지 않습니다."
            : "For cancellation or a refund before preparation actually begins, please ask café staff. Order acceptance alone does not mean preparation has started."}
        </p>
        <div className="my-3 min-w-0">{information}</div>
        <div className="min-w-0 border-t border-[#174C35]/15 pt-3 [overflow-wrap:anywhere]">
          <p>{lang === "ko" ? "카피엔드 · 대표 김미진" : "Caffiend · Representative Kim Mi-jin"}</p>
          <p>{lang === "ko" ? "사업자등록번호: 464-05-02376" : "Business registration: 464-05-02376"}</p>
          <p>{lang === "ko" ? "경북 포항시 북구 천마로 103" : "103, Cheonma-ro, Buk-gu, Pohang-si, Republic of Korea"}</p>
          <a href="tel:0507-1366-4878" className="underline underline-offset-4">0507-1366-4878</a>
        </div>
        <div className="mt-4"><CookiePreferences lang={lang} /></div>
      </section>
    </QrInformationLanguageContext.Provider>
  );
}
