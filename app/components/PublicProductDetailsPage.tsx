import Image from "next/image";
import { getPublicCatalog } from "@/lib/public-info/catalog-server";
import { formatCatalogPrice, type CatalogLanguage, type PublicCatalog } from "@/lib/public-info/catalog";
import { getListedPublicProducts } from "@/lib/public-info/public-products";
import { getPublicProductDetails } from "@/lib/public-info/product-details";

export function PublicProductDetailsContent({ catalog, lang }: { catalog: PublicCatalog; lang: CatalogLanguage }) {
  const en = lang === "en";
  const prefix = en ? "/en" : "";
  const details = getPublicProductDetails(getListedPublicProducts(catalog));
  const unavailable = catalog.source !== "database";

  return (
    <main lang={lang} className="min-h-screen bg-[#FAF7F2] px-6 pt-[100px] pb-20 text-black md:px-12 md:pt-[140px] md:pb-28">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-tight font-bold tracking-[-0.02em]">{en ? "MENU DETAILS" : "상품 정보"}</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-black/60">{en ? "Photos and features of selected menu items. View the price guide for the full menu and prices." : "일부 메뉴의 사진과 특징을 확인하세요. 전체 메뉴와 가격은 상품·가격 안내에서 볼 수 있습니다."}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={`${prefix}/menu/prices`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#174C35] px-8 py-3.5 font-sans text-sm tracking-widest text-white uppercase transition-colors duration-300 hover:bg-[#0D3224] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174C35]">{en ? "Menu & prices" : "상품·가격 안내"}</a>
            <a href={`${prefix}/menu`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#174C35] px-8 py-3.5 font-sans text-sm tracking-widest text-[#174C35] uppercase transition-colors duration-300 hover:bg-[#174C35] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174C35]">{en ? "Photo menu" : "사진 메뉴 보기"}</a>
          </div>
        </header>

        {unavailable || details.length === 0 ? (
          <div role="status" className="mx-auto mt-16 max-w-xl border-y border-[#174C35]/20 py-10 text-center">
            <h2 className="text-xl font-semibold text-[#174C35]">{unavailable ? (en ? "Menu information is temporarily unavailable" : "메뉴 정보를 잠시 불러올 수 없습니다") : (en ? "No menu details are currently available" : "현재 표시할 상품 정보가 없습니다")}</h2>
            <p className="mt-3 text-sm leading-6 text-black/60">{en ? "Please check with staff." : "매장 직원에게 확인해 주세요."}</p>
          </div>
        ) : (
          <div className="mt-14 space-y-12 md:mt-20 md:space-y-16">
            {details.map(({ product, detail }) => (
              <article key={detail.productId} data-product-detail-id={detail.productId} data-product-detail-price={product.price ?? ""} className="grid min-w-0 gap-7 border-b border-[#174C35]/20 pb-12 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:items-center md:gap-12 md:pb-16">
                <Image src={detail.photo} alt={en ? `${product.en} menu photo` : `${product.ko} 메뉴 사진`} width={440} height={440} unoptimized className="aspect-square h-auto w-full object-contain" />
                <div className="min-w-0 wrap-anywhere">
                  <p className="text-xs tracking-widest text-black/55">{en ? product.categoryEn : product.categoryKo}</p>
                  <h2 className="mt-3 font-serif text-2xl font-bold text-[#174C35] sm:text-3xl">{en ? product.en : product.ko}</h2>
                  <p className="mt-4 text-xl font-semibold text-[#174C35] tabular-nums">{formatCatalogPrice(product.price, lang)} <span className="text-xs font-normal text-black/55">/ {en ? "1 menu item" : "메뉴 1개"}</span></p>
                  <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-7 text-black/70">{detail.features[lang].map(feature => <li key={feature}>{feature}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default async function PublicProductDetailsPage({ lang }: { lang: CatalogLanguage }) {
  return <PublicProductDetailsContent catalog={await getPublicCatalog()} lang={lang} />;
}
