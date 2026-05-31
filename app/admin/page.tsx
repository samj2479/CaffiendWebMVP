"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type Order } from "@/lib/supabase";
import { orderCategories } from "@/app/data/orderMenuData";
import SiteMenuManager from "./SiteMenuManager";
import QRMenuManager from "./QRMenuManager";
import QRDetailsManager from "./QRDetailsManager";

const ADMIN_PIN    = process.env.NEXT_PUBLIC_ADMIN_PIN ?? "2479";
const CONFIG_KEY   = "caffiend-menu-config";

// ─── Types ───────────────────────────────────────────────────
type AdminScreen  = "pin" | "select" | "orders" | "history" | "editor";
type EditorTop    = "site" | "qr";
type SiteSection  = "siteMenu" | "reservation" | "location" | "allergy" | null;
type QRSection    = "items" | "details" | null;

interface MenuConfig {
  prices: Record<string, number>;
  hidden: Record<string, boolean>;
}

// ─── Config helpers ──────────────────────────────────────────
function loadConfig(): MenuConfig {
  if (typeof window === "undefined") return { prices: {}, hidden: {} };
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : { prices: {}, hidden: {} };
  } catch { return { prices: {}, hidden: {} }; }
}
function saveConfig(cfg: MenuConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

// ─── Helpers ─────────────────────────────────────────────────
function fmt(price: number) { return price.toLocaleString("ko-KR") + "원"; }
function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

// ─── Shell ───────────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex justify-center">
      <div className="w-full max-w-lg min-h-screen bg-white flex flex-col shadow-xl overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

// ─── Green header ─────────────────────────────────────────────
function Header({
  title,
  sub,
  right,
  onBack,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className="flex-shrink-0 bg-[#174C35] px-5 pt-5 pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-white/70 hover:text-white transition-colors mt-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div>
            <p className="font-serif text-white text-xl font-bold tracking-wider">CAFFIEND</p>
            {sub && <p className="font-sans text-white/60 text-sm mt-0.5">{sub}</p>}
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}

// ─── Clock ────────────────────────────────────────────────────
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex-shrink-0 px-5 py-2.5 bg-[#F4F0EA] border-b border-black/8 flex items-center justify-between">
      <span className="font-sans text-xs text-[#555] font-semibold">
        {now.getFullYear()}년 {now.getMonth() + 1}월 {now.getDate()}일 ({days[now.getDay()]})
      </span>
      <span className="font-sans text-sm font-bold text-[#174C35] tabular-nums">
        {p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())}
      </span>
    </div>
  );
}

// ─── Order card ───────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { bg: "#174C35", textColor: "#fff",  subColor: "rgba(255,255,255,0.6)", label: "대기 중", dim: false },
  cooking:   { bg: "#92400E", textColor: "#fff",  subColor: "rgba(255,255,255,0.6)", label: "조리 중", dim: false },
  cancelled: { bg: "#7F1D1D", textColor: "#fff",  subColor: "rgba(255,255,255,0.5)", label: "취소됨",  dim: true  },
  completed: { bg: "#e8e8e8", textColor: "#555",  subColor: "#aaa",                  label: "조리 완료", dim: true  },
};

function OrderCard({ order, onCook, onCancel, onDone }: {
  order: Order;
  onCook: (id: string) => void;
  onCancel: (id: string) => void;
  onDone: (id: string) => void;
}) {
  const total = order.items.reduce((s, i) => s + (i.price > 0 ? i.price * i.quantity : 0), 0);
  const cfg   = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.completed;
  return (
    <div className="border overflow-hidden" style={{ borderColor: cfg.dim ? "rgba(0,0,0,0.08)" : cfg.bg, opacity: cfg.dim ? 0.6 : 1 }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: cfg.bg }}>
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl font-bold" style={{ color: cfg.textColor }}>{order.table_number}번</span>
          <div>
            <span className="font-sans text-[10px] font-bold px-2 py-0.5" style={{ backgroundColor: "rgba(255,255,255,0.18)", color: cfg.textColor }}>
              {cfg.label}
            </span>
            <p className="font-sans text-xs mt-0.5" style={{ color: cfg.subColor }}>{timeStr(order.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.status === "pending" && (<>
            <button onClick={() => onCook(order.id)}
              className="font-sans text-xs font-bold px-3 py-2 active:scale-90 active:opacity-70 transition-all duration-100"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)" }}>
              주문 수락
            </button>
            <button onClick={() => onCancel(order.id)}
              className="font-sans text-xs px-3 py-2 active:scale-90 active:opacity-70 transition-all duration-100"
              style={{ color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.25)" }}>
              취소
            </button>
          </>)}
          {order.status === "cooking" && (
            <button onClick={() => onDone(order.id)}
              className="font-sans text-xs font-bold px-3 py-2 active:scale-90 active:opacity-70 transition-all duration-100"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)" }}>
              조리 완료
            </button>
          )}
        </div>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2.5 bg-[#FAF7F2]">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans text-sm font-semibold text-[#0D0D0D]">{item.name}</span>
                <span className="font-sans text-sm font-bold" style={{ color: "#174C35" }}>× {item.quantity}</span>
                {item.temp && <span className="font-sans text-[10px] font-bold px-1.5 py-0.5" style={{ backgroundColor: "#174C35", color: "#fff" }}>{item.temp}</span>}
              </div>
              {item.note && <p className="font-sans text-xs text-[#888] mt-0.5">💬 {item.note}</p>}
            </div>
            {item.price > 0 && <span className="font-sans text-sm text-[#555] flex-shrink-0">{fmt(item.price * item.quantity)}</span>}
          </div>
        ))}
      </div>
      {total > 0 && (
        <div className="px-4 py-2.5 border-t border-black/8 flex justify-between items-center bg-white">
          <span className="font-sans text-xs text-[#888]">합계</span>
          <span className="font-sans text-base font-bold text-[#0D0D0D]">{fmt(total)}</span>
        </div>
      )}
    </div>
  );
}

// ─── Menu editor ──────────────────────────────────────────────
function MenuEditor({ config, onConfigChange }: { config: MenuConfig; onConfigChange: (cfg: MenuConfig) => void }) {
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceInput,   setPriceInput]   = useState("");

  function toggleHidden(ko: string) {
    const next = { ...config, hidden: { ...config.hidden, [ko]: !config.hidden[ko] } };
    onConfigChange(next);
  }

  function startEditPrice(ko: string, currentPrice: number) {
    setEditingPrice(ko);
    setPriceInput(String(config.prices[ko] ?? currentPrice));
  }

  function commitPrice(ko: string) {
    const val = parseInt(priceInput.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(val)) {
      onConfigChange({ ...config, prices: { ...config.prices, [ko]: val } });
    }
    setEditingPrice(null);
  }

  function resetPrice(ko: string) {
    const next = { ...config, prices: { ...config.prices } };
    delete next.prices[ko];
    onConfigChange(next);
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-5">
      {orderCategories.map((cat) => (
        <div key={cat.ko}>
          <h3 className="font-serif text-sm font-bold text-[#174C35] mb-2 pb-1 border-b border-black/8">
            {cat.ko}
          </h3>
          <div className="flex flex-col gap-0">
            {cat.items.map((item) => {
              const isHidden      = !!config.hidden[item.ko];
              const displayPrice  = config.prices[item.ko] ?? item.price;
              const priceChanged  = config.prices[item.ko] !== undefined && config.prices[item.ko] !== item.price;
              const isEditing     = editingPrice === item.ko;

              return (
                <div
                  key={item.ko}
                  className="flex items-center gap-3 py-2.5 border-b border-black/5 last:border-0"
                  style={{ opacity: isHidden ? 0.4 : 1 }}
                >
                  {/* Hide/show toggle */}
                  <button onClick={() => toggleHidden(item.ko)} className="flex-shrink-0 text-[#174C35] hover:opacity-70 transition-opacity">
                    {isHidden ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>

                  {/* Item name */}
                  <p className="flex-1 font-sans text-sm text-[#0D0D0D] min-w-0 truncate">{item.ko}</p>

                  {/* Price */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isEditing ? (
                      <input
                        autoFocus
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        onBlur={() => commitPrice(item.ko)}
                        onKeyDown={(e) => { if (e.key === "Enter") commitPrice(item.ko); if (e.key === "Escape") setEditingPrice(null); }}
                        className="w-24 text-right font-sans text-sm border-b-2 outline-none bg-transparent"
                        style={{ borderColor: "#174C35" }}
                      />
                    ) : (
                      <button
                        onClick={() => startEditPrice(item.ko, item.price)}
                        className="font-sans text-sm text-right hover:underline"
                        style={{ color: priceChanged ? "#174C35" : "#888", fontWeight: priceChanged ? 700 : 400 }}
                      >
                        {displayPrice < 0 ? "변동" : fmt(displayPrice)}
                      </button>
                    )}
                    {priceChanged && !isEditing && (
                      <button onClick={() => resetPrice(item.ko)} className="text-[#aaa] hover:text-red-400 transition-colors ml-1" title="원래 가격으로">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Allergy info (read-only view) ───────────────────────────
function AllergyView() {
  return (
    <div className="px-4 py-5">
      <p className="font-sans text-xs text-[#888] mb-4">
        알레르기 정보 수정은 개발자에게 문의해주세요.
      </p>
      <div className="border border-black/10 overflow-auto" style={{ maxHeight: "70vh" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
          <thead>
            <tr style={{ background: "#174C35" }}>
              {["메뉴", "계란", "우유", "대두", "땅콩", "밀", "복숭아", "흑임자", "밤", "토마토"].map((h) => (
                <th key={h} style={{ padding: "10px 8px", color: "#fff", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", borderRight: "1px solid rgba(255,255,255,0.15)", textAlign: h === "메뉴" ? "left" : "center", position: "sticky", top: 0, background: "#174C35", zIndex: 2 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderCategories.map((cat) => (
              <>
                <tr key={`cat-${cat.ko}`} style={{ background: "#E8F4EF" }}>
                  <td colSpan={10} style={{ padding: "7px 10px", fontWeight: 700, fontSize: 12, color: "#174C35", borderTop: "1px solid #d0e8df" }}>
                    {cat.ko}
                  </td>
                </tr>
                {/* Note: full allergy data is in AllergySheet.tsx — this is a simplified view */}
                {cat.items.map((item, ii) => (
                  <tr key={ii} style={{ background: ii % 2 === 0 ? "#fff" : "#F8FAF9", borderTop: "1px solid #eef2f0" }}>
                    <td style={{ padding: "9px 10px", fontSize: 13, whiteSpace: "nowrap", borderRight: "1px solid #eef2f0" }}>{item.ko}</td>
                    {[...Array(9)].map((_, j) => (
                      <td key={j} style={{ padding: "9px 6px", textAlign: "center", borderRight: "1px solid #eef2f0" }}>—</td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-sans text-xs text-[#bbb] mt-3 text-center">
        상세 알레르기 정보는 QR 주문 페이지 &gt; 알레르기 정보에서 확인하세요.
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function AdminPage() {
  const [pin,       setPin]       = useState("");
  const [authed,    setAuthed]    = useState(false);
  const [pinError,  setPinError]  = useState(false);
  const [screen,    setScreen]    = useState<AdminScreen>("pin");
  const [editorTop,    setEditorTop]    = useState<EditorTop>("site");
  const [siteSection,  setSiteSection]  = useState<SiteSection>(null);
  const [qrSection,    setQRSection]    = useState<QRSection>(null);
  const [orders,       setOrders]      = useState<Order[]>([]);
  const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loading,      setLoading]     = useState(true);
  const [config,       setConfig]      = useState<MenuConfig>({ prices: {}, hidden: {} });
  const [saved,        setSaved]       = useState(false);

  useEffect(() => { setConfig(loadConfig()); }, []);

  const fetchOrders = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (screen !== "orders" || !supabase) return;
    fetchOrders();
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") setOrders((prev) => [payload.new as Order, ...prev]);
        else if (payload.eventType === "UPDATE") setOrders((prev) => prev.map((o) => o.id === payload.new.id ? payload.new as Order : o));
      })
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
  }, [screen, fetchOrders]);

  function handleLogin() {
    if (pin === ADMIN_PIN) { setAuthed(true); setScreen("select"); setPinError(false); }
    else { setPinError(true); setPin(""); }
  }

  function handleLogout() { setAuthed(false); setPin(""); setScreen("pin"); }

  async function updateStatus(id: string, status: Order["status"]) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    setHistoryOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (!supabase) return;
    await supabase.from("orders").update({ status }).eq("id", id);
  }
  const handleCook   = (id: string) => updateStatus(id, "cooking");
  const handleCancel = (id: string) => updateStatus(id, "cancelled");
  const handleDone   = (id: string) => updateStatus(id, "completed");

  const fetchHistory = useCallback(async () => {
    if (!supabase) return;
    setHistoryLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
    if (data) setHistoryOrders(data as Order[]);
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    if (screen !== "history") return;
    fetchHistory();
  }, [screen, fetchHistory]);

  function handleConfigChange(next: MenuConfig) {
    setConfig(next);
    saveConfig(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  // ── PIN screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-white shadow-lg overflow-hidden">
          <div className="bg-[#174C35] px-8 pt-8 pb-7">
            <p className="font-sans text-white/50 text-[11px] tracking-[0.2em] uppercase mb-2">Admin</p>
            <h1 className="font-serif text-white text-3xl font-bold">CAFFIEND</h1>
            <p className="font-sans text-white/60 text-sm mt-2">관리자 로그인</p>
          </div>
          <div className="px-8 py-8 flex flex-col gap-4">
            <input
              type="password" inputMode="numeric" value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="PIN 번호 입력"
              className="w-full text-center font-sans text-lg tracking-widest py-3 px-4 border bg-[#FAF7F2] outline-none transition-all"
              style={{ borderColor: pinError ? "#ef4444" : "rgba(0,0,0,0.15)" }}
              maxLength={8}
            />
            {pinError && <p className="font-sans text-xs text-red-500 text-center -mt-2">PIN 번호가 올바르지 않습니다.</p>}
            <button onClick={handleLogin} className="w-full py-3.5 font-sans font-semibold text-white" style={{ backgroundColor: "#174C35" }}>
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Select screen ───────────────────────────────────────
  if (screen === "select") {
    return (
      <Shell>
        <div className="flex-shrink-0 bg-[#174C35] px-8 pt-8 pb-7">
          <p className="font-sans text-white/50 text-[11px] tracking-[0.2em] uppercase mb-2">Admin</p>
          <h1 className="font-serif text-white text-3xl font-bold">CAFFIEND</h1>
          <p className="font-sans text-white/60 text-sm mt-2">관리자 메뉴</p>
        </div>

        <div className="flex-1 px-6 py-8 flex flex-col gap-4">
          {/* 주문 관리 */}
          <button
            onClick={() => setScreen("orders")}
            className="w-full flex items-center gap-5 p-6 bg-[#FAF7F2] border border-black/10 hover:border-[#174C35] hover:shadow-md transition-all duration-200 group text-left"
          >
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#174C35" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-xl font-bold text-[#0D0D0D] group-hover:text-[#174C35] transition-colors">주문 관리</p>
              <p className="font-sans text-sm text-[#888] mt-0.5">실시간 주문 확인 및 완료 처리</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bbb] group-hover:text-[#174C35] transition-colors flex-shrink-0">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* 주문 내역 */}
          <button
            onClick={() => setScreen("history")}
            className="w-full flex items-center gap-5 p-6 bg-[#FAF7F2] border border-black/10 hover:border-[#174C35] hover:shadow-md transition-all duration-200 group text-left"
          >
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#174C35" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M8 14h4M8 18h8" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-xl font-bold text-[#0D0D0D] group-hover:text-[#174C35] transition-colors">주문 내역</p>
              <p className="font-sans text-sm text-[#888] mt-0.5">날짜별 주문 및 매출 확인</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bbb] group-hover:text-[#174C35] transition-colors flex-shrink-0">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* 사이트 수정 */}
          <button
            onClick={() => setScreen("editor")}
            className="w-full flex items-center gap-5 p-6 bg-[#FAF7F2] border border-black/10 hover:border-[#174C35] hover:shadow-md transition-all duration-200 group text-left"
          >
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#174C35" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-serif text-xl font-bold text-[#0D0D0D] group-hover:text-[#174C35] transition-colors">사이트 수정</p>
              <p className="font-sans text-sm text-[#888] mt-0.5">메뉴 관리, 가격 수정, 알레르기 정보</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bbb] group-hover:text-[#174C35] transition-colors flex-shrink-0">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-8">
          <button onClick={handleLogout} className="w-full py-3 font-sans text-sm text-[#888] border border-black/10 hover:border-black/20 transition-colors">
            로그아웃
          </button>
        </div>
      </Shell>
    );
  }

  // ── Orders screen ───────────────────────────────────────
  if (screen === "orders") {
    const active    = orders.filter((o) => o.status === "pending" || o.status === "cooking");
    const completed = orders.filter((o) => o.status === "completed" || o.status === "cancelled");
    const activeCount = active.filter(o => o.status === "pending").length;
    return (
      <Shell>
        <Header
          title="CAFFIEND" sub="주문 관리"
          onBack={() => setScreen("select")}
          right={
            <div className="flex items-center gap-2 mt-1">
              {activeCount > 0 && (
                <span className="font-sans text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}>
                  {activeCount}건 대기
                </span>
              )}
              <button onClick={handleLogout}
                className="inline-flex items-center justify-center h-9 px-3 rounded-full border font-sans text-xs font-semibold tracking-wider hover:bg-white/15 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>
                로그아웃
              </button>
            </div>
          }
        />
        <Clock />
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
          {/* 진행 중 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-serif text-base font-bold text-[#174C35]">진행 중인 주문</h2>
              {active.length > 0 && <span className="font-sans text-xs font-bold px-2 py-0.5" style={{ backgroundColor: "#174C35", color: "#fff" }}>{active.length}</span>}
            </div>
            {loading ? (
              <p className="text-center font-sans text-sm text-[#888] py-12">불러오는 중...</p>
            ) : active.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-black/15">
                <p className="font-sans text-sm text-[#888]">진행 중인 주문이 없습니다.</p>
                <p className="font-sans text-xs text-[#bbb] mt-1">새 주문이 들어오면 자동으로 표시됩니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {active.map((o) => <OrderCard key={o.id} order={o} onCook={handleCook} onCancel={handleCancel} onDone={handleDone} />)}
              </div>
            )}
          </div>
          {/* 완료 / 취소 — 항상 표시 */}
          {completed.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pt-2 border-t border-black/8">
                <h2 className="font-serif text-base font-bold text-[#888]">완료 / 취소</h2>
                <span className="font-sans text-xs text-[#aaa]">{completed.length}건</span>
              </div>
              <div className="flex flex-col gap-3">
                {completed.map((o) => <OrderCard key={o.id} order={o} onCook={handleCook} onCancel={handleCancel} onDone={handleDone} />)}
              </div>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  // ── History screen ──────────────────────────────────────
  if (screen === "history") {
    const grouped = new Map<string, Order[]>();
    for (const o of historyOrders) {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(o);
    }
    const calcRevenue = (list: Order[]) =>
      list.filter(o => o.status === "completed").reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.price > 0 ? i.price * i.quantity : 0), 0), 0);
    const monthRevenue = calcRevenue(historyOrders);
    const days = ["일","월","화","수","목","금","토"];
    return (
      <Shell>
        <Header title="CAFFIEND" sub="주문 내역" onBack={() => setScreen("select")}
          right={<button onClick={handleLogout} className="inline-flex items-center justify-center h-9 px-3 rounded-full border font-sans text-xs font-semibold hover:bg-white/15 transition-all mt-1" style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>로그아웃</button>}
        />
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
          {/* 월 총 매출 */}
          <div className="p-4 border border-[#174C35]/20 bg-[#174C35]/6">
            <p className="font-sans text-xs text-[#174C35]/70 mb-1">이번 달 완료 주문 매출</p>
            <p className="font-serif text-3xl font-bold text-[#174C35]">{fmt(monthRevenue)}</p>
            <p className="font-sans text-xs text-[#888] mt-1">완료({historyOrders.filter(o=>o.status==="completed").length}건) · 취소({historyOrders.filter(o=>o.status==="cancelled").length}건)</p>
          </div>

          {historyLoading ? (
            <p className="text-center font-sans text-sm text-[#888] py-12">불러오는 중...</p>
          ) : grouped.size === 0 ? (
            <p className="text-center font-sans text-sm text-[#888] py-12">주문 내역이 없습니다.</p>
          ) : (
            Array.from(grouped.entries()).map(([key, dayOrders]) => {
              const d = new Date(key);
              const dayRevenue = calcRevenue(dayOrders);
              const label = `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/8">
                    <span className="font-sans text-sm font-bold text-[#0D0D0D]">{label}</span>
                    <span className="font-sans text-sm font-bold text-[#174C35]">{fmt(dayRevenue)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dayOrders.map((o) => <OrderCard key={o.id} order={o} onCook={handleCook} onCancel={handleCancel} onDone={handleDone} />)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Shell>
    );
  }

  // ── Editor screen ───────────────────────────────────────
  // Determine back handler & subtitle based on depth
  const inSubSection = editorTop === "site" ? siteSection !== null : qrSection !== null;

  function handleEditorBack() {
    if (inSubSection) {
      setSiteSection(null);
      setQRSection(null);
    } else {
      setScreen("select");
    }
  }

  // Sub-section title for header
  const subTitle = inSubSection
    ? editorTop === "site"
      ? ({ siteMenu: "사이트 메뉴 관리", reservation: "단체주문 예약 관리", location: "위치 관리", allergy: "알레르기 정보 관리" } as Record<string,string>)[siteSection!]
      : ({ items: "메뉴 추가/삭제/숨김", details: "메뉴 세부 설정" } as Record<string,string>)[qrSection!]
    : "사이트 수정";

  return (
    <Shell>
      <Header
        title="CAFFIEND"
        sub={subTitle}
        onBack={handleEditorBack}
        right={
          <div className="flex items-center gap-2 mt-1">
            {saved && (
              <span className="font-sans text-xs text-white/80 bg-white/15 px-2.5 py-1 rounded-full">저장됨 ✓</span>
            )}
            <button onClick={handleLogout}
              className="inline-flex items-center justify-center h-9 px-3 rounded-full border font-sans text-xs font-semibold hover:bg-white/15 transition-all"
              style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>
              로그아웃
            </button>
          </div>
        }
      />

      {/* Top-level tabs — only shown when no sub-section is open */}
      {!inSubSection && (
        <div className="flex-shrink-0 flex border-b border-black/15 divide-x divide-black/15">
          {([
            { id: "site", label: "사이트 설정" },
            { id: "qr",   label: "QR 메뉴판 설정" },
          ] as { id: EditorTop; label: string }[]).map(({ id, label }) => (
            <button key={id}
              onClick={() => { setEditorTop(id); setSiteSection(null); setQRSection(null); }}
              className="flex-1 py-3.5 font-sans text-sm font-semibold transition-colors"
              style={editorTop === id ? { backgroundColor: "#174C35", color: "#fff" } : { backgroundColor: "#fff", color: "#555" }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── 사이트 설정 ─── */}
        {editorTop === "site" && !inSubSection && (
          <div className="px-4 py-5 flex flex-col gap-3">
            {([
              { id: "siteMenu",    label: "사이트 메뉴 관리",   desc: "메인 사이트 메뉴 페이지 구성" },
              { id: "reservation", label: "단체주문 예약 관리",  desc: "단체주문 예약 내용 및 절차 설정" },
              { id: "location",    label: "위치 관리",           desc: "매장 위치 및 영업시간 정보" },
              { id: "allergy",     label: "알레르기 정보 관리",  desc: "메뉴별 알레르기 성분 확인" },
            ] as { id: SiteSection; label: string; desc: string }[]).map(({ id, label, desc }) => (
              <button key={String(id)} onClick={() => setSiteSection(id)}
                className="w-full flex items-center gap-4 p-4 bg-[#FAF7F2] border border-black/8 hover:border-[#174C35] hover:shadow-sm transition-all text-left group">
                <div className="flex-1">
                  <p className="font-sans text-sm font-semibold text-[#0D0D0D] group-hover:text-[#174C35] transition-colors">{label}</p>
                  <p className="font-sans text-xs text-[#888] mt-0.5">{desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bbb] group-hover:text-[#174C35] transition-colors flex-shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {editorTop === "site" && siteSection === "allergy" && <AllergyView />}

        {editorTop === "site" && siteSection === "siteMenu" && <SiteMenuManager />}

        {editorTop === "site" && (siteSection === "reservation" || siteSection === "location") && (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: "#174C35" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className="font-sans text-sm font-semibold text-[#0D0D0D]">준비 중입니다</p>
            <p className="font-sans text-xs text-[#aaa]">이 기능은 곧 추가될 예정입니다.</p>
          </div>
        )}

        {/* ── QR 메뉴판 설정 ─── */}
        {editorTop === "qr" && !inSubSection && (
          <div className="px-4 py-5 flex flex-col gap-3">
            {([
              { id: "items",   label: "메뉴 추가/삭제/숨김", desc: "QR 주문 메뉴 표시 여부 및 가격 관리" },
              { id: "details", label: "메뉴 세부 설정",       desc: "온도, 농도, 맛 선택 옵션 관리" },
            ] as { id: QRSection; label: string; desc: string }[]).map(({ id, label, desc }) => (
              <button key={String(id)} onClick={() => setQRSection(id)}
                className="w-full flex items-center gap-4 p-4 bg-[#FAF7F2] border border-black/8 hover:border-[#174C35] hover:shadow-sm transition-all text-left group">
                <div className="flex-1">
                  <p className="font-sans text-sm font-semibold text-[#0D0D0D] group-hover:text-[#174C35] transition-colors">{label}</p>
                  <p className="font-sans text-xs text-[#888] mt-0.5">{desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bbb] group-hover:text-[#174C35] transition-colors flex-shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {editorTop === "qr" && qrSection === "items" && <QRMenuManager />}

        {editorTop === "qr" && qrSection === "details" && <QRDetailsManager />}
      </div>
    </Shell>
  );
}
