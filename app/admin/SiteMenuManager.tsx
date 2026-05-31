"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { orderCategories } from "@/app/data/orderMenuData";
import { allergyFlatRows, allergyCols } from "@/app/data/allergyData";

// ─── Types ────────────────────────────────────────────────────
interface DbCategory { id: string; ko: string; en: string; sort_order: number; parent_id: string | null; hidden: boolean; }
interface DbAllergenType { id: string; key: string; ko: string; en: string; is_custom: boolean; sort_order: number; }
interface DbMenuItem {
  id: string; ko: string; en: string; image_url: string | null;
  price: number; season: boolean; allergens: Record<string, boolean>;
  hidden_on_main: boolean; sort_order: number; categoryIds: string[];
}
interface FormState {
  ko: string; en: string; imageFile: File | null; imagePreview: string;
  price: string; priceVariable: boolean; season: boolean;
  categoryIds: string[]; allergens: Record<string, boolean>;
}
type View = "home" | "add" | "edit_list" | "edit_form" | "delete_list" | "delete_confirm" | "categories";

const EMPTY: FormState = {
  ko: "", en: "", imageFile: null, imagePreview: "",
  price: "", priceVariable: false, season: false,
  categoryIds: [], allergens: {},
};
const GREEN = "#174C35";

// ─── Back button ──────────────────────────────────────────────
function Back({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 border-b border-black/8 font-sans text-sm text-[#555] hover:text-[#174C35] transition-colors w-full text-left"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
  );
}

// ─── Menu Form (top-level to prevent remount on parent rerender) ──
interface MenuFormProps {
  isEdit: boolean;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  cats: DbCategory[];
  allergens: DbAllergenType[];
  saving: boolean;
  onSave: () => void;
}

function MenuForm({ isEdit, form, setForm, cats, allergens, saving, onSave }: MenuFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      {/* Image */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-2">이미지</p>
        <div className="flex items-center gap-3">
          <div
            className="w-20 h-20 flex-shrink-0 bg-[#F0F0F0] flex items-center justify-center overflow-hidden cursor-pointer border border-black/10"
            onClick={() => fileRef.current?.click()}
          >
            {form.imagePreview ? (
              <img src={form.imagePreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="font-sans text-xs px-3 py-1.5 border border-black/20 hover:border-[#174C35] transition-colors text-[#555] hover:text-[#174C35]"
            >
              {form.imagePreview ? "이미지 변경" : "이미지 선택"}
            </button>
            {form.imagePreview && (
              <button
                onClick={() => setForm(f => ({ ...f, imageFile: null, imagePreview: "" }))}
                className="font-sans text-xs text-[#bbb] hover:text-red-400 transition-colors text-left"
              >
                제거
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setForm(f => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
          }}
        />
      </div>

      {/* Korean name */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-1.5">한글 이름</p>
        <input
          value={form.ko}
          onChange={(e) => setForm(f => ({ ...f, ko: e.target.value }))}
          placeholder="예: 아메리카노"
          className="w-full font-sans text-sm px-3 py-2.5 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors"
        />
      </div>

      {/* English name */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-1.5">영어 이름</p>
        <input
          value={form.en}
          onChange={(e) => setForm(f => ({ ...f, en: e.target.value }))}
          placeholder="예: Americano"
          className="w-full font-sans text-sm px-3 py-2.5 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors"
        />
      </div>

      {/* Price */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-1.5">가격 (원)</p>
        <div className="flex items-center gap-3">
          <input
            value={form.price}
            onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
            disabled={form.priceVariable}
            placeholder="예: 4000"
            className="flex-1 font-sans text-sm px-3 py-2.5 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors disabled:opacity-40"
          />
          <label className="flex items-center gap-1.5 font-sans text-xs text-[#555] cursor-pointer flex-shrink-0">
            <input
              type="checkbox" checked={form.priceVariable}
              onChange={(e) => setForm(f => ({ ...f, priceVariable: e.target.checked, price: "" }))}
              className="accent-[#174C35]"
            />
            변동가격
          </label>
        </div>
      </div>

      {/* Season */}
      <label className="flex items-center gap-3 cursor-pointer p-3 border border-black/10 hover:border-[#174C35] transition-colors">
        <input
          type="checkbox" checked={form.season}
          onChange={(e) => {
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
          className="accent-[#174C35] w-4 h-4 flex-shrink-0"
        />
        <div>
          <p className="font-sans text-sm font-semibold text-[#0D0D0D]">시즌 메뉴</p>
          <p className="font-sans text-xs text-[#888]">선택 시 메뉴 카드 좌상단에 시즌 뱃지 표시</p>
        </div>
      </label>

      {/* Categories */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-2">카테고리 (중복 선택 가능)</p>
        {cats.length === 0 ? (
          <p className="font-sans text-xs text-[#aaa]">카테고리 없음. 먼저 카테고리 관리에서 추가하세요.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {cats.map(cat => {
              const sel = form.categoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setForm(f => ({
                    ...f,
                    categoryIds: sel ? f.categoryIds.filter(id => id !== cat.id) : [...f.categoryIds, cat.id],
                  }))}
                  className="font-sans text-xs px-3 py-1.5 border transition-all"
                  style={sel ? { backgroundColor: GREEN, color: "#fff", borderColor: GREEN } : { color: "#555", borderColor: "rgba(0,0,0,0.15)" }}
                >
                  {cat.ko}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Allergens */}
      <div>
        <p className="font-sans text-xs font-semibold text-[#555] mb-2">알레르기 정보</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2.5">
          {allergens.map(al => (
            <label key={al.key} className="flex items-center gap-1.5 font-sans text-xs text-[#555] cursor-pointer">
              <input
                type="checkbox" checked={!!form.allergens[al.key]}
                onChange={(e) => setForm(f => ({
                  ...f,
                  allergens: e.target.checked
                    ? { ...f.allergens, [al.key]: true }
                    : Object.fromEntries(Object.entries(f.allergens).filter(([k]) => k !== al.key)),
                }))}
                className="accent-[#174C35]"
              />
              {al.ko}
            </label>
          ))}
        </div>

      </div>

      {/* Save */}
      <button
        onClick={onSave} disabled={saving}
        className="w-full py-4 font-sans font-semibold text-white transition-opacity"
        style={{ backgroundColor: GREEN, opacity: saving ? 0.6 : 1 }}
      >
        {saving ? "저장 중..." : isEdit ? "변경사항 저장" : "메뉴 추가"}
      </button>
    </div>
  );
}

// ─── Menu list ────────────────────────────────────────────────
interface MenuListProps {
  mode: "edit" | "delete";
  items: DbMenuItem[];
  query: string;
  setQuery: (q: string) => void;
  onEdit: (item: DbMenuItem) => void;
  onDeleteSelect: (item: DbMenuItem) => void;
  onToggleHide?: (item: DbMenuItem) => void;
}

function MenuListView({ mode, items, query, setQuery, onEdit, onDeleteSelect, onToggleHide }: MenuListProps) {
  const filtered = query.trim()
    ? items.filter(m => m.ko.includes(query) || m.en.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-black/8 sticky top-0 bg-white z-10">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="메뉴 검색..."
            className="w-full font-sans text-sm pl-8 pr-3 py-2 border border-black/15 bg-[#FAF7F2] outline-none focus:border-[#174C35] transition-colors"
          />
        </div>
      </div>
      <div className="divide-y divide-black/6">
        {filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-[#888] py-16">
            {query ? "검색 결과 없음" : "등록된 메뉴가 없습니다."}
          </p>
        )}
        {filtered.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FAF7F2] transition-colors"
            style={{ opacity: item.hidden_on_main ? 0.45 : 1, transition: "opacity 0.25s ease" }}
          >
            <button
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
              onClick={() => mode === "edit" ? onEdit(item) : onDeleteSelect(item)}
            >
              <div className="w-12 h-12 flex-shrink-0 bg-[#F0F0F0] overflow-hidden">
                {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-semibold text-[#0D0D0D] truncate">{item.ko}</p>
                <p className="font-sans text-xs text-[#888] truncate">{item.en}</p>
                {item.price !== -1 && <p className="font-sans text-xs text-[#aaa]">{item.price.toLocaleString("ko-KR")}원</p>}
              </div>
              {item.season && (
                <span className="font-sans text-[10px] font-bold px-1.5 py-0.5 flex-shrink-0" style={{ backgroundColor: GREEN, color: "#fff" }}>시즌</span>
              )}
            </button>
            {mode === "edit" && onToggleHide && (
              <EyeBtn hidden={item.hidden_on_main} onClick={() => onToggleHide(item)} />
            )}
            <button onClick={() => mode === "edit" ? onEdit(item) : onDeleteSelect(item)} className="flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mode === "delete" ? "#ef4444" : "#bbb"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mode === "edit" ? <path d="M9 18l6-6-6-6" /> : (
                  <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></>
                )}
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Category manager ─────────────────────────────────────────
interface CategoryManagerProps {
  cats: DbCategory[];
  onMove: (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
  onAdd: (ko: string, en: string, parentId?: string) => Promise<void>;
  onToggleHide: (id: string) => void;
}

function UpBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button disabled={disabled} onClick={onClick} className="text-[#bbb] hover:text-[#174C35] disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
    </button>
  );
}
function DnBtn({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button disabled={disabled} onClick={onClick} className="text-[#bbb] hover:text-[#174C35] disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
    </button>
  );
}
function DelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-[#ddd] hover:text-red-400 transition-colors p-1 flex-shrink-0">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  );
}
function EyeBtn({ hidden, onClick }: { hidden: boolean; onClick: () => void }) {
  const [animKey, setAnimKey] = useState(0);
  return (
    <button
      onClick={() => { setAnimKey(k => k + 1); onClick(); }}
      title={hidden ? "표시" : "숨김"}
      className="p-1 flex-shrink-0"
      style={{ color: hidden ? "#bbb" : GREEN, transition: "color 0.2s ease" }}
    >
      <span key={animKey} className={animKey > 0 ? "eye-pop inline-flex" : "inline-flex"}>
        {hidden ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </span>
    </button>
  );
}

function CategoryManager({ cats, onMove, onDelete, onAdd, onToggleHide }: CategoryManagerProps) {
  const [newKo, setNewKo]         = useState("");
  const [newEn, setNewEn]         = useState("");
  const [addSubFor, setAddSubFor] = useState<string | null>(null);
  const [subKo, setSubKo]         = useState("");
  const [subEn, setSubEn]         = useState("");

  const topLevel = cats.filter(c => !c.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const subOf = (parentId: string) => cats.filter(c => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-4 px-4 py-5">

      {/* Hierarchy list */}
      {topLevel.length === 0 && <p className="font-sans text-xs text-[#aaa]">카테고리가 없습니다.</p>}

      <div className="flex flex-col gap-2">
        {topLevel.map((parent, pIdx) => {
          const subs = subOf(parent.id);
          return (
            <div key={parent.id} className="border border-black/10 overflow-hidden">

              {/* Parent row */}
              <div className="flex items-center gap-2 px-3 py-2.5" style={{ backgroundColor: "#F2EDE8", opacity: parent.hidden ? 0.5 : 1, transition: "opacity 0.25s ease" }}>
                <div className="flex flex-col gap-0.5">
                  <UpBtn disabled={pIdx === 0} onClick={() => onMove(parent.id, -1)} />
                  <DnBtn disabled={pIdx === topLevel.length - 1} onClick={() => onMove(parent.id, 1)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-bold text-[#0D0D0D]">{parent.ko}</p>
                  <p className="font-sans text-xs text-[#888]">{parent.en}</p>
                </div>
                <EyeBtn hidden={parent.hidden} onClick={() => onToggleHide(parent.id)} />
                <DelBtn onClick={() => onDelete(parent.id)} />
              </div>

              {/* Sub-category rows */}
              {subs.map((sub, sIdx) => (
                <div key={sub.id} className="flex items-center gap-2 px-3 py-2 pl-8 bg-white border-t border-black/6" style={{ opacity: sub.hidden ? 0.45 : 1, transition: "opacity 0.25s ease" }}>
                  <div className="flex flex-col gap-0.5">
                    <UpBtn disabled={sIdx === 0} onClick={() => onMove(sub.id, -1)} />
                    <DnBtn disabled={sIdx === subs.length - 1} onClick={() => onMove(sub.id, 1)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-[#0D0D0D]">{sub.ko}</p>
                    <p className="font-sans text-xs text-[#888]">{sub.en}</p>
                  </div>
                  <EyeBtn hidden={sub.hidden} onClick={() => onToggleHide(sub.id)} />
                  <DelBtn onClick={() => onDelete(sub.id)} />
                </div>
              ))}

              {/* Add sub-category inline form */}
              {addSubFor === parent.id ? (
                <div className="px-3 py-2.5 pl-8 border-t border-black/6 flex flex-col gap-2" style={{ backgroundColor: "#F7F4F1" }}>
                  <p className="font-sans text-xs font-semibold text-[#174C35]">하위 카테고리 추가</p>
                  <div className="flex gap-2">
                    <input value={subKo} onChange={e => setSubKo(e.target.value)} placeholder="한글" className="flex-1 font-sans text-xs px-2 py-1.5 border border-black/15 bg-white outline-none focus:border-[#174C35] transition-colors" />
                    <input value={subEn} onChange={e => setSubEn(e.target.value)} placeholder="영어" className="flex-1 font-sans text-xs px-2 py-1.5 border border-black/15 bg-white outline-none focus:border-[#174C35] transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => { await onAdd(subKo, subEn, parent.id); setSubKo(""); setSubEn(""); setAddSubFor(null); }}
                      disabled={!subKo.trim() || !subEn.trim()}
                      className="font-sans text-xs px-3 py-1.5 text-white disabled:opacity-40"
                      style={{ backgroundColor: GREEN }}
                    >추가</button>
                    <button onClick={() => { setAddSubFor(null); setSubKo(""); setSubEn(""); }} className="font-sans text-xs px-3 py-1.5 border border-black/15 text-[#888]">취소</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setAddSubFor(parent.id); setSubKo(""); setSubEn(""); }}
                  className="w-full text-left font-sans text-xs px-3 py-2 pl-8 border-t border-black/6 text-[#174C35] hover:bg-[#174C35]/5 transition-colors"
                >
                  + 하위 카테고리 추가
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add top-level category */}
      <div className="border border-[#174C35]/20 p-3 bg-[#174C35]/5">
        <p className="font-sans text-xs font-semibold text-[#174C35] mb-2">새 최상위 카테고리 추가</p>
        <div className="flex flex-col gap-2">
          <input value={newKo} onChange={e => setNewKo(e.target.value)} placeholder="한글 (예: 디저트)" className="w-full font-sans text-sm px-3 py-2 border border-black/15 bg-white outline-none focus:border-[#174C35] transition-colors" />
          <input value={newEn} onChange={e => setNewEn(e.target.value)} placeholder="영어 (예: Desserts)" className="w-full font-sans text-sm px-3 py-2 border border-black/15 bg-white outline-none focus:border-[#174C35] transition-colors" />
          <button
            onClick={async () => { await onAdd(newKo, newEn); setNewKo(""); setNewEn(""); }}
            disabled={!newKo.trim() || !newEn.trim()}
            className="w-full py-2.5 font-sans text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ backgroundColor: GREEN }}
          >
            최상위 카테고리 추가
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────
export default function SiteMenuManager() {
  const [view, setView]           = useState<View>("home");
  const [cats, setCats]           = useState<DbCategory[]>([]);
  const [allergens, setAllergens] = useState<DbAllergenType[]>([]);
  const [items, setItems]         = useState<DbMenuItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [seeding, setSeeding]     = useState(false);
  const [flash, setFlash]         = useState<{ msg: string; ok: boolean } | null>(null);
  const [form, setForm]           = useState<FormState>(EMPTY);
  const [editId, setEditId]       = useState<string | null>(null);
  const [delItem, setDelItem]     = useState<DbMenuItem | null>(null);
  const [query, setQuery]         = useState("");

  function msg(text: string, ok = true) {
    setFlash({ msg: text, ok });
    setTimeout(() => setFlash(null), 2600);
  }

  async function refreshData() {
    if (!supabase) return;
    const [c, a, i, l] = await Promise.all([
      supabase.from("site_categories").select("*").order("sort_order"),
      supabase.from("site_allergen_types").select("*").order("sort_order"),
      supabase.from("site_menu_items").select("*").order("sort_order"),
      supabase.from("site_menu_category_items").select("menu_item_id, category_id"),
    ]);
    setCats(c.data ?? []);
    setAllergens(a.data ?? []);
    const links = l.data ?? [];
    setItems((i.data ?? []).map(row => ({
      ...row,
      categoryIds: links.filter(x => x.menu_item_id === row.id).map(x => x.category_id),
    })));
  }

  const fetchAll = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true);
    await refreshData();
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Seed ───────────────────────────────────────────────────
  async function handleSeed() {
    if (!supabase) return;
    setSeeding(true);
    try {
      const { data: dbCats } = await supabase
        .from("site_categories")
        .insert(orderCategories.map((c, i) => ({ ko: c.ko, en: c.en, sort_order: i })))
        .select();
      if (!dbCats) throw new Error("카테고리 삽입 실패");
      const catMap = new Map(dbCats.map(c => [c.ko, c.id]));

      function getAllergens(koName: string): Record<string, boolean> {
        const base = koName.split("(")[0].trim();
        const row = allergyFlatRows.find(r => r.name === koName) ??
          allergyFlatRows.find(r => r.name.split("(")[0].trim() === base);
        if (!row) return {};
        return Object.fromEntries(allergyCols.filter(c => row[c.key]).map(c => [c.key, true]));
      }

      const seen = new Set<string>();
      const allItems: Array<{ ko: string; en: string; image: string; price: number; season: boolean }> = [];
      for (const cat of orderCategories) {
        for (const item of cat.items) {
          if (!seen.has(item.ko)) {
            seen.add(item.ko);
            allItems.push({ ko: item.ko, en: item.en, image: item.image, price: item.price, season: !!item.season });
          }
        }
      }

      const dbItemsList: Array<{ id: string; ko: string }> = [];
      for (let i = 0; i < allItems.length; i += 50) {
        const { data: ins } = await supabase.from("site_menu_items")
          .insert(allItems.slice(i, i + 50).map((item, j) => ({
            ko: item.ko, en: item.en, image_url: item.image,
            price: item.price, season: item.season,
            allergens: getAllergens(item.ko), sort_order: i + j,
          }))).select("id, ko");
        if (ins) dbItemsList.push(...ins);
      }
      const itemMap = new Map(dbItemsList.map(m => [m.ko, m.id]));

      const links: Array<{ menu_item_id: string; category_id: string; sort_order: number }> = [];
      for (const cat of orderCategories) {
        const catId = catMap.get(cat.ko);
        if (!catId) continue;
        cat.items.forEach((item, j) => {
          const id = itemMap.get(item.ko);
          if (id) links.push({ menu_item_id: id, category_id: catId, sort_order: j });
        });
      }
      for (let i = 0; i < links.length; i += 100)
        await supabase.from("site_menu_category_items").insert(links.slice(i, i + 100));

      msg("기존 데이터 가져오기 완료!");
      await fetchAll();
    } catch (e) {
      msg("초기화 실패: " + String(e), false);
    }
    setSeeding(false);
  }

  // ─── Image upload ────────────────────────────────────────────
  async function uploadImage(file: File): Promise<string | null> {
    if (!supabase) return null;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file);
    if (error) { msg("이미지 업로드 실패: " + error.message, false); return null; }
    const { data: { publicUrl } } = supabase.storage.from("menu-images").getPublicUrl(path);
    return publicUrl;
  }

  // ─── Save item ───────────────────────────────────────────────
  async function handleSave() {
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

      if (editId) {
        await supabase.from("site_menu_items").update({
          ko: form.ko, en: form.en, image_url: imageUrl,
          price, season: form.season, allergens: form.allergens,
          updated_at: new Date().toISOString(),
        }).eq("id", editId);
        await supabase.from("site_menu_category_items").delete().eq("menu_item_id", editId);
        await supabase.from("site_menu_category_items").insert(
          form.categoryIds.map((cid, i) => ({ menu_item_id: editId, category_id: cid, sort_order: i }))
        );
        msg("저장되었습니다!");
      } else {
        const { data: newItem } = await supabase.from("site_menu_items").insert({
          ko: form.ko, en: form.en, image_url: imageUrl,
          price, season: form.season, allergens: form.allergens,
          sort_order: items.length,
        }).select("id").single();
        if (newItem) {
          await supabase.from("site_menu_category_items").insert(
            form.categoryIds.map((cid, i) => ({ menu_item_id: newItem.id, category_id: cid, sort_order: i }))
          );
        }
        msg("메뉴가 추가되었습니다!");
      }
      setForm(EMPTY); setEditId(null); setView("home");
      await refreshData();
    } catch (e) {
      msg("저장 실패: " + String(e), false);
    }
    setSaving(false);
  }

  // ─── Delete ──────────────────────────────────────────────────
  async function handleDelete() {
    if (!supabase || !delItem) return;
    setSaving(true);
    await supabase.from("site_menu_items").delete().eq("id", delItem.id);
    msg("삭제되었습니다.");
    setDelItem(null); setView("home");
    await refreshData();
    setSaving(false);
  }

  // ─── Category CRUD ───────────────────────────────────────────
  async function addCategory(ko: string, en: string, parentId?: string) {
    if (!supabase || !ko.trim() || !en.trim()) return;
    const siblings = cats.filter(c => c.parent_id === (parentId ?? null));
    const { error } = await supabase.from("site_categories").insert({
      ko, en,
      sort_order: siblings.length,
      parent_id: parentId ?? null,
    });
    if (error) { msg("추가 실패: " + error.message, false); return; }
    msg("카테고리 추가됨");
    await refreshData();
  }

  async function moveCat(id: string, dir: -1 | 1) {
    if (!supabase) return;
    const cat = cats.find(c => c.id === id);
    if (!cat) return;
    const siblings = cats.filter(c => c.parent_id === cat.parent_id).sort((a, b) => a.sort_order - b.sort_order);
    const idx = siblings.findIndex(c => c.id === id);
    const swap = idx + dir;
    if (swap < 0 || swap >= siblings.length) return;
    await supabase.from("site_categories").update({ sort_order: siblings[swap].sort_order }).eq("id", siblings[idx].id);
    await supabase.from("site_categories").update({ sort_order: siblings[idx].sort_order }).eq("id", siblings[swap].id);
    await refreshData();
  }

  async function toggleHideItem(item: DbMenuItem) {
    if (!supabase) return;
    await supabase.from("site_menu_items").update({ hidden_on_main: !item.hidden_on_main }).eq("id", item.id);
    await refreshData();
  }

  async function toggleHideCat(id: string) {
    if (!supabase) return;
    const cat = cats.find(c => c.id === id);
    if (!cat) return;
    const nowHiding = !cat.hidden;

    // Update this category
    const { error } = await supabase.from("site_categories").update({ hidden: nowHiding }).eq("id", id);
    if (error) { msg("카테고리 숨김 실패: " + error.message, false); return; }

    // Cascade to sub-categories
    const childIds = cats.filter(c => c.parent_id === id).map(c => c.id);
    if (childIds.length > 0) {
      await supabase.from("site_categories").update({ hidden: nowHiding }).in("id", childIds);
    }

    // Cascade to all menu items in affected categories
    const affectedCatIds = [id, ...childIds];
    const { data: links } = await supabase
      .from("site_menu_category_items")
      .select("menu_item_id")
      .in("category_id", affectedCatIds);
    if (links && links.length > 0) {
      const itemIds = [...new Set(links.map(l => l.menu_item_id))];
      await supabase.from("site_menu_items").update({ hidden_on_main: nowHiding }).in("id", itemIds);
    }

    await refreshData();
  }

  async function deleteCat(id: string) {
    if (!supabase) return;
    if (items.some(m => m.categoryIds.includes(id))) {
      msg("이 카테고리에 메뉴가 있습니다. 먼저 메뉴를 이동하세요.", false); return;
    }
    if (cats.some(c => c.parent_id === id)) {
      msg("하위 카테고리가 있습니다. 먼저 하위 카테고리를 삭제하세요.", false); return;
    }
    await supabase.from("site_categories").delete().eq("id", id);
    msg("카테고리 삭제됨");
    await refreshData();
  }

  function openEdit(item: DbMenuItem) {
    setForm({
      ko: item.ko, en: item.en, imageFile: null, imagePreview: item.image_url ?? "",
      price: item.price === -1 ? "" : String(item.price),
      priceVariable: item.price === -1, season: item.season,
      categoryIds: [...item.categoryIds], allergens: { ...item.allergens },
    });
    setEditId(item.id); setView("edit_form");
  }

  // ─── Guards ──────────────────────────────────────────────────
  if (!supabase) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-2">
        <p className="font-sans text-sm font-semibold text-[#0D0D0D]">Supabase 미연결</p>
        <p className="font-sans text-xs text-[#aaa]">환경변수 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY 확인 필요</p>
      </div>
    );
  }
  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="font-sans text-sm text-[#888]">불러오는 중...</p></div>;
  }

  const FlashBanner = flash ? (
    <div
      className="px-4 py-2.5 font-sans text-xs font-semibold text-center"
      style={{ backgroundColor: flash.ok ? "#dcfce7" : "#fee2e2", color: flash.ok ? "#15803d" : "#dc2626" }}
    >
      {flash.msg}
    </div>
  ) : null;

  // ─── Render ──────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div className="flex flex-col">
        {FlashBanner}
        {items.length === 0 && (
          <div className="mx-4 mt-4 p-4 border border-[#174C35]/20 bg-[#174C35]/5">
            <p className="font-sans text-xs font-semibold text-[#174C35] mb-1">데이터 초기화</p>
            <p className="font-sans text-xs text-[#555] mb-3">기존 메뉴 데이터를 Supabase로 가져옵니다 (최초 1회)</p>
            <button
              onClick={handleSeed} disabled={seeding}
              className="w-full py-2.5 font-sans text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: GREEN }}
            >
              {seeding ? "가져오는 중..." : "기존 데이터 가져오기"}
            </button>
          </div>
        )}
        <div className="px-4 py-4 flex flex-col gap-3">
          {items.length > 0 && <p className="font-sans text-xs text-[#888]">총 {items.length}개 메뉴 · {cats.length}개 카테고리</p>}
          {([
            { label: "메뉴 추가", desc: "새 메뉴를 추가합니다", v: "add" },
            { label: "메뉴 변경", desc: "기존 메뉴 정보를 수정합니다", v: "edit_list" },
            { label: "메뉴 삭제", desc: "메뉴를 영구적으로 삭제합니다", v: "delete_list" },
            { label: "카테고리 관리", desc: "카테고리 추가/순서 변경", v: "categories" },
          ] as { label: string; desc: string; v: View }[]).map(({ label, desc, v }) => (
            <button
              key={v} onClick={() => { setQuery(""); setView(v); }}
              className="w-full flex items-center gap-4 p-4 bg-[#FAF7F2] border border-black/8 hover:border-[#174C35] hover:shadow-sm transition-all text-left group"
            >
              <div className="flex-1">
                <p className="font-sans text-sm font-semibold text-[#0D0D0D] group-hover:text-[#174C35] transition-colors">{label}</p>
                <p className="font-sans text-xs text-[#888] mt-0.5">{desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#bbb] group-hover:text-[#174C35] transition-colors flex-shrink-0"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === "add") {
    return (
      <div className="flex flex-col">
        <Back label="메뉴 추가" onClick={() => { setView("home"); setForm(EMPTY); }} />
        {FlashBanner}
        <div className="overflow-y-auto">
          <MenuForm isEdit={false} form={form} setForm={setForm} cats={cats} allergens={allergens} saving={saving} onSave={handleSave} />
        </div>
      </div>
    );
  }

  if (view === "edit_list") {
    return (
      <div className="flex flex-col">
        <Back label="메뉴 선택 (변경)" onClick={() => { setView("home"); setQuery(""); }} />
        {FlashBanner}
        <MenuListView mode="edit" items={items} query={query} setQuery={setQuery} onEdit={openEdit} onDeleteSelect={() => {}} onToggleHide={toggleHideItem} />
      </div>
    );
  }

  if (view === "edit_form") {
    return (
      <div className="flex flex-col">
        <Back label="메뉴 변경" onClick={() => { setView("edit_list"); setForm(EMPTY); setEditId(null); }} />
        {FlashBanner}
        <div className="overflow-y-auto">
          <MenuForm isEdit={true} form={form} setForm={setForm} cats={cats} allergens={allergens} saving={saving} onSave={handleSave} />
        </div>
      </div>
    );
  }

  if (view === "delete_list") {
    return (
      <div className="flex flex-col">
        <Back label="메뉴 선택 (삭제)" onClick={() => { setView("home"); setQuery(""); }} />
        {FlashBanner}
        <MenuListView mode="delete" items={items} query={query} setQuery={setQuery} onEdit={() => {}} onDeleteSelect={(item) => { setDelItem(item); setView("delete_confirm"); }} />
      </div>
    );
  }

  if (view === "delete_confirm" && delItem) {
    return (
      <div className="flex flex-col">
        <Back label="삭제 확인" onClick={() => { setView("delete_list"); setDelItem(null); }} />
        {FlashBanner}
        <div className="px-4 py-6 flex flex-col gap-5">
          <div className="flex items-center gap-3 p-4 border border-red-100 bg-red-50">
            {delItem.image_url && (
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-[#F0F0F0]">
                <img src={delItem.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-semibold text-[#0D0D0D]">{delItem.ko}</p>
              <p className="font-sans text-xs text-[#888]">{delItem.en}</p>
              {delItem.price !== -1 && <p className="font-sans text-xs text-[#555] mt-0.5">{delItem.price.toLocaleString("ko-KR")}원</p>}
              <div className="flex flex-wrap gap-1 mt-1">
                {delItem.categoryIds.map(cid => {
                  const cat = cats.find(c => c.id === cid);
                  return cat ? <span key={cid} className="font-sans text-[10px] px-1.5 py-0.5 border border-[#174C35]/30 text-[#174C35]">{cat.ko}</span> : null;
                })}
              </div>
            </div>
          </div>
          <div className="border border-red-200 bg-red-50 p-3">
            <p className="font-sans text-sm font-semibold text-red-600 mb-1">정말 삭제하시겠습니까?</p>
            <p className="font-sans text-xs text-red-400">이 작업은 되돌릴 수 없습니다. 메인 사이트와 QR 메뉴에서 즉시 삭제됩니다.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setView("delete_list"); setDelItem(null); }} className="flex-1 py-3 font-sans text-sm font-semibold border border-black/15 text-[#555] hover:border-black/30 transition-colors">취소</button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 py-3 font-sans text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors">
              {saving ? "삭제 중..." : "삭제 확인"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "categories") {
    return (
      <div className="flex flex-col">
        <Back label="카테고리 관리" onClick={() => setView("home")} />
        {FlashBanner}
        <CategoryManager cats={cats} onMove={moveCat} onDelete={deleteCat} onAdd={(ko, en, parentId) => addCategory(ko, en, parentId)} onToggleHide={toggleHideCat} />
      </div>
    );
  }

  return null;
}
