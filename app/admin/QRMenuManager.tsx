"use client";

import { useState, useEffect, useRef, useCallback, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────
interface DbMenuItem {
  id: string; ko: string; en: string; image_url: string | null;
  price: number; season: boolean; allergens: Record<string, boolean>; sort_order: number;
}
interface DbCategory { id: string; ko: string; en: string; parent_id: string | null; }
interface DbAllergenType { id: string; key: string; ko: string; en: string; sort_order: number; }
interface QrOverride {
  menu_item_id: string; hidden: boolean;
  temp_mode: TempMode; custom_options: CustomOption[];
}
interface CustomOption {
  name_ko: string; name_en: string;
  choices: { ko: string; en: string }[];
}
type TempMode = "both" | "hot" | "ice" | "none";
type View = "list" | "add" | "delete_confirm";

interface AddFormState {
  ko: string; en: string; imageFile: File | null; imagePreview: string;
  price: string; priceVariable: boolean; season: boolean;
  categoryIds: string[]; allergens: Record<string, boolean>;
  tempMode: TempMode; customOptions: CustomOption[];
}

const EMPTY: AddFormState = {
  ko: "", en: "", imageFile: null, imagePreview: "",
  price: "", priceVariable: false, season: false,
  categoryIds: [], allergens: {}, tempMode: "both", customOptions: [],
};
const GREEN = "#174C35";
const TEMP_OPTS: { value: TempMode; label: string }[] = [
  { value: "both", label: "HOT / ICE" },
  { value: "hot",  label: "HOT 고정" },
  { value: "ice",  label: "ICE 고정" },
  { value: "none", label: "온도 없음" },
];

// ─── Shared UI ───────────────────────────────────────────────
function Back({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-3 border-b border-black/8 font-sans text-sm text-[#555] hover:text-[#174C35] transition-colors w-full text-left">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      {label}
    </button>
  );
}

function EyeBtn({ hidden, onClick }: { hidden: boolean; onClick: () => void }) {
  const [animKey, setAnimKey] = useState(0);
  return (
    <button onClick={() => { setAnimKey(k => k + 1); onClick(); }} title={hidden ? "표시" : "숨김"}
      className="p-1 flex-shrink-0" style={{ color: hidden ? "#bbb" : GREEN, transition: "color 0.2s" }}>
      <span key={animKey} className={animKey > 0 ? "eye-pop inline-flex" : "inline-flex"}>
        {hidden ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </span>
    </button>
  );
}

// ─── QR List ─────────────────────────────────────────────────
interface QRListProps {
  items: DbMenuItem[];
  overrides: Map<string, QrOverride>;
  query: string;
  setQuery: (q: string) => void;
  onToggleHide: (id: string) => void;
  onDeleteSelect: (item: DbMenuItem) => void;
  onAddClick: () => void;
}

function QRListView({ items, overrides, query, setQuery, onToggleHide, onDeleteSelect, onAddClick }: QRListProps) {
  const filtered = query.trim()
    ? items.filter(m => m.ko.includes(query) || m.en.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <div className="flex flex-col">
      {/* Search + Add */}
      <div className="px-4 py-3 border-b border-black/8 flex gap-2 sticky top-0 bg-white z-10">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="메뉴 검색..."
            className="w-full font-sans text-sm pl-8 pr-3 py-2 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors" />
        </div>
        <button onClick={onAddClick} className="font-sans text-xs px-3 py-2 text-white flex-shrink-0"
          style={{ backgroundColor: GREEN }}>
          + 메뉴 추가
        </button>
      </div>

      <div className="divide-y divide-black/6">
        {filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-[#888] py-16">{query ? "검색 결과 없음" : "등록된 메뉴가 없습니다."}</p>
        )}
        {filtered.map(item => {
          const ov = overrides.get(item.id);
          const isHidden = ov?.hidden ?? false;
          const hasTempOverride = ov && ov.temp_mode !== "both";
          const hasCustomOpts = ov && ov.custom_options?.length > 0;
          return (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FAF7F2] transition-colors"
              style={{ opacity: isHidden ? 0.45 : 1, transition: "opacity 0.25s ease" }}>
              <div className="w-12 h-12 flex-shrink-0 bg-[#F0F0F0] overflow-hidden">
                {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-semibold text-[#0D0D0D] truncate">{item.ko}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {item.price === -1
                    ? <span className="font-sans text-xs text-[#aaa]">변동가</span>
                    : <span className="font-sans text-xs text-[#aaa]">{item.price.toLocaleString("ko-KR")}원</span>
                  }
                  {hasTempOverride && (
                    <span className="font-sans text-[10px] px-1.5 py-0.5 border border-[#174C35]/30 text-[#174C35]">
                      {ov.temp_mode === "hot" ? "HOT" : ov.temp_mode === "ice" ? "ICE" : "온도없음"}
                    </span>
                  )}
                  {hasCustomOpts && (
                    <span className="font-sans text-[10px] px-1.5 py-0.5 border border-black/15 text-[#888]">
                      옵션 {ov.custom_options.length}개
                    </span>
                  )}
                </div>
              </div>
              <EyeBtn hidden={isHidden} onClick={() => onToggleHide(item.id)} />
              <button onClick={() => onDeleteSelect(item)} className="p-1 flex-shrink-0 text-[#ddd] hover:text-red-400 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── QR Add Form ─────────────────────────────────────────────
interface QRAddFormProps {
  form: AddFormState;
  setForm: Dispatch<SetStateAction<AddFormState>>;
  cats: DbCategory[];
  allergenTypes: DbAllergenType[];
  saving: boolean;
  onSave: () => void;
}

function QRAddForm({ form, setForm, cats, allergenTypes, saving, onSave }: QRAddFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Custom option helpers
  function addOption() {
    setForm(f => ({ ...f, customOptions: [...f.customOptions, { name_ko: "", name_en: "", choices: [{ ko: "", en: "" }] }] }));
  }
  function removeOption(i: number) {
    setForm(f => ({ ...f, customOptions: f.customOptions.filter((_, j) => j !== i) }));
  }
  function updateOptName(i: number, field: "name_ko" | "name_en", val: string) {
    setForm(f => ({ ...f, customOptions: f.customOptions.map((o, j) => j === i ? { ...o, [field]: val } : o) }));
  }
  function addChoice(optIdx: number) {
    setForm(f => ({ ...f, customOptions: f.customOptions.map((o, i) => i === optIdx ? { ...o, choices: [...o.choices, { ko: "", en: "" }] } : o) }));
  }
  function removeChoice(optIdx: number, cIdx: number) {
    setForm(f => ({ ...f, customOptions: f.customOptions.map((o, i) => i === optIdx ? { ...o, choices: o.choices.filter((_, j) => j !== cIdx) } : o) }));
  }
  function updateChoice(optIdx: number, cIdx: number, field: "ko" | "en", val: string) {
    setForm(f => ({
      ...f,
      customOptions: f.customOptions.map((o, i) => i === optIdx
        ? { ...o, choices: o.choices.map((c, j) => j === cIdx ? { ...c, [field]: val } : c) }
        : o
      ),
    }));
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      {/* Image */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-2">이미지</p>
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 flex-shrink-0 bg-[#F0F0F0] flex items-center justify-center overflow-hidden cursor-pointer border border-black/10"
            onClick={() => fileRef.current?.click()}>
            {form.imagePreview
              ? <img src={form.imagePreview} alt="" className="w-full h-full object-cover" />
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
            }
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => fileRef.current?.click()} className="font-sans text-xs px-3 py-1.5 border border-black/20 hover:border-[#174C35] transition-colors text-[#555] hover:text-[#174C35]">
              {form.imagePreview ? "이미지 변경" : "이미지 선택"}
            </button>
            {form.imagePreview && (
              <button onClick={() => setForm(f => ({ ...f, imageFile: null, imagePreview: "" }))} className="font-sans text-xs text-[#bbb] hover:text-red-400 transition-colors text-left">제거</button>
            )}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const file = e.target.files?.[0]; if (file) setForm(f => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) })); }} />
      </div>

      {/* Ko / En names */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-1.5">한글 이름</p>
        <input value={form.ko} onChange={e => setForm(f => ({ ...f, ko: e.target.value }))} placeholder="예: 아메리카노"
          className="w-full font-sans text-sm px-3 py-2.5 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors" />
      </div>
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-1.5">영어 이름</p>
        <input value={form.en} onChange={e => setForm(f => ({ ...f, en: e.target.value }))} placeholder="예: Americano"
          className="w-full font-sans text-sm px-3 py-2.5 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors" />
      </div>

      {/* Price */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-1.5">가격 (원)</p>
        <div className="flex items-center gap-3">
          <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} disabled={form.priceVariable}
            placeholder="예: 4000" className="flex-1 font-sans text-sm px-3 py-2.5 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors disabled:opacity-40" />
          <label className="flex items-center gap-1.5 font-sans text-xs text-[#555] cursor-pointer flex-shrink-0">
            <input type="checkbox" checked={form.priceVariable}
              onChange={e => setForm(f => ({ ...f, priceVariable: e.target.checked, price: "" }))} className="accent-[#174C35]" />
            변동가격
          </label>
        </div>
      </div>

      {/* Season */}
      <label className="flex items-center gap-3 cursor-pointer p-3 border border-black/10 hover:border-[#174C35] transition-colors">
        <input type="checkbox" checked={form.season}
          onChange={e => {
            const checked = e.target.checked;
            const seasonCat = cats.find(c => c.ko === "시즌");
            setForm(f => {
              let ids = [...f.categoryIds];
              if (seasonCat) {
                if (checked && !ids.includes(seasonCat.id)) ids = [...ids, seasonCat.id];
                else if (!checked) ids = ids.filter(id => id !== seasonCat.id);
              }
              return { ...f, season: checked, categoryIds: ids };
            });
          }}
          className="accent-[#174C35] w-4 h-4 flex-shrink-0" />
        <div>
          <p className="font-sans text-sm font-semibold text-[#0D0D0D]">시즌 메뉴</p>
          <p className="font-sans text-xs text-[#888]">선택 시 시즌 뱃지 표시</p>
        </div>
      </label>

      {/* Categories */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-2">카테고리</p>
        <div className="flex flex-wrap gap-2">
          {cats.filter(c => !c.parent_id).map(parent => {
            const subs = cats.filter(c => c.parent_id === parent.id);
            return (
              <div key={parent.id} className="flex flex-col gap-1">
                <p className="font-sans text-[10px] text-[#aaa] font-semibold uppercase tracking-wider">{parent.ko}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(subs.length > 0 ? subs : [parent]).map(cat => {
                    const sel = form.categoryIds.includes(cat.id);
                    return (
                      <button key={cat.id}
                        onClick={() => setForm(f => ({ ...f, categoryIds: sel ? f.categoryIds.filter(id => id !== cat.id) : [...f.categoryIds, cat.id] }))}
                        className="font-sans text-xs px-3 py-1.5 border transition-all"
                        style={sel ? { backgroundColor: GREEN, color: "#fff", borderColor: GREEN } : { color: "#555", borderColor: "rgba(0,0,0,0.15)" }}>
                        {cat.ko}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allergens */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-2">알레르기</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2.5">
          {allergenTypes.map(al => (
            <label key={al.key} className="flex items-center gap-1.5 font-sans text-xs text-[#555] cursor-pointer">
              <input type="checkbox" checked={!!form.allergens[al.key]}
                onChange={e => setForm(f => ({
                  ...f,
                  allergens: e.target.checked
                    ? { ...f.allergens, [al.key]: true }
                    : Object.fromEntries(Object.entries(f.allergens).filter(([k]) => k !== al.key)),
                }))} className="accent-[#174C35]" />
              {al.ko}
            </label>
          ))}
        </div>
      </div>

      {/* ── QR-specific ───────────────────── */}
      <div className="border-t border-black/8 pt-5">
        <p className="font-sans text-xs font-bold text-[#174C35] mb-4 uppercase tracking-wider">QR 전용 설정</p>

        {/* Temp mode */}
        <div className="mb-5">
          <p className="font-sans text-xs font-semibold text-[#555] mb-2">온도 옵션</p>
          <div className="flex flex-wrap gap-2">
            {TEMP_OPTS.map(opt => (
              <button key={opt.value}
                onClick={() => setForm(f => ({ ...f, tempMode: opt.value }))}
                className="font-sans text-xs px-3 py-1.5 border transition-all"
                style={form.tempMode === opt.value
                  ? { backgroundColor: GREEN, color: "#fff", borderColor: GREEN }
                  : { color: "#555", borderColor: "rgba(0,0,0,0.15)" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom options */}
        <div>
          <p className="font-sans text-xs font-semibold text-[#555] mb-2">커스텀 옵션</p>
          <div className="flex flex-col gap-3">
            {form.customOptions.map((opt, optIdx) => (
              <div key={optIdx} className="border border-black/10 p-3 bg-[#FAF7F2]">
                {/* Option name */}
                <div className="flex items-center gap-2 mb-2">
                  <input value={opt.name_ko} onChange={e => updateOptName(optIdx, "name_ko", e.target.value)}
                    placeholder="옵션 이름 (한글, 예: 맛 선택)"
                    className="flex-1 font-sans text-xs px-2 py-1.5 border border-black/15 bg-white outline-none focus:border-[#174C35]" />
                  <input value={opt.name_en} onChange={e => updateOptName(optIdx, "name_en", e.target.value)}
                    placeholder="Option name (EN)"
                    className="flex-1 font-sans text-xs px-2 py-1.5 border border-black/15 bg-white outline-none focus:border-[#174C35]" />
                  <button onClick={() => removeOption(optIdx)} className="text-[#ccc] hover:text-red-400 transition-colors flex-shrink-0 p-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                {/* Choices */}
                <div className="flex flex-col gap-1.5 pl-2 border-l-2 border-black/10">
                  {opt.choices.map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <input value={choice.ko} onChange={e => updateChoice(optIdx, cIdx, "ko", e.target.value)}
                        placeholder="선택지 (한글)"
                        className="flex-1 font-sans text-xs px-2 py-1 border border-black/10 bg-white outline-none focus:border-[#174C35]" />
                      <input value={choice.en} onChange={e => updateChoice(optIdx, cIdx, "en", e.target.value)}
                        placeholder="Choice (EN)"
                        className="flex-1 font-sans text-xs px-2 py-1 border border-black/10 bg-white outline-none focus:border-[#174C35]" />
                      <button onClick={() => removeChoice(optIdx, cIdx)} disabled={opt.choices.length <= 1}
                        className="text-[#ccc] hover:text-red-400 transition-colors flex-shrink-0 disabled:opacity-20 disabled:cursor-not-allowed">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addChoice(optIdx)}
                    className="font-sans text-xs text-[#174C35] hover:underline text-left mt-0.5">
                    + 선택지 추가
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addOption}
              className="w-full py-2.5 font-sans text-xs border-2 border-dashed border-[#174C35]/25 text-[#174C35] hover:border-[#174C35]/50 hover:bg-[#174C35]/5 transition-colors">
              + 옵션 추가
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <button onClick={onSave} disabled={saving}
        className="w-full py-4 font-sans font-semibold text-white transition-opacity"
        style={{ backgroundColor: GREEN, opacity: saving ? 0.6 : 1 }}>
        {saving ? "저장 중..." : "메뉴 추가"}
      </button>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────
export default function QRMenuManager() {
  const [view, setView]         = useState<View>("list");
  const [items, setItems]       = useState<DbMenuItem[]>([]);
  const [overrides, setOverrides] = useState<Map<string, QrOverride>>(new Map());
  const [cats, setCats]         = useState<DbCategory[]>([]);
  const [allergenTypes, setAllergenTypes] = useState<DbAllergenType[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [flash, setFlash]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm]         = useState<AddFormState>(EMPTY);
  const [delItem, setDelItem]   = useState<DbMenuItem | null>(null);
  const [query, setQuery]       = useState("");

  function msg(text: string, ok = true) {
    setFlash({ msg: text, ok });
    setTimeout(() => setFlash(null), 2600);
  }

  async function refreshData() {
    if (!supabase) return;
    const [itemsRes, ovrRes, catsRes, algRes] = await Promise.all([
      supabase.from("site_menu_items").select("*").order("sort_order"),
      supabase.from("site_qr_overrides").select("*"),
      supabase.from("site_categories").select("id, ko, en, parent_id").order("sort_order"),
      supabase.from("site_allergen_types").select("*").order("sort_order"),
    ]);
    setItems(itemsRes.data ?? []);
    setOverrides(new Map((ovrRes.data ?? []).map((o: QrOverride) => [o.menu_item_id, o])));
    setCats(catsRes.data ?? []);
    setAllergenTypes(algRes.data ?? []);
  }

  const fetchAll = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    await refreshData();
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Toggle QR hide ─────────────────────────────────────────
  async function toggleHide(itemId: string) {
    if (!supabase) return;
    const ov = overrides.get(itemId);
    if (ov) {
      const { error } = await supabase.from("site_qr_overrides").update({ hidden: !ov.hidden }).eq("menu_item_id", itemId);
      if (error) { msg("숨김 실패: " + error.message, false); return; }
    } else {
      const { error } = await supabase.from("site_qr_overrides").insert({ menu_item_id: itemId, hidden: true, temp_mode: "both", custom_options: [] });
      if (error) { msg("숨김 실패: " + error.message, false); return; }
    }
    await refreshData();
  }

  // ─── Delete ─────────────────────────────────────────────────
  async function handleDelete() {
    if (!supabase || !delItem) return;
    setSaving(true);
    await supabase.from("site_menu_items").delete().eq("id", delItem.id);
    msg("삭제되었습니다.");
    setDelItem(null); setView("list");
    await refreshData();
    setSaving(false);
  }

  // ─── Upload image ────────────────────────────────────────────
  async function uploadImage(file: File): Promise<string | null> {
    if (!supabase) return null;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file);
    if (error) { msg("이미지 업로드 실패: " + error.message, false); return null; }
    return supabase.storage.from("menu-images").getPublicUrl(path).data.publicUrl;
  }

  // ─── Add menu ────────────────────────────────────────────────
  async function handleAdd() {
    if (!supabase) return;
    if (!form.ko.trim() || !form.en.trim()) { msg("한글/영어 이름을 입력해주세요.", false); return; }
    if (form.categoryIds.length === 0) { msg("카테고리를 하나 이상 선택해주세요.", false); return; }
    setSaving(true);
    try {
      let imageUrl: string | null = form.imagePreview && !form.imageFile ? form.imagePreview : null;
      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile);
        if (!imageUrl) { setSaving(false); return; }
      }
      const price = form.priceVariable ? -1 : (parseInt(form.price.replace(/[^0-9]/g, ""), 10) || 0);

      // Insert to site_menu_items
      const { data: newItem, error } = await supabase.from("site_menu_items").insert({
        ko: form.ko, en: form.en, image_url: imageUrl,
        price, season: form.season, allergens: form.allergens,
        sort_order: items.length,
      }).select("id").single();
      if (error || !newItem) { msg("저장 실패: " + (error?.message ?? "unknown"), false); setSaving(false); return; }

      // Category links
      await supabase.from("site_menu_category_items").insert(
        form.categoryIds.map((cid, i) => ({ menu_item_id: newItem.id, category_id: cid, sort_order: i }))
      );

      // QR override (temp + custom options)
      const needsOverride = form.tempMode !== "both" || form.customOptions.length > 0;
      if (needsOverride) {
        await supabase.from("site_qr_overrides").insert({
          menu_item_id: newItem.id,
          hidden: false,
          temp_mode: form.tempMode,
          custom_options: form.customOptions,
        });
      }

      msg("메뉴가 추가되었습니다!");
      setForm(EMPTY); setView("list");
      await refreshData();
    } catch (e) {
      msg("저장 실패: " + String(e), false);
    }
    setSaving(false);
  }

  // ─── Guards ──────────────────────────────────────────────────
  if (!supabase) {
    return <div className="flex items-center justify-center py-20"><p className="font-sans text-sm text-[#888]">Supabase 미연결</p></div>;
  }
  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="font-sans text-sm text-[#888]">불러오는 중...</p></div>;
  }

  const FlashBanner = flash ? (
    <div className="px-4 py-2.5 font-sans text-xs font-semibold text-center"
      style={{ backgroundColor: flash.ok ? "#dcfce7" : "#fee2e2", color: flash.ok ? "#15803d" : "#dc2626" }}>
      {flash.msg}
    </div>
  ) : null;

  // ─── List view ───────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="flex flex-col">
        {FlashBanner}
        <QRListView
          items={items} overrides={overrides}
          query={query} setQuery={setQuery}
          onToggleHide={toggleHide}
          onDeleteSelect={item => { setDelItem(item); setView("delete_confirm"); }}
          onAddClick={() => { setForm(EMPTY); setView("add"); }}
        />
      </div>
    );
  }

  // ─── Add view ────────────────────────────────────────────────
  if (view === "add") {
    return (
      <div className="flex flex-col">
        <Back label="메뉴 추가" onClick={() => { setView("list"); setForm(EMPTY); }} />
        {FlashBanner}
        <div className="overflow-y-auto">
          <QRAddForm form={form} setForm={setForm} cats={cats} allergenTypes={allergenTypes} saving={saving} onSave={handleAdd} />
        </div>
      </div>
    );
  }

  // ─── Delete confirm ──────────────────────────────────────────
  if (view === "delete_confirm" && delItem) {
    return (
      <div className="flex flex-col">
        <Back label="삭제 확인" onClick={() => { setView("list"); setDelItem(null); }} />
        {FlashBanner}
        <div className="px-4 py-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 p-4 border border-red-100 bg-red-50">
            {delItem.image_url && (
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-[#F0F0F0]">
                <img src={delItem.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <p className="font-sans text-sm font-semibold text-[#0D0D0D]">{delItem.ko}</p>
              <p className="font-sans text-xs text-[#888]">{delItem.en}</p>
              {delItem.price !== -1 && <p className="font-sans text-xs text-[#555] mt-0.5">{delItem.price.toLocaleString("ko-KR")}원</p>}
            </div>
          </div>
          <div className="border border-red-200 bg-red-50 p-3">
            <p className="font-sans text-sm font-semibold text-red-600 mb-1">정말 삭제하시겠습니까?</p>
            <p className="font-sans text-xs text-red-400">메인 사이트와 QR 메뉴에서 즉시 삭제되며 복구할 수 없습니다.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setView("list"); setDelItem(null); }}
              className="flex-1 py-3 font-sans text-sm font-semibold border border-black/15 text-[#555] hover:border-black/30 transition-colors">
              취소
            </button>
            <button onClick={handleDelete} disabled={saving}
              className="flex-1 py-3 font-sans text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors">
              {saving ? "삭제 중..." : "삭제 확인"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
