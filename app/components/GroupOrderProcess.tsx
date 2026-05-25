"use client";
import { useLanguage } from "../context/LanguageContext";

const steps = [
  {
    ko: "단체 주문 신청",
    en: "Order Submission",
    descKo: "하단 링크로 주문 접수합니다",
    descEn: "Submit your order via the link below",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#174C35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="8" width="32" height="36" rx="3" />
        <line x1="18" y1="18" x2="34" y2="18" />
        <line x1="18" y1="25" x2="34" y2="25" />
        <line x1="18" y1="32" x2="26" y2="32" />
        <path d="M31 30l2.5 2.5L38 27" />
      </svg>
    ),
  },
  {
    ko: "주문 결제 확인",
    en: "Payment Confirmation",
    descKo: "주문 접수 후 결제확인 문자를 보내 드립니다",
    descEn: "We'll send a payment confirmation text after receiving your order",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#174C35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="12" width="36" height="24" rx="4" />
        <path d="M8 20l18 10 18-10" />
        <line x1="26" y1="42" x2="26" y2="36" />
        <line x1="20" y1="42" x2="32" y2="42" />
      </svg>
    ),
  },
  {
    ko: "주문 메뉴 제작",
    en: "Order Preparation",
    descKo: "카피엔드에서 주문된 메뉴들을 제작합니다",
    descEn: "Your ordered items are crafted at Caffiend",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#174C35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 38c0-8 4-14 10-16" />
        <path d="M36 38c0-8-4-14-10-16" />
        <ellipse cx="26" cy="20" rx="8" ry="4" />
        <path d="M14 38h24" />
        <path d="M34 20c2-1 4-1 4 2s-2 4-4 4" />
        <line x1="38" y1="22" x2="42" y2="18" />
        <line x1="40" y1="20" x2="44" y2="20" />
      </svg>
    ),
  },
  {
    ko: "배달 및 수령",
    en: "Delivery & Pickup",
    descKo: "고객님이 기재해주신 장소로 픽업하실 수 있도록 배달해 드립니다",
    descEn: "We deliver to your specified location for pickup",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" stroke="#174C35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="20" width="28" height="16" rx="2" />
        <path d="M34 28h6l6 6v-6h-4" />
        <circle cx="16" cy="38" r="4" />
        <circle cx="38" cy="38" r="4" />
        <line x1="6" y1="28" x2="34" y2="28" />
      </svg>
    ),
  },
];

export default function GroupOrderProcess() {
  const { lang } = useLanguage();

  return (
    <div className="py-8 md:py-14">
      <h2
        className="text-left font-bold mb-12 md:mb-16 text-[#174C35]"
        style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", letterSpacing: "-0.01em" }}
      >
        {lang === "ko" ? "주문 절차" : "Order Process"}
      </h2>

      {/* Desktop: horizontal row */}
      <div className="hidden md:flex items-start justify-center gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start">
            {/* Step card */}
            <div className="flex flex-col items-center text-center w-44 xl:w-52">
              {/* Circle */}
              <div
                className="flex items-center justify-center rounded-full mb-5"
                style={{ width: 108, height: 108, background: "#FAF7F2", border: "2px solid #174C35" }}
              >
                {step.icon}
              </div>

              {/* Label */}
              <p
                className="text-[#174C35] font-semibold mb-2 leading-snug"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "0.88rem" }}
              >
                <span className="text-[#174C35] mr-1">Step {i + 1}.</span>
                {lang === "ko" ? step.ko : step.en}
              </p>

              {/* Description */}
              <p className="text-black leading-relaxed" style={{ fontSize: "0.78rem" }}>
                {lang === "ko" ? step.descKo : step.descEn}
              </p>
            </div>

            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <div className="flex items-center mt-[54px] mx-1 xl:mx-2 flex-shrink-0">
                <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                  <line x1="0" y1="8" x2="28" y2="8" stroke="#7AAF95" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M26 4l6 4-6 4" stroke="#7AAF95" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col items-center gap-0 md:hidden">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="flex items-center gap-5 w-full max-w-sm px-4">
              {/* Circle */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ width: 80, height: 80, background: "#FAF7F2", border: "2px solid #174C35" }}
              >
                <div style={{ transform: "scale(0.75)" }}>{step.icon}</div>
              </div>
              {/* Text */}
              <div>
                <p
                  className="text-[#174C35] font-semibold mb-1 leading-snug"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "0.88rem" }}
                >
                  <span className="text-[#174C35] mr-1">Step {i + 1}.</span>
                  {lang === "ko" ? step.ko : step.en}
                </p>
                <p className="text-black leading-relaxed" style={{ fontSize: "0.78rem" }}>
                  {lang === "ko" ? step.descKo : step.descEn}
                </p>
              </div>
            </div>

            {/* Vertical arrow */}
            {i < steps.length - 1 && (
              <div className="my-3">
                <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
                  <line x1="8" y1="0" x2="8" y2="20" stroke="#7AAF95" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M4 18l4 6 4-6" stroke="#7AAF95" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-12 md:mt-16">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeIHVtuqFlW7piju-yZyt0PWDX_ZN-UUniu87Y5wemfKpymQg/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm tracking-widest uppercase bg-[#174C35] text-white px-10 py-3.5 rounded-full hover:bg-[#0D3224] transition-colors duration-300"
        >
          {lang === "ko" ? "단체 주문 예약 바로가기" : "Make a Group Order Reservation"}
        </a>
      </div>
    </div>
  );
}
