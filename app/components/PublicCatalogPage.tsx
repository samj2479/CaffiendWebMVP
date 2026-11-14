import { getPublicCatalog } from "@/lib/public-info/catalog-server";
import { formatCatalogPrice, type CatalogLanguage, type PublicCatalog } from "@/lib/public-info/catalog";
import { getListedPublicProducts } from "@/lib/public-info/public-products";

export function PublicCatalogContent({ catalog, lang }: { catalog: PublicCatalog; lang: CatalogLanguage }) {
  const en = lang === "en";
  const prefix = en ? "/en" : "";
  const categories = new Map<string, { name: string; products: PublicCatalog["products"] }>();

  for (const product of getListedPublicProducts(catalog)) {
    let category = categories.get(product.categoryKo);
    if (!category) {
      category = { name: en ? product.categoryEn : product.categoryKo, products: [] };
      categories.set(product.categoryKo, category);
    }
    category.products.push(product);
  }
  return (
    <main lang={lang} className="min-h-screen bg-[#FAF7F2] px-6 pt-[100px] pb-20 text-black md:px-12 md:pt-[140px] md:pb-28">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight font-bold tracking-[-0.02em]">
            {en ? "MENU & PRICES" : "상품·가격 안내"}
          </h1>
          <a
            href={`${prefix}/menu`}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#174C35] px-8 py-3.5 font-sans text-sm tracking-widest text-white uppercase transition-colors duration-300 hover:bg-[#0D3224] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174C35]"
          >
            {en ? "Photo menu" : "사진 메뉴 보기"}
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h13M11 5l5 5-5 5" /></svg>
          </a>
          <p className="mt-4 text-sm text-[#174C35]">
            <a href={`${prefix}/menu/details`} className="underline underline-offset-4 hover:text-[#0D3224]">
              {en ? "Product details" : "상품정보 보기"}
            </a>
          </p>
        </header>
        {catalog.source === "base" && <p role="note" className="mt-10 text-center text-sm leading-6 text-black/60">{en ? "Base menu · check current prices and availability with staff." : "기본 메뉴 · 최신 가격과 판매 여부는 매장에서 확인해 주세요."}</p>}
        {catalog.source === "unavailable" ? (
          <div role="status" className="mx-auto mt-16 max-w-xl border-y border-[#174C35]/20 py-10 text-center">
            <h2 className="text-xl font-semibold text-[#174C35]">{en ? "Menu information is temporarily unavailable" : "메뉴 정보를 잠시 불러올 수 없습니다"}</h2>
            <p className="mt-3 text-sm text-black/60">{en ? "Please check with staff. No order has been placed." : "매장에서 확인해 주세요. 주문은 생성되지 않았습니다."}</p>
          </div>
        ) : (
          <div className="mt-14 columns-1 gap-x-16 md:mt-20 md:columns-2 lg:gap-x-24">
            {Array.from(categories, ([key, category]) => (
              <section key={key} className="mb-12 break-inside-avoid" aria-label={category.name}>
                <h2 className="border-b-2 border-[#174C35] pb-4 font-serif text-2xl font-bold text-[#174C35]">{category.name}</h2>
                <dl className="divide-y divide-[#174C35]/10">
                  {category.products.map((product, index) => (
                    <div key={product.id ?? `${product.ko}-${index}`} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-4" data-product-id={product.id ?? undefined} data-product-price={product.price ?? ""}>
                      <dt className="min-w-0 text-sm leading-6 wrap-break-word sm:text-base">{en ? product.en : product.ko}</dt>
                      <dd className="text-right text-sm leading-6 font-semibold whitespace-nowrap text-[#174C35] tabular-nums sm:text-base">{formatCatalogPrice(product.price, lang)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        )}
        {catalog.source !== "unavailable" && <p className="mt-4 border-t border-[#174C35]/20 pt-6 text-xs leading-6 text-black/55">{en ? "Prices are per menu item. Please check current availability with staff." : "가격은 메뉴 1개 기준입니다. 현재 판매 가능 여부는 매장에서 확인해 주세요."}</p>}
      </div>
    </main>
  );
}

export default async function PublicCatalogPage({ lang }: { lang: CatalogLanguage }) {
  return <PublicCatalogContent catalog={await getPublicCatalog()} lang={lang} />;
}
