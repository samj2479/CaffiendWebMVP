import { orderCategories } from "@/app/data/orderMenuData";

export type CatalogLanguage = "ko" | "en";
export type BilingualText = { ko: string; en: string };
export type CatalogOption = { name: BilingualText; choices: BilingualText[] };
export type CatalogIssue = { code: string; itemId: string | null };
export type PublicProduct = {
  id: string | null;
  ko: string;
  en: string;
  categoryKo: string;
  categoryEn: string;
  basePrice: number | null;
  qrPrice: number | null;
  price: number | null;
  qrAvailable: boolean;
  temperature: BilingualText;
  options: CatalogOption[];
};
export type PublicCatalog = {
  source: "database" | "base" | "unavailable";
  products: PublicProduct[];
  issues: CatalogIssue[];
};
export type CatalogPayload = {
  items: unknown;
  categories: unknown;
  links: unknown;
  overrides: unknown;
};

type Row = Record<string, unknown>;
const DRINK_CATS = new Set(["드립/더치", "커피", "논커피", "아인슈페너", "티", "에이드", "스무디", "시즌"]);
const ICE_ONLY = new Set(["사케라또", "바닐라말차샷", "딸기라떼", "초코크림딸기라떼", "로투스 카라멜라떼", "헤이즐토피넛라떼", "옥수수슈페너", "얼그레이 바닐라티라떼", "런던포그", "흑임자 슈페너", "허니딸기블랙티"]);
const HOT_ONLY = new Set(["꿀생강차", "레몬생강차", "유자차"]);
const COFFEE_EXTRA = new Set(["핸드드립 케냐 AA", "에스프레소", "에소 콘파냐", "패션후르츠 콘파냐", "아메리카노", "헤이즐넛 아메리카노", "꿀 아메리카노", "카페라떼", "퐁실 카푸치노", "아가베라떼", "바닐라빈라떼", "돌체라떼", "카라멜마끼야또", "카페모카"]);
const FLAVORS: Record<string, string[]> = {
  "그릭요거트 (그래놀라/딸기/블루베리/망고)": ["그래놀라", "딸기", "블루베리", "망고"],
  "미니 쫀득쿠키": ["딸기&오레오", "말차&오레오", "약과&시나몬", "초코칩", "로투스"],
  "티라미수 볼 (코코아/말차/인절미/로투스)": ["코코아", "말차", "인절미", "로투스"],
  "1인 티라미수": ["밤", "커커이", "초코딸기", "말차딸기", "돼지바", "흑임자", "인절미말차", "우베", "고구마", "쑥절미"],
  "말렌카 (코코아/월넛)": ["코코아", "월넛"],
};
const OPTION_EN: Record<string, string> = {
  "그래놀라": "Granola", "딸기": "Strawberry", "블루베리": "Blueberry", "망고": "Mango", "딸기&오레오": "Strawberry & Oreo", "말차&오레오": "Matcha & Oreo", "약과&시나몬": "Yakgwa & Cinnamon", "초코칩": "Chocolate chip", "로투스": "Lotus", "코코아": "Cocoa", "말차": "Matcha", "인절미": "Injeolmi", "월넛": "Walnut", "밤": "Chestnut", "초코딸기": "Chocolate strawberry", "말차딸기": "Matcha strawberry", "돼지바": "Chocolate crunch", "흑임자": "Black sesame", "인절미말차": "Injeolmi matcha", "우베": "Ube", "고구마": "Sweet potato", "쑥절미": "Mugwort injeolmi",
};

const text = (value: unknown): string => typeof value === "string" ? value.trim() : "";
const amount = (value: unknown): number | null => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
const row = (value: unknown): value is Row => value !== null && typeof value === "object" && !Array.isArray(value);
const rows = (value: unknown): Row[] | null => Array.isArray(value) && value.every(row) ? value : null;
const choice = (ko: string, en?: string): BilingualText => ({ ko, en: en || OPTION_EN[ko] || ko });

/** Mirrors the existing QR temperature selection; it does not change that flow. */
export function catalogTemperature(name: string, category: string, mode?: unknown): BilingualText {
  const isDrink = mode !== "none" && DRINK_CATS.has(category) && !name.includes("아포가토");
  if (!isDrink) return { ko: "온도 선택 없음", en: "No temperature selection" };
  if (mode === "hot") return { ko: "HOT", en: "HOT" };
  if (mode === "ice") return { ko: "ICE", en: "ICE" };
  if (mode === "both") return { ko: "HOT / ICE", en: "HOT / ICE" };
  if (category === "에이드" || category === "스무디" || name.includes("에이드") || name.includes("콜드") || name.includes("아이스") || ICE_ONLY.has(name)) return { ko: "ICE", en: "ICE" };
  if (HOT_ONLY.has(name)) return { ko: "HOT", en: "HOT" };
  return { ko: "HOT / ICE", en: "HOT / ICE" };
}

function productOptions(name: string, raw: unknown, issues: CatalogIssue[], itemId: string | null): CatalogOption[] {
  const options: CatalogOption[] = [];
  if (COFFEE_EXTRA.has(name)) {
    options.push({ name: choice("농도", "Strength"), choices: [choice("연하게", "Light"), choice("보통", "Regular"), choice("진하게", "Strong")] });
    options.push({ name: choice("로스팅", "Roasting"), choices: [choice("라이트", "Light"), choice("미디엄", "Medium"), choice("다크", "Dark")] });
  }
  if (name === "허브티") options.push({ name: choice("종류", "Type"), choices: [choice("캐모마일", "Chamomile"), choice("얼그레이", "Earl Grey"), choice("히비스커스", "Hibiscus"), choice("루이보스", "Rooibos")] });
  if (Array.isArray(raw) && raw.length) {
    for (const option of raw) {
      if (!row(option) || !text(option.name_ko) || !Array.isArray(option.choices) || !option.choices.length) {
        issues.push({ code: "INVALID_OPTION", itemId });
        continue;
      }
      const choices: BilingualText[] = [];
      for (const candidate of option.choices) {
        if (!row(candidate) || !text(candidate.ko)) { issues.push({ code: "INVALID_OPTION_CHOICE", itemId }); continue; }
        if (candidate.price_delta !== undefined && candidate.price_delta !== 0) issues.push({ code: "OPTION_SURCHARGE_NOT_APPLIED_BY_CURRENT_QR", itemId });
        if (!text(candidate.en)) issues.push({ code: "OPTION_ENGLISH_MISSING", itemId });
        choices.push(choice(text(candidate.ko), text(candidate.en)));
      }
      if (!text(option.name_en)) issues.push({ code: "OPTION_ENGLISH_MISSING", itemId });
      options.push({ name: choice(text(option.name_ko), text(option.name_en)), choices });
    }
  } else if (FLAVORS[name]) {
    options.push({ name: choice("맛 선택", "Flavor"), choices: FLAVORS[name].map(value => choice(value)) });
  }
  return options;
}

export function unavailableCatalog(code = "CATALOG_UNAVAILABLE"): PublicCatalog {
  return { source: "unavailable", products: [], issues: [{ code, itemId: null }] };
}

/** Uses only public menu rows. Order, customer, Auth and service credentials are never inputs. */
export function normalizeCatalog(payload: CatalogPayload): PublicCatalog {
  const items = rows(payload.items), categories = rows(payload.categories), links = rows(payload.links), overrides = rows(payload.overrides);
  if (!items || !categories || !links || !overrides) return unavailableCatalog("INVALID_CATALOG_SHAPE");
  const categoryMap = new Map(categories.map(category => [text(category.id), category]));
  const overrideMap = new Map(overrides.map(override => [text(override.menu_item_id), override]));
  const issues: CatalogIssue[] = [];
  const products: PublicProduct[] = [];
  const seen = new Set<string>();
  function visibleCategory(id: string, visited = new Set<string>()): boolean {
    const category = categoryMap.get(id);
    if (!category || category.hidden === true || visited.has(id)) return false;
    visited.add(id);
    return !text(category.parent_id) || visibleCategory(text(category.parent_id), visited);
  }
  for (const item of items) {
    const id = text(item.id);
    if (!id || seen.has(id)) { issues.push({ code: "INVALID_OR_DUPLICATE_ITEM_ID", itemId: id || null }); continue; }
    seen.add(id);
    if (item.hidden_on_main === true) continue;
    const visibleLinks = links.filter(link => text(link.menu_item_id) === id && visibleCategory(text(link.category_id)));
    // Do not expose items outside the public site's category membership.
    if (!visibleLinks.length) continue;
    const category = categoryMap.get(text(visibleLinks[0].category_id))!;
    const ko = text(item.ko), en = text(item.en);
    if (!ko || !en) { issues.push({ code: "ITEM_TRANSLATION_MISSING", itemId: id }); continue; }
    const override = overrideMap.get(id);
    const basePrice = amount(item.price);
    const qrPrice = override?.price_override !== null && override?.price_override !== undefined ? amount(override.price_override) : basePrice;
    const qrAvailable = override?.hidden !== true;
    if (override?.price_override !== null && override?.price_override !== undefined && qrPrice === null) issues.push({ code: "INVALID_QR_PRICE", itemId: id });
    if (qrAvailable && qrPrice !== basePrice) issues.push({ code: "BASE_QR_PRICE_DIFFERENCE", itemId: id });
    if ((qrAvailable ? qrPrice : basePrice) === null) issues.push({ code: "PRICE_REQUIRES_STORE_CONFIRMATION", itemId: id });
    if ((qrAvailable ? qrPrice : basePrice) === 0) issues.push({ code: "ZERO_PRICE_REQUIRES_REVIEW", itemId: id });
    const categoryKo = text(category.ko), categoryEn = text(category.en) || categoryKo;
    products.push({ id, ko, en, categoryKo, categoryEn, basePrice, qrPrice, price: qrAvailable ? qrPrice : basePrice, qrAvailable,
      temperature: catalogTemperature(ko, categoryKo, override?.temp_mode), options: productOptions(ko, override?.custom_options, issues, id) });
  }
  return { source: "database", products, issues };
}

/** The same source fallback used by the unmodified production QR; not a DB snapshot. */
export function buildBaseCatalog(): PublicCatalog {
  const products: PublicProduct[] = [];
  const issues: CatalogIssue[] = [{ code: "DATABASE_IDS_AND_OVERRIDES_NOT_VERIFIED", itemId: null }];
  const seen = new Set<string>();
  for (const category of orderCategories) for (const item of category.items) {
    if (seen.has(item.ko)) continue;
    seen.add(item.ko);
    const price = amount(item.price);
    if (price === null) issues.push({ code: "PRICE_REQUIRES_STORE_CONFIRMATION", itemId: null });
    products.push({ id: null, ko: item.ko, en: item.en, categoryKo: category.ko, categoryEn: category.en,
      basePrice: price, qrPrice: price, price, qrAvailable: true, temperature: catalogTemperature(item.ko, category.ko), options: productOptions(item.ko, undefined, issues, null) });
  }
  return { source: "base", products, issues };
}

export function formatCatalogPrice(value: number | null, lang: CatalogLanguage): string {
  return value === null ? (lang === "ko" ? "매장 확인" : "Ask staff") : lang === "ko" ? `${value.toLocaleString("ko-KR")}원` : `KRW ${value.toLocaleString("en-US")}`;
}
