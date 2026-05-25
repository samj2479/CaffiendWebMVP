"use client";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const ORDER_URL = "https://caffiend-qr-fh.web.app/";
const SIZE = 192;
const RADIUS = SIZE / 2;

export default function OrderButton() {
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState(false);

  const long =
    lang === "ko"
      ? "카페에 계시다면? 테이블에서 주문하기"
      : "At the Cafe? Order from your table";

  return (
    <a
      href={ORDER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={long}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "7rem",
        right: "2rem",
        height: `${SIZE}px`,
        width: hovered ? "min(680px, 88vw)" : `${SIZE}px`,
        borderRadius: `${RADIUS}px`,
        background: "#174C35",
        boxShadow: "0 4px 24px rgba(23,76,53,0.4)",
        cursor: "pointer",
        color: "#fff",
        zIndex: 50,
        overflow: "hidden",
        textDecoration: "none",
        transition: "width 0.38s cubic-bezier(0.34, 1.4, 0.64, 1)",
      }}
    >
      {/* Extended text — spans full width, circle z-index covers the overlap */}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          fontSize: "2.1rem",
          fontFamily: "var(--font-lato), system-ui, sans-serif",
          fontWeight: 600,
          color: "#fff",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease 0.15s",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {long}
      </span>

      {/* Circle face — always anchored to the right, fades out on hover */}
      <span
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          color: "#fff",
          zIndex: 2,
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.18s ease",
        }}
      >
        <span style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>QR</span>
        <span style={{ fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2, fontFamily: "var(--font-lato), system-ui, sans-serif" }}>{lang === "ko" ? "주문" : "Order"}</span>
      </span>
    </a>
  );
}
