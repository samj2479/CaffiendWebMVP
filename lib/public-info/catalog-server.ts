import "server-only";
import { normalizeCatalog, unavailableCatalog, type PublicCatalog } from "./catalog";

const READS = {
  items: ["site_menu_items", "id,ko,en,image_url,price,season,hidden_on_main"],
  categories: ["site_categories", "id,ko,en,parent_id,hidden,sort_order"],
  links: ["site_menu_category_items", "menu_item_id,category_id,sort_order"],
  overrides: ["site_qr_overrides", "menu_item_id,hidden,price_override,temp_mode,custom_options"],
} as const;

export type CatalogReadOptions = { url?: string; anonKey?: string; fetcher?: typeof fetch };

function isPublicKey(key: string): boolean {
  if (key.startsWith("sb_publishable_")) return true;
  try {
    const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString("utf8"));
    return payload.role === "anon";
  } catch { return false; }
}

/** Only four anonymous GETs. No Supabase mutation client, orders, Auth or service keys. */
export async function getPublicCatalog(options: CatalogReadOptions = {}): Promise<PublicCatalog> {
  // Property lookup keeps Next.js from inlining this server-only configuration at build time.
  const url = options.url ?? (Reflect.get(process.env, "NEXT_PUBLIC_SUPABASE_URL") as string | undefined) ?? "";
  const key = options.anonKey ?? (Reflect.get(process.env, "NEXT_PUBLIC_SUPABASE_ANON_KEY") as string | undefined) ?? "";
  const fetcher = options.fetcher ?? fetch;
  if (!url && !key) return unavailableCatalog("PUBLIC_CATALOG_NOT_CONFIGURED");
  let origin: URL;
  try {
    origin = new URL(url);
    if (origin.protocol !== "https:" || !/^[a-z0-9]+\.supabase\.co$/.test(origin.hostname) || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash || !isPublicKey(key)) return unavailableCatalog("PUBLIC_CATALOG_CONFIG_INVALID");
  } catch { return unavailableCatalog("PUBLIC_CATALOG_CONFIG_INVALID"); }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const results = await Promise.all(Object.entries(READS).map(async ([name, [table, fields]]) => {
      const endpoint = new URL(`/rest/v1/${table}`, origin);
      endpoint.searchParams.set("select", fields);
      endpoint.searchParams.set("limit", "1000");
      if (name === "items" || name === "categories" || name === "links") endpoint.searchParams.set("order", "sort_order.asc");
      const response = await fetcher(endpoint, { method: "GET", headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store", redirect: "error", signal: controller.signal });
      if (!response.ok) throw new Error("CATALOG_READ_FAILED");
      const value: unknown = await response.json();
      if (!Array.isArray(value) || value.length >= 1000) throw new Error("CATALOG_READ_INCOMPLETE");
      return [name, value] as const;
    }));
    const data = Object.fromEntries(results);
    return normalizeCatalog({ items: data.items, categories: data.categories, links: data.links, overrides: data.overrides });
  } catch {
    // A configured outage must not silently substitute stale fallback prices.
    return unavailableCatalog("PUBLIC_CATALOG_READ_FAILED");
  } finally { clearTimeout(timer); controller.abort(); }
}
