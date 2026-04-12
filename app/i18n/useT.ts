"use client";

import { useLanguage } from "../context/LanguageContext";

/** Returns a translator function: t("한국어", "English") → correct string for current lang */
export function useT() {
  const { lang } = useLanguage();
  return (ko: string, en: string): string => (lang === "ko" ? ko : en);
}
