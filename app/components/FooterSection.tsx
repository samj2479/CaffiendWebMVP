"use client";
import { useT } from "../i18n/useT";
import { useLanguage } from "../context/LanguageContext";

const krFont = { fontFamily: "var(--font-noto-kr), var(--font-lato), sans-serif" };

const footerLinks = [
  { labelKo: "브랜드 이야기", labelEn: "Brand Story",    href: "/#story"   },
  { labelKo: "메뉴",          labelEn: "Menu",            href: "/#menu"    },
  { labelKo: "예약",          labelEn: "Reservation",     href: "/#reserve" },
  { labelKo: "찾아오시는 길", labelEn: "Location",        href: "/#visit"   },
  { labelKo: "공지",          labelEn: "Notice",          href: "/#notice"  },
];

const hours = [
  {
    dayKo: "월 – 금", dayEn: "Mon – Fri",
    timeKo: "12:00 – 21:00", timeEn: "12:00 – 21:00",
    noteKo: "라스트오더 20:30", noteEn: "Last order 20:30",
  },
  {
    dayKo: "토요일", dayEn: "Saturday",
    timeKo: "12:00 – 21:00", timeEn: "12:00 – 21:00",
    noteKo: "라스트오더 20:30", noteEn: "Last order 20:30",
  },
  {
    dayKo: "일요일", dayEn: "Sunday",
    timeKo: "14:00 – 20:00", timeEn: "14:00 – 20:00",
    noteKo: "라스트오더 19:30", noteEn: "Last order 19:30",
  },
];

export default function FooterSection() {
  const t = useT();
  const { lang } = useLanguage();

  // Keep footer links on the correct language site
  const h = (href: string) =>
    lang === "en"
      ? href.startsWith("/#") ? "/en" + href.slice(1) : "/en" + href
      : href;

  return (
    <footer id="contact" style={{ background: "#0A0A0A" }}>
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-8 md:pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

        {/* Brand column */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <p className="font-serif text-3xl text-cream mb-4">Caffiend</p>
          <p className="font-sans text-cream/70 text-sm mb-6" style={krFont}>
            {t("눈꽃빙수·수플레", "Snowflake Bingsu · Soufflé")}
          </p>
          <a
            href="https://instagram.com/caffiend__"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-xs text-sienna hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @caffiend__
          </a>
        </div>

        {/* Opening Hours */}
        <div>
          <p className="font-sans text-cream/50 text-xs tracking-[0.2em] uppercase mb-5">
            {t("운영 시간", "Hours")}
          </p>
          <div className="space-y-3">
            {hours.map((row, i) => (
              <div key={i}>
                <p className="font-sans text-cream/70 text-xs">{lang === "ko" ? row.dayKo : row.dayEn}</p>
                <p className="font-sans text-cream/50 text-xs">{lang === "ko" ? row.timeKo : row.timeEn}</p>
                <p className="font-sans text-cream/30 text-xs">{lang === "ko" ? row.noteKo : row.noteEn}</p>
              </div>
            ))}
            <p className="font-sans text-sienna/80 text-xs mt-4 leading-relaxed" style={krFont}>
              {t(
                "운영시간이 바뀔 수 있습니다. 최신 공지 & 네이버지도 공지를 꼭 확인해 주세요.",
                "Hours may change. Please check the latest notice & Naver Maps for updates."
              )}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="font-sans text-cream/50 text-xs tracking-[0.2em] uppercase mb-5">
            {t("연락처", "Contact")}
          </p>
          <div className="space-y-3">
            <div>
              <p className="font-sans text-cream/35 text-xs mb-1">{t("전화", "Phone")}</p>
              <a href="tel:0507-1366-4878" className="font-sans text-cream/70 text-xs hover:text-white transition-colors">
                0507-1366-4878
              </a>
            </div>
            <div>
              <p className="font-sans text-cream/35 text-xs mb-1">{t("인스타그램", "Instagram")}</p>
              <a href="https://instagram.com/caffiend__" target="_blank" rel="noopener noreferrer"
                className="font-sans text-cream/70 text-xs hover:text-white transition-colors">
                @caffiend__
              </a>
            </div>
            <div>
              <p className="font-sans text-cream/35 text-xs mb-1">{t("위치", "Location")}</p>
              <p className="font-sans text-cream/70 text-xs">{t("경북 포항시 북구 천마로 103", "103, Cheonma-ro, Buk-gu")}</p>
              <p className="font-sans text-cream/35 text-xs">{t("포항시, 대한민국", "Pohang-si, Republic of Korea")}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div>
          <p className="font-sans text-cream/50 text-xs tracking-[0.2em] uppercase mb-5">
            {t("카피엔드", "Caffiend")}
          </p>
          <div className="space-y-2">
            {footerLinks.map((link, i) => (
              <div key={i}>
                <a href={h(link.href)} className="font-sans text-cream/55 text-xs hover:text-white transition-colors">
                  {lang === "ko" ? link.labelKo : link.labelEn}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/8 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-sans text-cream/20 text-xs" style={krFont}>
              {t(
                "대표: 김미진 | 사업자등록번호: 464-05-02376",
                "CEO: Kim Mi-jin | Business Reg. No.: 464-05-02376"
              )}
            </p>
            <p className="font-sans text-cream/20 text-xs">
              {t(
                "© 2022 카피엔드",
                "© 2022 Caffiend"
              )}
            </p>
          </div>
          <p className="font-serif italic text-cream/20 text-xs">
            {t(
              "배워서 남주자 — 배우고 익혀서, 아낌없이 나눕니다.",
              "Learn to give — study deeply, share generously."
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
