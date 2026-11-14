"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  ANALYTICS_ID, SITE_ANALYTICS_ENABLED, getAnalyticsChoice, getServerAnalyticsChoice, isAnalyticsPage,
  saveAnalyticsChoice, setAnalyticsMeasurementEnabled, subscribeToAnalyticsChoice,
} from "@/lib/privacy/analytics-consent";

const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;
const OPEN_SETTINGS_EVENT = "caffiend:open-cookie-settings";
const subscribeOrderLanguage = (onChange: () => void) => {
  window.addEventListener("caffiend:order-language", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("caffiend:order-language", onChange);
    window.removeEventListener("storage", onChange);
  };
};
const getOrderLanguage = (): "ko" | "en" => {
  try { return window.localStorage.getItem("caffiend-order-lang") === "en" ? "en" : "ko"; }
  catch { return "ko"; }
};
const getServerOrderLanguage = (): "ko" | "en" => "ko";

function openCookieSettings() { window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT)); }

/** Basic opt-in: the Google component is absent until an affirmative choice. */
export default function AnalyticsConsentRuntime() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeToAnalyticsChoice, getAnalyticsChoice, getServerAnalyticsChoice);
  const allowed = SITE_ANALYTICS_ENABLED && choice === "allowed" && isAnalyticsPage(pathname);
  useLayoutEffect(() => {
    setAnalyticsMeasurementEnabled(allowed);
    return () => setAnalyticsMeasurementEnabled(false);
  }, [allowed, pathname]);
  if (!SITE_ANALYTICS_ENABLED) return null;
  return <>{allowed ? <GoogleAnalytics gaId={ANALYTICS_ID} /> : null}<CookieNotice /></>;
}

/** First-visit notice is viewport-fixed; users can decline without leaving their order. */
function CookieNotice() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeToAnalyticsChoice, getAnalyticsChoice, getServerAnalyticsChoice);
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  const orderLanguage = useSyncExternalStore(subscribeOrderLanguage, getOrderLanguage, getServerOrderLanguage);
  const [editing, setEditing] = useState(false);
  const noticeRef = useRef<HTMLElement>(null);
  const order = /^\/order(?:\/|$)/.test(pathname);
  const ko = order ? orderLanguage === "ko" : !pathname.startsWith("/en");
  const visible = hydrated && (choice === "unknown" || editing);
  useLayoutEffect(() => {
    const element = noticeRef.current;
    if (!visible || !element) return;
    const update = () => document.documentElement.style.setProperty(
      "--caffiend-cookie-banner-height", `${Math.ceil(element.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--caffiend-cookie-banner-height");
    };
  }, [visible, pathname]);
  useEffect(() => {
    const open = () => setEditing(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);
  const choose = (next: "allowed" | "declined") => {
    saveAnalyticsChoice(next);
    setEditing(false);
  };
  if (/^\/(?:en\/)?admin(?:\/|$)/.test(pathname)) return null;
  const close = () => choice === "unknown" ? choose("declined") : setEditing(false);
  return (
    <>
      {visible && <section ref={noticeRef} role="region" aria-label={ko ? "쿠키 선택 안내" : "Cookie choices"} data-cookie-notice
        className="fixed inset-x-0 bottom-0 z-[100] flex w-full flex-col overflow-hidden rounded-none border-t-2 border-white/80 bg-[#174C35] text-sm leading-6 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.18)]"
        style={{ maxHeight: order ? "calc(100dvh - 240px)" : "min(70dvh, 420px)" }}>
        <div className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between gap-3 px-5 pt-4 sm:px-8">
          <h2 className="text-base font-bold tracking-wide">{ko ? "쿠키 사용 안내" : "Cookie preferences"}</h2>
          <button type="button" onClick={close}
            aria-label={choice === "unknown" ? (ko ? "통계 사용 없이 닫기" : "Close without analytics") : (ko ? "변경 없이 닫기" : "Close without changes")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-white/70 text-xl text-white hover:bg-white/10">×</button>
        </div>
        <div className="mx-auto min-h-0 w-full max-w-7xl overflow-y-auto px-5 py-2 text-white/95 sm:px-8">
          <p>{ko ? "방문 통계용 선택 쿠키와 Google Analytics는 이용자가 허용한 경우에만 사용한다. 거부하더라도 메뉴 열람과 QR 주문 이용을 제한하지 않는다."
            : "Choose whether to allow optional analytics cookies. Google Analytics loads only after you allow it. Declining does not affect browsing or QR ordering."}</p>
          <p className="mt-1 text-xs text-white/85">{ko ? "선택은 개인정보처리방침의 ‘분석 쿠키 선택 변경’에서 변경하거나 철회할 수 있다."
            : "Change or withdraw your choice using ‘Change analytics cookie choice’ in the Privacy Policy."}</p>
        </div>
        <div className="mx-auto w-full max-w-7xl shrink-0 px-5 pt-2 sm:px-8"
          style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
          <div className="flex gap-3 sm:justify-end">
            <button type="button" onClick={() => choose("allowed")}
              className="min-h-11 min-w-0 flex-1 rounded-none border-2 border-white bg-[#174C35] px-3 py-2 font-bold text-white hover:bg-white/10 sm:min-w-44 sm:flex-none">
              {ko ? "쿠키 허용" : "Allow cookies"}
            </button>
            <button type="button" onClick={() => choose("declined")}
              className="min-h-11 min-w-0 flex-1 rounded-none border-2 border-white bg-[#174C35] px-3 py-2 font-bold text-white hover:bg-white/10 sm:min-w-44 sm:flex-none">
              {ko ? "쿠키 허용 거부" : "Reject cookies"}
            </button>
          </div>
        </div>
      </section>}
    </>
  );
}

/** Footer/QR settings are only available before a choice, without a hydration flash. */
export function CookiePreferences({ lang = "ko" }: { lang?: "ko" | "en" }) {
  const choice = useSyncExternalStore(subscribeToAnalyticsChoice, getAnalyticsChoice, getServerAnalyticsChoice);
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  if (!SITE_ANALYTICS_ENABLED || !hydrated || choice !== "unknown") return null;
  return (
    <div className="mt-4 text-sm text-[#174C35]">
      <button type="button" onClick={openCookieSettings} data-cookie-preferences-trigger className="min-h-11 underline underline-offset-4">
        {lang === "ko" ? "쿠키 설정" : "Cookie settings"}
      </button>
    </div>
  );
}

/** Contextual choice/withdrawal entry placed only inside the privacy policy. */
export function AnalyticsChoiceControl({ lang = "ko" }: { lang?: "ko" | "en" }) {
  if (!SITE_ANALYTICS_ENABLED) return null;
  return (
    <button type="button" onClick={openCookieSettings} data-analytics-choice-control
      className="min-h-11 text-caramel underline underline-offset-4 hover:text-[#0D3224]">
      {lang === "ko" ? "분석 쿠키 선택 변경" : "Change analytics cookie choice"}
    </button>
  );
}
