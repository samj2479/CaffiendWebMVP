"use client";
import { Hammer } from "lucide-react";
import { useT } from "../i18n/useT";

export default function UnderConstruction() {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <Hammer size={96} color="#174C35" strokeWidth={1.2} />
      <p
        className="font-serif text-black text-center"
        style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", letterSpacing: "0.01em" }}
      >
        {t("페이지 제작중입니다.", "Page Under Construction")}
      </p>
    </div>
  );
}
