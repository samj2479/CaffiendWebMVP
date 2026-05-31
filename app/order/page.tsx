"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TABLES = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TableSelectPage() {
  const router = useRouter();
  const [lang, setLangState] = useState<"ko" | "en">("ko");
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("caffiend-order-lang");
    if (saved === "en") setLangState("en");
  }, []);

  function setLang(l: "ko" | "en") {
    setLangState(l);
    localStorage.setItem("caffiend-order-lang", l);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-lg overflow-hidden">

        {/* Brand header */}
        <div className="bg-[#174C35] px-8 pt-8 pb-7">
          <p className="font-sans text-white/50 text-[11px] tracking-[0.2em] uppercase mb-2">
            {lang === "ko" ? "카피엔드 주문" : "Caffiend Order"}
          </p>
          <h1 className="font-serif text-white text-3xl font-bold leading-tight">
            CAFFIEND
          </h1>
          <p className="font-sans text-white/60 text-sm mt-3 leading-relaxed">
            {lang === "ko"
              ? "테이블마다 다른 QR을 부착해두었습니다.\n스캔한 테이블 번호로 주문이 전달됩니다."
              : "Each table has a unique QR code.\nYour order will be sent with your table number."}
          </p>
        </div>

        {/* Table selection */}
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-1">
            <p className="font-sans text-base font-semibold text-[#0D0D0D]">
              {lang === "ko" ? "테이블 번호를 선택하세요" : "Select your table number"}
            </p>
            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === "ko" ? "en" : "ko")}
              className="font-sans text-sm font-bold bg-[#174C35] text-white px-3 py-1.5 rounded-full transition-all hover:bg-[#0f3d2b]"
            >
              {lang === "ko" ? "EN" : "한국어"}
            </button>
          </div>
          <p className="font-sans text-sm text-[#999] mb-7">
            {lang === "ko" ? "앉아 계신 테이블 번호를 눌러주세요." : "Tap the number of the table you're sitting at."}
          </p>

          <div className="grid grid-cols-4 gap-3">
            {TABLES.map((n) => {
              const isSelected = selected === n;
              return (
                <button
                  key={n}
                  onClick={() => {
                    if (selected) return;
                    setSelected(n);
                    setTimeout(() => router.push(`/order/${n}`), 200);
                  }}
                  style={{
                    transform: isSelected ? "scale(0.9)" : "scale(1)",
                    backgroundColor: isSelected ? "#0f3d2b" : "#174C35",
                    transition: "transform 0.1s ease, background-color 0.1s ease",
                    outline: isSelected ? "3px solid #fff" : "none",
                    outlineOffset: "-3px",
                  }}
                  className="aspect-square flex items-center justify-center"
                >
                  <span className="font-serif text-3xl font-bold text-white leading-none">
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <p className="font-sans text-sm text-[#bbb]">
            {lang === "ko" ? "도움이 필요하시면 직원에게 문의해주세요 ☕" : "Ask staff if you need any help ☕"}
          </p>
        </div>
      </div>
    </div>
  );
}
