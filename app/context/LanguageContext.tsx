"use client";

import { createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";

type Lang = "ko" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ko",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Language is purely determined by URL — no state, no localStorage, no flash.
  const lang: Lang = pathname.startsWith("/en") ? "en" : "ko";

  const setLang = (l: Lang) => {
    if (l === lang) return;
    if (l === "en") {
      // "/#story" → "/en#story",  "/menu" → "/en/menu"
      const target = pathname === "/" ? "/en" : "/en" + pathname;
      router.push(target);
    } else {
      const target = pathname.replace(/^\/en/, "") || "/";
      router.push(target);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
