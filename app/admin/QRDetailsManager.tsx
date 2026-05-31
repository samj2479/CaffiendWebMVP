"use client";

import { useState, useEffect, useRef, useCallback, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";

// ─── Shared types ─────────────────────────────────────────────
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
interface CustomOption { name_ko: string; name_en: string; choices: { ko: string; en: string }[]; }
type TempMode = "both" | "hot" | "ice" | "none";
type View = "list" | "edit";

interface FormState {
  ko: string; en: string; imageFile: File | null; imagePreview: string;
  price: string; priceVariable: boolean; season: boolean;
  categoryIds: string[]; allergens: Record<string, boolean>;
  tempMode: TempMode; customOptions: CustomOption[];
}
const EMPTY: FormState = {
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
const TEMP_LABELS: Record<TempMode, string> = { both: "HOT/ICE", hot: "HOT 고정", ice: "ICE 고정", none: "온도없음" };

// ─── Back button ─────────────────────────────────────────────
function Back({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-3 border-b border-black/8 font-sans text-sm text-[#555] hover:text-[#174C35] transition-colors w-full text-left">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      {label}
    </button>
  );
}

// ─── Edit Form ────────────────────────────────────────────────
interface EditFormProps {
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  cats: DbCategory[];
  allergenTypes: DbAllergenType[];
  saving: boolean;
  onSave: () => void;
}

function QREditForm({ form, setForm, cats, allergenTypes, saving, onSave }: EditFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);

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
            <button onClick={() => fileRef.current?.click()} className="font-sans text-xs px-3 py-1.5 border border-black/20 hover:border-[#174C35] transition-colors text-[#555]">
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

      {/* Names */}
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
        <div className="flex flex-col gap-2">
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

      {/* ── QR 전용 ──────────────────────── */}
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
                <div className="flex items-center gap-2 mb-2">
                  <input value={opt.name_ko} onChange={e => updateOptName(optIdx, "name_ko", e.target.value)}
                    placeholder="옵션 이름 (한글)" className="flex-1 font-sans text-xs px-2 py-1.5 border border-black/15 bg-white outline-none focus:border-[#174C35]" />
                  <input value={opt.name_en} onChange={e => updateOptName(optIdx, "name_en", e.target.value)}
                    placeholder="Option name (EN)" className="flex-1 font-sans text-xs px-2 py-1.5 border border-black/15 bg-white outline-none focus:border-[#174C35]" />
                  <button onClick={() => removeOption(optIdx)} className="text-[#ccc] hover:text-red-400 transition-colors flex-shrink-0 p-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="flex flex-col gap-1.5 pl-2 border-l-2 border-black/10">
                  {opt.choices.map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <input value={choice.ko} onChange={e => updateChoice(optIdx, cIdx, "ko", e.target.value)}
                        placeholder="선택지 (한글)" className="flex-1 font-sans text-xs px-2 py-1 border border-black/10 bg-white outline-none focus:border-[#174C35]" />
                      <input value={choice.en} onChange={e => updateChoice(optIdx, cIdx, "en", e.target.value)}
                        placeholder="Choice (EN)" className="flex-1 font-sans text-xs px-2 py-1 border border-black/10 bg-white outline-none focus:border-[#174C35]" />
                      <button onClick={() => removeChoice(optIdx, cIdx)} disabled={opt.choices.length <= 1}
                        className="text-[#ccc] hover:text-red-400 transition-colors flex-shrink-0 disabled:opacity-20 disabled:cursor-not-allowed">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addChoice(optIdx)} className="font-sans text-xs text-[#174C35] hover:underline text-left mt-0.5">+ 선택지 추가</button>
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
        {saving ? "저장 중..." : "변경사항 저장"}
      </button>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────
export default function QRDetailsManager() {
  const [view, setView]         = useState<View>("list");
  const [items, setItems]       = useState<DbMenuItem[]>([]);
  const [overrides, setOverrides] = useState<Map<string, QrOverride>>(new Map());
  const [cats, setCats]         = useState<DbCategory[]>([]);
  const [allergenTypes, setAllergenTypes] = useState<DbAllergenType[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [flash, setFlash]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  // ─── Open edit form pre-filled ───────────────────────────────
  async function openEdit(item: DbMenuItem) {
    if (!supabase) return;
    const { data: links } = await supabase
      .from("site_menu_category_items")
      .select("category_id")
      .eq("menu_item_id", item.id);
    const ov = overrides.get(item.id);
    setForm({
      ko: item.ko,
      en: item.en,
      imageFile: null,
      imagePreview: item.image_url ?? "",
      price: item.price === -1 ? "" : String(item.price),
      priceVariable: item.price === -1,
      season: item.season,
      categoryIds: links?.map((l: { category_id: string }) => l.category_id) ?? [],
      allergens: item.allergens ?? {},
      tempMode: (ov?.temp_mode ?? "both") as TempMode,
      customOptions: ov?.custom_options ?? [],
    });
    setEditingId(item.id);
    setView("edit");
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

  // ─── Save edits ──────────────────────────────────────────────
  async function handleSave() {
    if (!supabase || !editingId) return;
    if (!form.ko.trim() || !form.en.trim()) { msg("한글/영어 이름을 입력해주세요.", false); return; }
    setSaving(true);
    try {
      let imageUrl: string | null = form.imagePreview && !form.imageFile ? form.imagePreview : null;
      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile);
        if (!imageUrl) { setSaving(false); return; }
      }
      const price = form.priceVariable ? -1 : (parseInt(form.price.replace(/[^0-9]/g, ""), 10) || 0);

      // Update site_menu_items (non-blocking — doesn't stop QR override save on failure)
      await supabase.from("site_menu_items").update({
        ko: form.ko, en: form.en, image_url: imageUrl,
        price, season: form.season, allergens: form.allergens,
      }).eq("id", editingId);

      // Update category links
      await supabase.from("site_menu_category_items").delete().eq("menu_item_id", editingId);
      if (form.categoryIds.length > 0) {
        await supabase.from("site_menu_category_items").insert(
          form.categoryIds.map((cid, i) => ({ menu_item_id: editingId, category_id: cid, sort_order: i }))
        );
      }

      // Upsert QR override — preserve existing hidden status
      const existingHidden = overrides.get(editingId)?.hidden ?? false;
      const { error: ovrErr } = await supabase.from("site_qr_overrides").upsert({
        menu_item_id: editingId,
        hidden: existingHidden,
        temp_mode: form.tempMode,
        custom_options: form.customOptions,
      }, { onConflict: "menu_item_id" });
      if (ovrErr) { msg("QR 설정 저장 실패: " + ovrErr.message, false); setSaving(false); return; }

      msg("저장되었습니다!");
      setForm(EMPTY); setEditingId(null); setView("list");
      await refreshData();
    } catch (e) {
      msg("저장 실패: " + String(e), false);
    }
    setSaving(false);
  }

  // ─── Guards ──────────────────────────────────────────────────
  if (!supabase) return <div className="flex items-center justify-center py-20"><p className="font-sans text-sm text-[#888]">Supabase 미연결</p></div>;
  if (loading) return <div className="flex items-center justify-center py-20"><p className="font-sans text-sm text-[#888]">불러오는 중...</p></div>;

  const FlashBanner = flash ? (
    <div className="px-4 py-2.5 font-sans text-xs font-semibold text-center"
      style={{ backgroundColor: flash.ok ? "#dcfce7" : "#fee2e2", color: flash.ok ? "#15803d" : "#dc2626" }}>
      {flash.msg}
    </div>
  ) : null;

  const filtered = query.trim()
    ? items.filter(m => m.ko.includes(query) || m.en.toLowerCase().includes(query.toLowerCase()))
    : items;

  // ─── List view ───────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="flex flex-col">
        {FlashBanner}
        <div className="px-4 py-3 border-b border-black/8 sticky top-0 bg-white z-10">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="메뉴 검색..."
              className="w-full font-sans text-sm pl-8 pr-3 py-2 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors" />
          </div>
        </div>
        <div className="divide-y divide-black/6">
          {filtered.length === 0 && (
            <p className="text-center font-sans text-sm text-[#888] py-16">{query ? "검색 결과 없음" : "등록된 메뉴가 없습니다."}</p>
          )}
          {filtered.map(item => {
            const ov = overrides.get(item.id);
            const tempMode = (ov?.temp_mode ?? "both") as TempMode;
            const hasOpts = ov?.custom_options && ov.custom_options.length > 0;
            return (
              <button key={item.id} onClick={() => openEdit(item)}
                className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FAF7F2] transition-colors text-left w-full">
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
                    {tempMode !== "both" && (
                      <span className="font-sans text-[10px] px-1.5 py-0.5 border border-[#174C35]/30 text-[#174C35]">
                        {TEMP_LABELS[tempMode]}
                      </span>
                    )}
                    {hasOpts && (
                      <span className="font-sans text-[10px] px-1.5 py-0.5 border border-black/15 text-[#888]">
                        옵션 {ov!.custom_options.length}개
                      </span>
                    )}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Edit view ───────────────────────────────────────────────
  if (view === "edit") {
    return (
      <div className="flex flex-col">
        <Back label="메뉴 선택으로 돌아가기" onClick={() => { setView("list"); setForm(EMPTY); setEditingId(null); }} />
        {FlashBanner}
        <div className="overflow-y-auto">
          <QREditForm form={form} setForm={setForm} cats={cats} allergenTypes={allergenTypes} saving={saving} onSave={handleSave} />
        </div>
      </div>
    );
  }

  return null;
}
