import type { PublicCatalog, PublicProduct } from "./catalog";

/**
 * The merchant confirmed QR-hidden items are discontinued (2026-11-04).
 * Apply that decision only to the new read-only public guides.
 * Existing photo menus, QR logic and database records remain unchanged.
 */
export function getListedPublicProducts(catalog: PublicCatalog): PublicProduct[] {
  if (catalog.source !== "database") return [];
  return catalog.products.filter(product => product.id !== null && product.qrAvailable);
}
