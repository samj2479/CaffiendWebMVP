"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { orderCategories, type MenuItem } from "@/app/data/orderMenuData";
import { supabase } from "@/lib/supabase";
import AllergySheet from "../AllergySheet";
import { getAllergens, ALLERGEN_LABELS, type AllergenKey } from "../allergyLookup";

// ─── Category groupings ─────────────────────────────────────
const DESSERT_CATS = ["수플레", "빙수", "간편 디저트"];
const DRINK_CATS   = ["드립/더치", "커피", "논커피", "아인슈페너", "티", "에이드", "스무디"];

// ─── Fixed temperature rules ────────────────────────────────
const ICE_ONLY = new Set([
  "사케라또", "바닐라말차샷", "딸기라떼", "초코크림딸기라떼",
  "로투스 카라멜라떼", "헤이즐토피넛라떼", "옥수수슈페너",
  "얼그레이 바닐라티라떼", "런던포그", "흑임자 슈페너", "허니딸기블랙티",
]);
const HOT_ONLY = new Set(["꿀생강차", "레몬생강차", "유자차"]);

function getFixedTemp(item: MenuItem, catKo: string): "HOT" | "ICE" | null {
  const qr = item as QrMenuItem;
  if (qr.tempMode === "hot") return "HOT";
  if (qr.tempMode === "ice") return "ICE";
  if (qr.tempMode === "none" || qr.tempMode === "both") return null;
  // Static fallback
  if (catKo === "에이드" || catKo === "스무디") return "ICE";
  if (item.ko.includes("에이드")) return "ICE";
  if (item.ko.includes("콜드") || item.ko.includes("아이스")) return "ICE";
  if (ICE_ONLY.has(item.ko)) return "ICE";
  if (HOT_ONLY.has(item.ko)) return "HOT";
  return null;
}

// ─── Extra option sets ──────────────────────────────────────
const FLAVOR_OPTIONS: Record<string, string[]> = {
  "그릭요거트 (그래놀라/딸기/블루베리/망고)": ["그래놀라", "딸기", "블루베리", "망고"],
  "미니 쫀득쿠키": ["딸기&오레오", "말차&오레오", "약과&시나몬", "초코칩", "로투스"],
  "티라미수 볼 (코코아/말차/인절미/로투스)": ["코코아", "말차", "인절미", "로투스"],
  "1인 티라미수": ["밤", "커커이", "초코딸기", "말차딸기", "돼지바", "흑임자", "인절미말차", "우베", "고구마", "쑥절미"],
  "말렌카 (코코아/월넛)": ["코코아", "월넛"],
};

const COFFEE_EXTRA_ITEMS = new Set([
  "핸드드립 케냐 AA", "에스프레소", "에소 콘파냐", "패션후르츠 콘파냐",
  "아메리카노", "헤이즐넛 아메리카노", "꿀 아메리카노", "카페라떼",
  "퐁실 카푸치노", "아가베라떼", "바닐라빈라떼", "돌체라떼",
  "카라멜마끼야또", "카페모카",
]);

type ExtraType = "coffee" | "herb" | null;

function getExtraType(itemKo: string): ExtraType {
  if (COFFEE_EXTRA_ITEMS.has(itemKo)) return "coffee";
  if (itemKo === "허브티") return "herb";
  return null;
}

interface QrCustomOption {
  name_ko: string; name_en: string;
  choices: { ko: string; en: string }[];
}
interface QrMenuItem extends MenuItem {
  tempMode?: "both" | "hot" | "ice" | "none";
  qrCustomOptions?: QrCustomOption[];
}

interface ExtraOptions {
  strength?: "연하게" | "보통" | "진하게";
  roasting?: "라이트" | "미디엄" | "다크";
  herbType?: "캐모마일" | "얼그레이" | "히비스커스" | "루이보스";
  flavor?: string;
  customSelections?: Record<string, string>;
}

// ─── Types ──────────────────────────────────────────────────
interface CartEntry {
  quantity: number;
  temp: "HOT" | "ICE" | null;
  note: string;
  extras?: ExtraOptions;
}
type Cart         = Record<string, CartEntry>;
type MainCat      = "all" | "season" | "dessert" | "drinks";
type DropdownOpen = "dessert" | "drinks" | null;
type Screen       = "menu" | "cart" | "history" | "success";

interface SelectedItem {
  item: MenuItem;
  catKo: string;
  catEn: string;
  isDrink: boolean;
  fixedTemp: "HOT" | "ICE" | null;
  extraType: ExtraType;
  flavorOptions: string[] | null;
  qrCustomOptions?: QrCustomOption[];
}

type OrderStatus = "pending" | "cooking" | "completed" | "cancelled";
interface SubmittedOrder {
  id: string;
  items: { name: string; quantity: number; price: number; temp: string | null; note: string }[];
  total: number;
  time: string;
  status: OrderStatus;
}

// ─── Helpers ────────────────────────────────────────────────
function fmt(price: number, lang: "ko" | "en" = "ko") {
  if (price < 0) return lang === "ko" ? "변동" : "Variable";
  return price.toLocaleString("ko-KR") + "원";
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col shadow-xl">
        {children}
      </div>
    </div>
  );
}

// ─── Item Detail Modal ───────────────────────────────────────
function ItemModal({
  selected,
  entry,
  lang,
  onClose,
  onConfirm,
}: {
  selected: SelectedItem;
  entry: CartEntry | null;
  lang: "ko" | "en";
  onClose: () => void;
  onConfirm: (entry: CartEntry) => void;
}) {
  const { item, catKo, catEn, isDrink, fixedTemp, extraType, flavorOptions, qrCustomOptions } = selected;
  const [qty,      setQty]      = useState(entry?.quantity ?? 1);
  const [temp,     setTemp]     = useState<"HOT" | "ICE" | null>(fixedTemp ?? entry?.temp ?? null);
  const [note,     setNote]     = useState(entry?.note ?? "");
  const [strength, setStrength] = useState<"연하게" | "보통" | "진하게">(entry?.extras?.strength ?? "보통");
  const [roasting, setRoasting] = useState<"라이트" | "미디엄" | "다크">(entry?.extras?.roasting ?? "미디엄");
  const [herbType, setHerbType] = useState<"캐모마일" | "얼그레이" | "히비스커스" | "루이보스">(entry?.extras?.herbType ?? "캐모마일");
  const [flavor,   setFlavor]   = useState<string>(entry?.extras?.flavor ?? flavorOptions?.[0] ?? "");
  const [customSelections, setCustomSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries((qrCustomOptions ?? []).map(opt => [opt.name_ko, entry?.extras?.customSelections?.[opt.name_ko] ?? opt.choices[0]?.ko ?? ""]))
  );

  const allergens = getAllergens(item.ko);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleConfirm() {
    if (qty < 1) return;
    const hasCustom = qrCustomOptions && qrCustomOptions.length > 0;
    const extras: ExtraOptions | undefined = (() => {
      const base: ExtraOptions = {};
      if (extraType === "coffee") { base.strength = strength; base.roasting = roasting; }
      if (extraType === "herb") base.herbType = herbType;
      if (hasCustom) base.customSelections = customSelections;
      else if (flavorOptions) base.flavor = flavor;
      return Object.keys(base).length > 0 ? base : undefined;
    })();
    onConfirm({ quantity: qty, temp, note, extras });
    onClose();
  }

  const total = item.price >= 0 ? fmt(item.price * qty, lang) : fmt(-1, lang);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <div className="bg-white rounded-t-3xl overflow-hidden sheet-slide-up">

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-black/15" />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/6 flex items-center justify-center text-[#555] hover:bg-black/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Item info row */}
          <div className="flex gap-4 px-5 pt-3 pb-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image src={item.image} alt={item.ko} fill className="object-cover" sizes="96px" unoptimized />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="font-sans text-xs text-[#aaa]">{lang === "ko" ? catKo : catEn}</p>
              <p className="font-sans text-lg font-bold text-[#0D0D0D] leading-snug mt-0.5">
                {lang === "ko" ? item.ko : item.en}
              </p>
              <p className={`font-sans text-base font-bold mt-1 ${item.price < 0 ? "text-[#aaa]" : "text-[#174C35]"}`}>
                {fmt(item.price, lang)}
              </p>
            </div>
          </div>

          <div className="px-5 pb-6 flex flex-col gap-5">
            {/* 온도 — drinks only */}
            {isDrink && (
              <div>
                <p className="font-sans text-sm font-semibold text-[#0D0D0D] mb-2">
                  {lang === "ko" ? "온도" : "Temperature"}
                </p>
                <div className="flex gap-2">
                  {(["HOT", "ICE"] as const)
                    .filter((t) => fixedTemp === null || fixedTemp === t)
                    .map((t) => {
                      const isActive = temp === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setTemp(isActive ? null : t)}
                          className="flex-1 py-2.5 rounded-full border font-sans text-sm font-semibold transition-all"
                          style={isActive
                            ? { backgroundColor: "#174C35", borderColor: "#174C35", color: "#fff" }
                            : { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.15)", color: "#555" }}
                        >
                          {t === "HOT"
                            ? (lang === "ko" ? "🔥 핫" : "🔥 HOT")
                            : (lang === "ko" ? "❄️ 아이스" : "❄️ ICE")}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 농도 + 로스팅 (coffee extras) */}
            {extraType === "coffee" && (
              <>
                <div>
                  <p className="font-sans text-sm font-semibold text-[#0D0D0D] mb-2">
                    {lang === "ko" ? "농도" : "Strength"}
                  </p>
                  <div className="flex gap-2">
                    {(["연하게", "보통", "진하게"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStrength(s)}
                        className="flex-1 py-2.5 rounded-full border font-sans text-sm font-semibold transition-all"
                        style={strength === s
                          ? { backgroundColor: "#174C35", borderColor: "#174C35", color: "#fff" }
                          : { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.15)", color: "#555" }}
                      >
                        {lang === "ko" ? s : s === "연하게" ? "Light" : s === "보통" ? "Regular" : "Strong"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold text-[#0D0D0D] mb-2">
                    {lang === "ko" ? "로스팅" : "Roasting"}
                  </p>
                  <div className="flex gap-2">
                    {(["라이트", "미디엄", "다크"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoasting(r)}
                        className="flex-1 py-2.5 rounded-full border font-sans text-sm font-semibold transition-all"
                        style={roasting === r
                          ? { backgroundColor: "#174C35", borderColor: "#174C35", color: "#fff" }
                          : { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.15)", color: "#555" }}
                      >
                        {lang === "ko" ? r : r === "라이트" ? "Light" : r === "미디엄" ? "Medium" : "Dark"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 종류 (herb type) */}
            {extraType === "herb" && (
              <div>
                <p className="font-sans text-sm font-semibold text-[#0D0D0D] mb-2">
                  {lang === "ko" ? "종류" : "Type"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(["캐모마일", "얼그레이", "히비스커스", "루이보스"] as const).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHerbType(h)}
                      className="py-2.5 rounded-full border font-sans text-sm font-semibold transition-all"
                      style={herbType === h
                        ? { backgroundColor: "#174C35", borderColor: "#174C35", color: "#fff" }
                        : { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.15)", color: "#555" }}
                    >
                      {lang === "ko" ? h : h === "캐모마일" ? "Chamomile" : h === "얼그레이" ? "Earl Grey" : h === "히비스커스" ? "Hibiscus" : "Rooibos"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DB 커스텀 옵션 */}
            {qrCustomOptions && qrCustomOptions.length > 0 && qrCustomOptions.map((opt, idx) => (
              <div key={idx}>
                <p className="font-sans text-sm font-semibold text-[#0D0D0D] mb-2">
                  {lang === "ko" ? opt.name_ko : opt.name_en}
                </p>
                <div className={`grid gap-2 ${opt.choices.length < 3 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {opt.choices.map((choice) => (
                    <button
                      key={choice.ko}
                      onClick={() => setCustomSelections(prev => ({ ...prev, [opt.name_ko]: choice.ko }))}
                      className="py-2.5 rounded-full border font-sans text-sm font-semibold transition-all"
                      style={customSelections[opt.name_ko] === choice.ko
                        ? { backgroundColor: "#174C35", borderColor: "#174C35", color: "#fff" }
                        : { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.15)", color: "#555" }}
                    >
                      {lang === "ko" ? choice.ko : choice.en}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* 정적 맛 선택 (fallback) */}
            {(!qrCustomOptions || qrCustomOptions.length === 0) && flavorOptions && (
              <div>
                <p className="font-sans text-sm font-semibold text-[#0D0D0D] mb-2">
                  {lang === "ko" ? "맛 선택" : "Flavor"}
                </p>
                <div className={`grid gap-2 ${flavorOptions.length <= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {flavorOptions.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFlavor(f)}
                      className="py-2.5 rounded-full border font-sans text-sm font-semibold transition-all"
                      style={flavor === f
                        ? { backgroundColor: "#174C35", borderColor: "#174C35", color: "#fff" }
                        : { backgroundColor: "#fff", borderColor: "rgba(0,0,0,0.15)", color: "#555" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 알레르기 정보 */}
            {allergens.length > 0 && (
              <div>
                <p className="font-sans text-xs font-semibold text-[#888] mb-2">
                  {lang === "ko" ? "알레르기 정보" : "Allergens"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {allergens.map((key: AllergenKey) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 bg-[#174C35]/8 text-[#174C35] font-sans text-xs font-semibold px-2.5 py-1 rounded-full border border-[#174C35]/20"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174C35] flex-shrink-0" />
                      {lang === "ko" ? ALLERGEN_LABELS[key].ko : ALLERGEN_LABELS[key].en}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {allergens.length === 0 && (
              <p className="font-sans text-xs text-[#bbb]">
                {lang === "ko" ? "알레르기 유발 성분 없음" : "No allergens"}
              </p>
            )}

            {/* 요청사항 */}
            <div>
              <p className="font-sans text-sm font-semibold text-[#0D0D0D] mb-2">
                {lang === "ko" ? "요청사항" : "Special Request"}
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={lang === "ko"
                  ? "예: 휴지 챙겨주세요, 음료 설탕 적게 넣어주세요"
                  : "e.g. Less sugar, extra napkins please"}
                rows={2}
                className="w-full px-3.5 py-3 rounded-xl border border-black/15 font-sans text-sm text-[#0D0D0D] placeholder:text-[#bbb] resize-none outline-none focus:border-[#174C35] transition-all bg-[#FAFAFA]"
              />
            </div>

            {/* 수량 */}
            <div className="flex items-center justify-between">
              <p className="font-sans text-sm font-semibold text-[#0D0D0D]">
                {lang === "ko" ? "수량" : "Quantity"}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full border border-[#174C35] text-[#174C35] flex items-center justify-center text-xl font-light leading-none"
                >
                  −
                </button>
                <span className="font-sans text-lg font-bold text-[#0D0D0D] w-6 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 rounded-full bg-[#174C35] text-white flex items-center justify-center text-xl font-light leading-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* 장바구니 담기 */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 rounded-2xl text-white font-sans font-semibold text-base flex items-center justify-between px-5"
              style={{ backgroundColor: "#174C35" }}
            >
              <div className="flex items-center gap-2">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span>{lang === "ko" ? "장바구니 담기" : "Add to Cart"}</span>
              </div>
              <span className="font-sans text-sm font-bold opacity-80">{total}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main component ──────────────────────────────────────────
export default function OrderPage() {
  const params      = useParams<{ table: string }>();
  const router      = useRouter();
  const tableNumber = params?.table ?? "?";

  const [lang, setLangState]          = useState<"ko" | "en">("ko");
  const [mainCat, setMainCat]         = useState<MainCat>("all");
  const [subCat, setSubCat]           = useState<string | null>(null);
  const [openDrop, setOpenDrop]       = useState<DropdownOpen>(null);
  const [cart, setCart]               = useState<Cart>({});
  const [screen, setScreen]           = useState<Screen>("menu");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [showAllergy, setShowAllergy] = useState(false);
  const [history, setHistory]         = useState<SubmittedOrder[]>([]);
  const historyRef = useRef<SubmittedOrder[]>([]);
  const historyKey = `caffiend-order-history-${tableNumber}`;
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled]       = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [menuConfig, setMenuConfig] = useState<{ prices: Record<string,number>; hidden: Record<string,boolean> }>({ prices: {}, hidden: {} });
  const [dbCategories, setDbCategories] = useState<typeof orderCategories | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("caffiend-order-lang");
    if (saved === "en") setLangState("en");
    try {
      const raw = localStorage.getItem("caffiend-menu-config");
      if (raw) setMenuConfig(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  // 주문 내역 localStorage 로드 + Supabase 상태 동기화
  useEffect(() => {
    async function loadHistory() {
      try {
        const raw = localStorage.getItem(historyKey);
        if (!raw) return;
        const today = new Date().toDateString();
        let loaded: SubmittedOrder[] = JSON.parse(raw);
        // 오늘 주문만 유지
        loaded = loaded.filter((o) => {
          try { return new Date(o.time).toDateString() === today; } catch { return true; }
        });
        if (loaded.length === 0) return;

        // Supabase에서 최신 상태 가져오기
        const ids = loaded.map((o) => o.id).filter(Boolean);
        if (ids.length > 0 && supabase) {
          const { data } = await supabase.from("orders").select("id, status").in("id", ids);
          if (data) {
            const map = new Map(data.map((o: { id: string; status: OrderStatus }) => [o.id, o.status]));
            loaded = loaded.map((o) => ({ ...o, status: map.get(o.id) ?? o.status }));
          }
        }
        setHistory(loaded);
      } catch { /* ignore */ }
    }
    loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyKey]);

  // 주문 내역 변경 시 localStorage 저장
  useEffect(() => {
    if (history.length === 0) return;
    // time 필드에 날짜 정보 포함 (필터용)
    const toSave = history.map((o) => ({
      ...o,
      time: o.time.includes("T") ? o.time : new Date().toISOString().split("T")[0] + "T" + o.time,
    }));
    localStorage.setItem(historyKey, JSON.stringify(toSave));
  }, [history, historyKey]);

  // Fetch menu from Supabase — applies QR hide/show from admin
  useEffect(() => {
    async function fetchQrMenu() {
      if (!supabase) return;
      const [catsRes, itemsRes, linksRes, ovrRes] = await Promise.all([
        supabase.from("site_categories").select("id, ko, en").order("sort_order"),
        supabase.from("site_menu_items").select("id, ko, en, image_url, price, season").order("sort_order"),
        supabase.from("site_menu_category_items").select("menu_item_id, category_id, sort_order").order("sort_order"),
        supabase.from("site_qr_overrides").select("menu_item_id, hidden, price_override, temp_mode, custom_options"),
      ]);
      const dbCats = catsRes.data; const dbItems = itemsRes.data;
      const dbLinks = linksRes.data; const dbOvr = ovrRes.data;
      if (!dbCats || !dbItems || dbItems.length === 0) return;

      const ovrMap = new Map(dbOvr?.map((o: { menu_item_id: string; hidden: boolean; price_override: number | null }) => [o.menu_item_id, o]) ?? []);
      const catMap = new Map(dbCats.map((c: { id: string; ko: string; en: string }) => [c.id, c]));
      const visibleIds = new Set(dbItems.filter((i: { id: string }) => !ovrMap.get(i.id)?.hidden).map((i: { id: string }) => i.id));
      const itemMap = new Map(dbItems.map((i: { id: string }) => [i.id, i]));

      const CAT_EMOJI: Record<string, string> = {
        "시즌": "🌸", "수플레": "🍮", "빙수": "❄️", "간편 디저트": "🍰",
        "드립/더치": "☕", "커피": "☕", "논커피": "🥛", "아인슈페너": "🍦",
        "티": "🍵", "에이드": "🍋", "스무디": "🥤",
      };

      const catGroups = new Map<string, { ko: string; en: string; emoji: string; items: MenuItem[] }>();
      for (const link of [...(dbLinks ?? [])].sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)) {
        if (!visibleIds.has(link.menu_item_id)) continue;
        const raw = itemMap.get(link.menu_item_id) as { id: string; ko: string; en: string; image_url: string | null; price: number; season?: boolean };
        const cat = catMap.get(link.category_id) as { id: string; ko: string; en: string } | undefined;
        if (!raw || !cat) continue;
        const ov = ovrMap.get(raw.id) as { price_override: number | null; temp_mode?: string; custom_options?: QrCustomOption[] } | undefined;
        const menuItem: QrMenuItem = {
          ko: raw.ko, en: raw.en,
          image: raw.image_url ?? "",
          price: ov?.price_override ?? raw.price,
          season: raw.season,
          tempMode: (ov?.temp_mode as QrMenuItem["tempMode"]) ?? undefined,
          qrCustomOptions: ov?.custom_options?.length ? ov.custom_options : undefined,
        };
        if (!catGroups.has(cat.ko)) {
          catGroups.set(cat.ko, { ko: cat.ko, en: cat.en, emoji: CAT_EMOJI[cat.ko] ?? "🍽️", items: [] });
        }
        const group = catGroups.get(cat.ko)!;
        if (!group.items.find(i => i.ko === raw.ko)) group.items.push(menuItem);
      }

      // Season items first within each category
      for (const group of catGroups.values()) {
        group.items.sort((a, b) => (b.season ? 1 : 0) - (a.season ? 1 : 0));
      }
      // 시즌 category always appears first
      const built = Array.from(catGroups.values())
        .filter(c => c.items.length > 0)
        .sort((a, b) => (b.ko === "시즌" ? 1 : 0) - (a.ko === "시즌" ? 1 : 0));
      if (built.length > 0) setDbCategories(built);
    }
    fetchQrMenu();
  }, []);

  useEffect(() => {
    if (screen !== "menu") { setScrolled(false); return; }
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [screen]);

  // 주문 상태 실시간 구독 — success/history 화면에서 Supabase Realtime으로 즉시 업데이트
  useEffect(() => {
    if (!supabase) return;
    if (screen !== "success" && screen !== "history") return;

    async function refresh() {
      const ids = historyRef.current.map(o => o.id).filter(Boolean);
      if (ids.length === 0) return;
      const { data } = await supabase!.from("orders").select("id, status").in("id", ids);
      if (!data || data.length === 0) return;
      const map = new Map(data.map((o: { id: string; status: OrderStatus }) => [o.id, o.status as OrderStatus]));
      setHistory(prev => prev.map(o => ({ ...o, status: map.get(o.id) ?? o.status })));
    }

    refresh();

    const channel = supabase
      .channel(`orders-status-${tableNumber}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updated = payload.new as { id: string; status: OrderStatus };
          setHistory(prev => {
            const isTracked = prev.some(o => o.id === updated.id);
            if (!isTracked) return prev;
            return prev.map(o => o.id === updated.id ? { ...o, status: updated.status } : o);
          });
        }
      )
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, [screen, tableNumber]);

  // history ref는 항상 최신 상태 반영
  useEffect(() => { historyRef.current = history; }, [history]);

  function setLang(l: "ko" | "en") {
    setLangState(l);
    localStorage.setItem("caffiend-order-lang", l);
  }

  // ── Cart calculations ──────────────────────────────────────
  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, e) => a + e.quantity, 0),
    [cart]
  );
  const activeCategories = useMemo(() => dbCategories ?? orderCategories, [dbCategories]);

  const cartTotal = useMemo(
    () => Object.entries(cart).reduce((sum, [name, entry]) => {
      for (const cat of activeCategories) {
        const item = cat.items.find((i) => i.ko === name);
        if (item && item.price >= 0) return sum + item.price * entry.quantity;
      }
      return sum;
    }, 0),
    [cart, activeCategories]
  );
  const cartItems = useMemo(
    () => Object.entries(cart)
      .filter(([, e]) => e.quantity > 0)
      .map(([name, entry]) => {
        for (const cat of activeCategories) {
          const item = cat.items.find((i) => i.ko === name);
          if (item) return { name, quantity: entry.quantity, price: item.price, temp: entry.temp, note: entry.note, extras: entry.extras };
        }
        return { name, quantity: entry.quantity, price: 0, temp: null, note: "", extras: undefined };
      }),
    [cart]
  );

  function openItemModal(item: MenuItem, catKo: string, catEn: string) {
    const qr = item as QrMenuItem;
    const isDrink = qr.tempMode === "none" ? false
      : (DRINK_CATS.includes(catKo) || catKo === "시즌") && !item.ko.includes("아포가토");
    const fixedTemp     = getFixedTemp(item, catKo);
    const extraType     = getExtraType(item.ko);
    const flavorOptions = qr.qrCustomOptions?.length
      ? qr.qrCustomOptions[0].choices.map(c => c.ko)
      : (FLAVOR_OPTIONS[item.ko] ?? null);
    setSelectedItem({ item, catKo, catEn, isDrink, fixedTemp, extraType, flavorOptions, qrCustomOptions: qr.qrCustomOptions });
  }

  function handleModalConfirm(entry: CartEntry) {
    if (!selectedItem) return;
    setCart((prev) => ({ ...prev, [selectedItem.item.ko]: entry }));
  }

  function removeFromCart(name: string) {
    setCart((prev) => { const next = { ...prev }; delete next[name]; return next; });
  }

  function adjustCartQty(name: string, delta: number) {
    setCart((prev) => {
      const entry = prev[name];
      if (!entry) return prev;
      const newQty = entry.quantity + delta;
      if (newQty <= 0) { const next = { ...prev }; delete next[name]; return next; }
      return { ...prev, [name]: { ...entry, quantity: newQty } };
    });
  }

  async function handleSubmit() {
    if (cartItems.length === 0) return;
    if (!supabase) {
      setError(lang === "ko" ? "서비스 준비 중입니다. 직원에게 문의해주세요." : "Service unavailable. Please ask staff.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { data: newOrder, error: err } = await supabase.from("orders").insert({
        table_number: parseInt(tableNumber, 10),
        items: cartItems,
        status: "pending",
      }).select("id").single();
      if (err) throw err;
      const now = new Date();
      const timeStr = now.toISOString();
      setHistory((prev) => [{ id: newOrder?.id ?? "", items: cartItems, total: cartTotal, time: timeStr, status: "pending" }, ...prev]);
      setCart({});
      setScreen("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : (lang === "ko" ? "주문 실패. 다시 시도해주세요." : "Order failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  // ── Category filter ────────────────────────────────────────
  const displayedCategories = useMemo(() => {
    if (mainCat === "all")    return activeCategories;
    if (mainCat === "season") return activeCategories.filter((c) => c.ko === "시즌");
    if (mainCat === "dessert") {
      if (subCat) return activeCategories.filter((c) => c.ko === subCat);
      return activeCategories.filter((c) => DESSERT_CATS.includes(c.ko));
    }
    if (mainCat === "drinks") {
      if (subCat) return activeCategories.filter((c) => c.ko === subCat);
      return activeCategories.filter((c) => DRINK_CATS.includes(c.ko));
    }
    return activeCategories;
  }, [mainCat, subCat, activeCategories]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return displayedCategories
      .map((cat) => ({
        ...cat,
        items: cat.items
          .filter((item) => !q || item.ko.toLowerCase().includes(q) || item.en.toLowerCase().includes(q))
          .map((item) => ({
            ...item,
            price: menuConfig.prices[item.ko] ?? item.price,
          })),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [displayedCategories, searchQuery, menuConfig]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pickMain(cat: MainCat, hasDrop: boolean) {
    if (hasDrop) {
      if (mainCat === cat) {
        setOpenDrop(openDrop ? null : (cat as DropdownOpen));
      } else {
        setMainCat(cat); setSubCat(null); setOpenDrop(cat as DropdownOpen);
      }
    } else {
      setMainCat(cat); setSubCat(null); setOpenDrop(null);
    }
  }


  // ── Success screen ────────────────────────────────────────
  if (screen === "success") {
    const latestOrder = history[0];
    const statusConfig: Record<OrderStatus, { label: { ko: string; en: string }; color: string; icon: string }> = {
      pending:   { label: { ko: "대기 중",   en: "Waiting"  }, color: "#888",    icon: "⏳" },
      cooking:   { label: { ko: "조리 중",   en: "Cooking"  }, color: "#D97706", icon: "👨‍🍳" },
      cancelled: { label: { ko: "취소됨",    en: "Cancelled"}, color: "#DC2626", icon: "✕"  },
      completed: { label: { ko: "조리 완료", en: "Ready!"   }, color: "#174C35", icon: "✓"  },
    };
    const sc = latestOrder ? (statusConfig[latestOrder.status] ?? statusConfig.pending) : null;
    return (
      <Shell>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#174C35] flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0D0D0D]">
              {lang === "ko" ? "주문 완료!" : "Order Placed!"}
            </h2>
            <p className="font-sans text-sm text-[#555] mt-2">
              {lang === "ko" ? `테이블 ${tableNumber}번 주문이 접수되었습니다.` : `Order for Table ${tableNumber} received.`}
            </p>
            {sc && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 border-2 rounded-full" style={{ borderColor: sc.color }}>
                <span className="text-base">{sc.icon}</span>
                <span className="font-sans text-sm font-bold" style={{ color: sc.color }}>
                  {lang === "ko" ? sc.label.ko : sc.label.en}
                </span>
              </div>
            )}
            {latestOrder?.status === "pending" && (
              <>
                <p className="font-sans text-xs text-[#888] mt-3">
                  {lang === "ko" ? "잠시만 기다려주세요 ☕" : "Please wait a moment ☕"}
                </p>
                <button
                  onClick={async () => {
                    if (!supabase || !latestOrder) return;
                    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", latestOrder.id);
                    if (!error) setHistory(prev => prev.map(o => o.id === latestOrder.id ? { ...o, status: "cancelled" } : o));
                  }}
                  className="mt-3 font-sans text-xs text-red-400 border border-red-200 px-4 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                >
                  {lang === "ko" ? "주문 취소" : "Cancel Order"}
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button onClick={() => setScreen("menu")} className="w-full py-3.5 rounded-2xl bg-[#174C35] text-white font-sans font-semibold">
              {lang === "ko" ? "추가 주문하기" : "Order More"}
            </button>
            <button onClick={() => setScreen("history")} className="w-full py-3 rounded-2xl border border-[#174C35] text-[#174C35] font-sans text-sm">
              {lang === "ko" ? "주문 내역 보기" : "View Order History"}
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  // ── Order history screen ──────────────────────────────────
  if (screen === "history") {
    return (
      <Shell>
        <div className="flex-shrink-0 px-5 pt-6 pb-4 border-b border-black/8 flex items-center gap-3">
          <button onClick={() => setScreen("menu")} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="font-serif text-xl font-bold text-[#0D0D0D]">
            {lang === "ko" ? "주문 내역" : "Order History"}
          </h1>
          <span className="font-sans text-xs text-[#888] ml-auto">
            {lang === "ko" ? `테이블 ${tableNumber}번` : `Table ${tableNumber}`}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] flex items-center justify-center text-2xl">☕</div>
              <p className="font-sans text-sm text-[#888]">
                {lang === "ko" ? "아직 주문 내역이 없습니다." : "No orders placed yet."}
              </p>
            </div>
          )}
          {history.map((order, i) => {
            const statusLabel: Record<OrderStatus, { ko: string; en: string; color: string }> = {
              pending:   { ko: "대기 중",   en: "Waiting",   color: "rgba(0,0,0,0.18)" },
              cooking:   { ko: "조리 중",   en: "Cooking",   color: "#D97706" },
              cancelled: { ko: "취소됨",    en: "Cancelled", color: "#DC2626" },
              completed: { ko: "조리 완료", en: "Ready",     color: "#059669" },
            };
            const sl = statusLabel[order.status] ?? statusLabel.pending;
            return (
              <div key={i} className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-black/8">
                <div className="px-4 py-3 bg-[#174C35] flex items-center justify-between">
                  <span className="font-sans text-sm font-semibold text-white">
                    {lang === "ko" ? `주문 ${history.length - i}` : `Order ${history.length - i}`}
                    {i === 0 && <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{lang === "ko" ? "최근" : "Latest"}</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: sl.color, color: "#fff" }}>
                      {lang === "ko" ? sl.ko : sl.en}
                    </span>
                    <span className="font-sans text-xs text-white/70">
                      {(() => { try { const d = new Date(order.time); return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; } catch { return order.time; } })()}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 flex flex-col gap-2">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="font-sans text-sm text-[#0D0D0D]">{item.name}</span>
                        {item.temp && <span className="ml-2 font-sans text-xs text-[#aaa]">{item.temp}</span>}
                        {item.note && <p className="font-sans text-xs text-[#bbb] mt-0.5">{item.note}</p>}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-sans text-xs text-[#888]">×{item.quantity}</span>
                        <span className="font-sans text-sm font-semibold text-[#174C35]">{fmt(item.price * item.quantity, lang)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-black/8 flex justify-between items-center">
                    <span className="font-sans text-xs text-[#888]">{lang === "ko" ? "합계" : "Total"}</span>
                    <span className="font-sans text-base font-bold text-[#0D0D0D]">{fmt(order.total, lang)}</span>
                  </div>
                  {order.status === "pending" && (
                    <button
                      onClick={async () => {
                        if (!supabase) return;
                        const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
                        if (!error) setHistory(prev => prev.map(o => o.id === order.id ? { ...o, status: "cancelled" } : o));
                      }}
                      className="mt-2 w-full font-sans text-xs text-red-400 border border-red-200 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {lang === "ko" ? "주문 취소" : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-shrink-0 px-5 pb-6 pt-3">
          <button onClick={() => setScreen("menu")} className="w-full py-3.5 rounded-2xl bg-[#174C35] text-white font-sans font-semibold">
            {lang === "ko" ? "메뉴로 돌아가기" : "Back to Menu"}
          </button>
        </div>
      </Shell>
    );
  }

  // ── Cart screen ───────────────────────────────────────────
  if (screen === "cart") {
    return (
      <Shell>
        <div className="flex-shrink-0 px-5 pt-6 pb-4 border-b border-black/8 flex items-center gap-3">
          <button onClick={() => setScreen("menu")} className="w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="font-serif text-xl font-bold text-[#0D0D0D]">
            {lang === "ko" ? "장바구니" : "Cart"}
          </h1>
          <span className="font-sans text-xs text-[#888] ml-auto">
            {lang === "ko" ? `테이블 ${tableNumber}번` : `Table ${tableNumber}`}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {cartItems.length === 0 ? (
            <p className="text-center font-sans text-sm text-[#888] py-12">
              {lang === "ko" ? "선택된 메뉴가 없습니다." : "No items selected."}
            </p>
          ) : cartItems.map((ci) => (
            <div key={ci.name} className="bg-[#FAF7F2] rounded-xl px-4 py-3.5 border border-black/8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-base text-[#0D0D0D] font-medium">{ci.name}</p>
                    {ci.temp && (
                      <span className={`font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        ci.temp === "HOT" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      }`}>{ci.temp}</span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-[#174C35] mt-0.5 font-semibold">{fmt(ci.price, lang)}</p>
                  {ci.extras?.flavor && (
                    <p className="font-sans text-xs text-[#aaa] mt-0.5">맛: {ci.extras.flavor}</p>
                  )}
                  {ci.extras?.strength && (
                    <p className="font-sans text-xs text-[#aaa] mt-0.5">농도 {ci.extras.strength} · 로스팅 {ci.extras.roasting}</p>
                  )}
                  {ci.extras?.herbType && (
                    <p className="font-sans text-xs text-[#aaa] mt-0.5">{ci.extras.herbType}</p>
                  )}
                  {ci.note && <p className="font-sans text-xs text-[#aaa] mt-1">💬 {ci.note}</p>}
                </div>
                <div className="flex items-center gap-2.5 ml-3">
                  <button onClick={() => adjustCartQty(ci.name, -1)} className="w-8 h-8 rounded-full border border-[#174C35] text-[#174C35] flex items-center justify-center text-xl font-light leading-none">−</button>
                  <span className="font-sans text-base font-bold text-[#174C35] w-5 text-center">{ci.quantity}</span>
                  <button onClick={() => adjustCartQty(ci.name, 1)} className="w-8 h-8 rounded-full bg-[#174C35] text-white flex items-center justify-center text-xl font-light leading-none">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 px-5 py-5 border-t border-black/8 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-sans text-base text-[#555]">{lang === "ko" ? "합계" : "Total"}</span>
            <span className="font-sans text-lg font-bold text-[#0D0D0D]">{fmt(cartTotal, lang)}</span>
          </div>
          {error && <p className="font-sans text-sm text-red-500 text-center">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting || cartItems.length === 0}
            className="w-full py-4 rounded-2xl bg-[#174C35] text-white font-sans font-semibold text-base disabled:opacity-50"
          >
            {submitting
              ? (lang === "ko" ? "주문 중..." : "Placing order...")
              : (lang === "ko" ? `테이블 ${tableNumber}번 주문하기` : `Order for Table ${tableNumber}`)}
          </button>
        </div>
      </Shell>
    );
  }

  // ── Menu screen ───────────────────────────────────────────
  return (
    <>
      {/* Scroll to top — outside Shell so fixed positioning is viewport-relative */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{
          position: "fixed",
          bottom: cartCount > 0 ? "7rem" : "2rem",
          right: "max(0.75rem, calc((100vw - 28rem) / 2 + 0.75rem))",
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "#174C35",
          border: "none",
          boxShadow: "0 4px 16px rgba(23,76,53,0.35), 0 0 0 2.5px white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          zIndex: 60,
          opacity: scrolled && !selectedItem ? 1 : 0,
          pointerEvents: scrolled && !selectedItem ? "auto" : "none",
          transform: scrolled ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.25s ease, transform 0.25s ease, bottom 0.25s ease",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12V4M4 7l4-4 4 4" />
        </svg>
      </button>

      {/* Item detail modal */}
      {selectedItem && (
        <ItemModal
          selected={selectedItem}
          entry={cart[selectedItem.item.ko] ?? null}
          lang={lang}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleModalConfirm}
        />
      )}

      {showAllergy && <AllergySheet lang={lang} onClose={() => setShowAllergy(false)} />}

      <Shell>
        {/* ── Header ── */}
        <div className="flex-shrink-0 bg-[#174C35] px-5 pt-5 pb-4">
          <div className="flex items-start justify-between">
            {/* Left */}
            <div>
              <p className="font-serif text-white text-xl font-bold tracking-wider">CAFFIEND</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="font-sans text-white/60 text-sm">
                  {lang === "ko" ? `테이블 ${tableNumber}번` : `Table ${tableNumber}`}
                </p>
                <button
                  onClick={() => router.push("/order")}
                  className="font-sans text-[10px] font-semibold text-white/50 hover:text-white/90 border border-white/20 hover:border-white/50 px-1.5 py-0.5 rounded transition-all"
                >
                  {lang === "ko" ? "변경" : "Change"}
                </button>
              </div>
            </div>

            {/* Right: lang + cart (same size), 주문 내역 below */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang(lang === "ko" ? "en" : "ko")}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full border border-white/50 text-white font-sans text-xs font-semibold tracking-wider hover:bg-white/15 transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  {lang === "ko" ? "EN" : "한"}
                </button>
                <button
                  onClick={() => setScreen("cart")}
                  className="relative inline-flex items-center justify-center h-9 px-3 rounded-full border border-white/50 text-white hover:bg-white/15 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
              <button
                onClick={() => setScreen("history")}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full border border-white/50 text-white font-sans text-xs font-semibold hover:bg-white/15 transition-all"
              >
                {lang === "ko" ? "주문 내역" : "My Orders"}
                {history.length > 0 && (
                  <span className="bg-white/25 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{history.length}</span>
                )}
              </button>
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => setShowAllergy(true)}
              className="font-sans text-xs text-white/60 hover:text-white/90 underline underline-offset-2 transition-colors"
            >
              {lang === "ko" ? "알레르기 정보" : "Allergy Info"}
            </button>
          </div>
        </div>

        {/* ── Category nav ── */}
        <div className="flex-shrink-0 bg-white">
          {/* Main 4 tabs — equal rectangles divided by borders */}
          <div className="flex border-b border-black/15 divide-x divide-black/15">
            {([
              { id: "all",     ko: "전체",     en: "All",     drop: false },
              { id: "season",  ko: "시즌 메뉴", en: "Season",  drop: false },
              { id: "dessert", ko: "디저트",   en: "Dessert", drop: true  },
              { id: "drinks",  ko: "음료",     en: "Drinks",  drop: true  },
            ] as { id: MainCat; ko: string; en: string; drop: boolean }[]).map(({ id, ko, en, drop }) => (
              <button
                key={id}
                onClick={() => pickMain(id, drop)}
                className="flex-1 py-3.5 font-sans text-sm font-semibold transition-colors"
                style={mainCat === id
                  ? { backgroundColor: "#174C35", color: "#fff" }
                  : { backgroundColor: "#fff", color: "#555" }}
              >
                {lang === "ko" ? ko : en}
              </button>
            ))}
          </div>

          {/* Dessert sub-tabs — 4 rectangles in one row */}
          {openDrop === "dessert" && (
            <div className="flex border-b border-black/12 divide-x divide-black/12">
              {(["all", ...DESSERT_CATS]).map((name) => {
                const isAll   = name === "all";
                const cat     = isAll ? null : orderCategories.find((c) => c.ko === name);
                const isActive = isAll ? !subCat : subCat === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSubCat(isAll ? null : name)}
                    className="flex-1 py-2.5 font-sans text-xs font-semibold transition-colors"
                    style={isActive
                      ? { backgroundColor: "#174C35", color: "#fff" }
                      : { backgroundColor: "#FAF7F2", color: "#555" }}
                  >
                    {isAll ? (lang === "ko" ? "전체" : "All") : (lang === "ko" ? cat?.ko : cat?.en)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Drinks sub-tabs — 4×2 grid, all visible */}
          {openDrop === "drinks" && (
            <div className="grid grid-cols-4 border-b border-black/12">
              {(["all", ...DRINK_CATS]).map((name, i) => {
                const isAll   = name === "all";
                const cat     = isAll ? null : orderCategories.find((c) => c.ko === name);
                const isActive = isAll ? !subCat : subCat === name;
                const isLastCol  = (i + 1) % 4 === 0;
                const isFirstRow = i < 4;
                return (
                  <button
                    key={name}
                    onClick={() => setSubCat(isAll ? null : name)}
                    className="py-2.5 font-sans text-xs font-semibold transition-colors"
                    style={{
                      backgroundColor: isActive ? "#174C35" : "#FAF7F2",
                      color: isActive ? "#fff" : "#555",
                      borderRight:  isLastCol  ? "none" : "1px solid rgba(0,0,0,0.1)",
                      borderBottom: isFirstRow ? "1px solid rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    {isAll ? (lang === "ko" ? "전체" : "All") : (lang === "ko" ? cat?.ko : cat?.en)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Search bar ── */}
        <div className="flex-shrink-0 px-4 py-2.5 bg-white border-b border-black/8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "ko" ? "메뉴 검색..." : "Search menu..."}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-black/15 outline-none focus:border-[#174C35] transition-all bg-white font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── Notice ── */}
        <div className="flex-shrink-0 px-5 py-2.5 bg-[#F4F0EA] border-b border-black/8 flex items-center gap-2">
          <span className="font-sans text-[10px] font-bold text-[#174C35] bg-[#174C35]/10 px-1.5 py-0.5 rounded">
            {lang === "ko" ? "공지" : "Notice"}
          </span>
          <span className="font-sans text-xs text-[#666]">
            {lang === "ko"
              ? "간편 디저트를 제외한 모든 메뉴는 주문과 동시에 성심껏 만듭니다."
              : "All items except simple desserts are freshly prepared upon order."}
          </span>
        </div>

        {/* ── Menu list ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-8">
          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <p className="font-sans text-sm text-[#888]">
                {lang === "ko" ? "검색 결과가 없습니다." : "No results found."}
              </p>
            </div>
          )}
          {filteredCategories.map((cat, ci) => (
            <div key={ci}>
              <h2 className="font-serif text-base font-bold text-[#174C35] mb-3">
                {lang === "ko" ? cat.ko : cat.en}
              </h2>
              <div className="flex flex-col gap-3">
                {cat.items.map((item: MenuItem, ii: number) => {
                  const entry = cart[item.ko];
                  const qty   = entry?.quantity ?? 0;
                  return (
                    <button
                      key={ii}
                      onClick={() => openItemModal(item, cat.ko, cat.en)}
                      className="flex overflow-hidden border text-left w-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] active:shadow-none"
                      style={{
                        borderColor: qty > 0 ? "#174C35" : "rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* Image */}
                      <div className="relative w-36 h-36 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.ko}
                          fill
                          className="object-cover"
                          sizes="144px"
                          unoptimized
                        />
                        {item.season && (
                          <span className="absolute top-1.5 left-1.5 bg-[#174C35] text-white text-[9px] font-sans font-semibold px-1.5 py-0.5">
                            {lang === "ko" ? "시즌" : "Season"}
                          </span>
                        )}
                        {qty > 0 && (
                          <span className="absolute top-1.5 right-1.5 min-w-[22px] h-[22px] bg-[#174C35] text-white text-xs font-bold flex items-center justify-center px-1">
                            {qty}
                          </span>
                        )}
                        {entry?.temp && (
                          <span className={`absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 ${
                            entry.temp === "HOT" ? "bg-red-500 text-white" : "bg-[#174C35] text-white"
                          }`}>
                            {entry.temp}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-4 py-3.5 bg-[#FAF7F2] flex flex-col justify-between">
                        <div>
                          <p className="font-sans text-base font-semibold text-[#0D0D0D] leading-snug">
                            {lang === "ko" ? item.ko : item.en}
                          </p>
                          <p className="font-sans text-sm text-[#aaa] mt-0.5">
                            {lang === "ko" ? cat.ko : cat.en}
                          </p>
                          {entry?.extras?.flavor && (
                            <p className="font-sans text-xs text-[#bbb] mt-0.5">맛: {entry.extras.flavor}</p>
                          )}
                          {entry?.extras?.strength && (
                            <p className="font-sans text-xs text-[#bbb] mt-0.5">{entry.extras.strength} · {entry.extras.roasting}</p>
                          )}
                          {entry?.extras?.herbType && (
                            <p className="font-sans text-xs text-[#bbb] mt-0.5">{entry.extras.herbType}</p>
                          )}
                          {entry?.note && (
                            <p className="font-sans text-xs text-[#bbb] mt-1 line-clamp-1">💬 {entry.note}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className={`font-sans font-bold ${item.price < 0 ? "text-[#999] text-sm" : "text-[#174C35] text-lg"}`}>
                            {fmt(item.price, lang)}
                          </p>
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                            style={{ backgroundColor: "#174C35", color: "#fff" }}
                          >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Cart bar ── */}
        {cartCount > 0 && (
          <div className="flex-shrink-0 px-4 pt-3 pb-6 bg-white border-t border-black/8">
            <button
              onClick={() => setScreen("cart")}
              className="w-full py-4 rounded-xl bg-[#174C35] text-white flex items-center justify-between px-5 shadow-md"
            >
              <span className="font-sans text-sm font-bold bg-white/20 rounded-full w-7 h-7 flex items-center justify-center">
                {cartCount}
              </span>
              <span className="font-sans text-base font-semibold">
                {lang === "ko" ? "장바구니 확인" : "View Cart"}
              </span>
              <span className="font-sans text-sm font-semibold">{fmt(cartTotal, lang)}</span>
            </button>
          </div>
        )}
      </Shell>
    </>
  );
}
