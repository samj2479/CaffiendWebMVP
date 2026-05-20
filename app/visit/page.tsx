"use client";
import { useLanguage } from "../context/LanguageContext";
import FooterSection from "../components/FooterSection";

export default function Page() {
  const { lang } = useLanguage();

  return (
    <main>
      <section className="min-h-screen flex flex-col bg-white relative pt-[100px] md:pt-[140px] px-4 sm:px-6 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto w-full">
          {/* Title */}
          <h1
            className="font-serif font-bold text-caramel text-center"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {lang === "ko" ? "위치 보기" : "View Location"}
          </h1>

          {/* Location Info - Center */}
          <div className="mt-12 md:mt-16 space-y-4 text-center">
            <div>
              <span className="font-sans font-semibold text-sm text-black/50 block mb-1">
                {lang === "ko" ? "도로명 주소" : "Street Address"}
              </span>
              <p className="font-sans text-base text-black/80">
                {lang === "ko"
                  ? "경북 포항시 북구 천마로 103 카피엔드"
                  : "103 Cheonma-ro, Buk-gu, Pohang-si, Gyeongsangbuk-do, Caffiend"}
              </p>
            </div>

            <div>
              <span className="font-sans font-semibold text-sm text-black/50 block mb-1">
                {lang === "ko" ? "지번 주소" : "Lot Address"}
              </span>
              <p className="font-sans text-base text-black/80">
                {lang === "ko"
                  ? "경북 포항시 북구 양덕동 1321"
                  : "1321 Yangdeok-dong, Buk-gu, Pohang-si, Gyeongsangbuk-do"}
              </p>
            </div>

            <div>
              <span className="font-sans font-semibold text-sm text-black/50 block mb-1">
                {lang === "ko" ? "우편번호" : "Postal Code"}
              </span>
              <p className="font-sans text-base text-black/80">
                37587
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://naver.me/FW6ze5Jq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-sm text-white bg-[#03C75A] hover:bg-[#02b351] px-4 py-2 rounded-full transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                {lang === "ko" ? "네이버 지도로 보기" : "View on Naver Map"}
              </a>
            </div>
          </div>

          {/* Map Image - Center */}
          <div className="mt-10 md:mt-12 flex justify-center">
            <img
              src="/Location%20Caffiend.png"
              alt={lang === "ko" ? "카피엔드 위치 지도" : "Caffiend Location Map"}
              className="max-w-full md:max-w-2xl rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
