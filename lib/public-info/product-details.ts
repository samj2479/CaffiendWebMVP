import type { CatalogLanguage, PublicProduct } from "./catalog";

export type ProductDetailSource = {
  productId: string;
  sourceCharacter: "P" | "D" | "C" | "B" | "M" | "L";
  photo: string;
  features: Record<CatalogLanguage, readonly string[]>;
};

/**
 * Existing real-menu photos and exact KO/EN photo-feature copy, reused from
 * dessert-friends/original/characters.js and dessert-friends/english.ts.
 * These are descriptions of the existing photographs, not new recipe,
 * quantity, allergen or preparation-time claims. Discontinued S/T are omitted.
 */
export const PUBLIC_PRODUCT_DETAILS: readonly ProductDetailSource[] = [
  {
    productId: "550b5f65-dae8-4dc1-8719-e8acc91cc469",
    sourceCharacter: "P",
    photo: "/dessert-friends/assets/references/P.jpg",
    features: {
      ko: ["가루를 입힌 둥근 수플레 윗면", "부채처럼 둘러진 얇은 복숭아", "옆에 놓인 아이스크림 한 스쿱"],
      en: ["A round soufflé with a dusted top", "Thin peach slices arranged like a fan", "A scoop of ice cream on the side"],
    },
  },
  {
    productId: "9279c8bf-a33f-4d6a-a2d4-15d1c8a65071",
    sourceCharacter: "D",
    photo: "/dessert-friends/assets/references/D.jpg",
    features: {
      ko: ["코코아로 덮인 둥근 윗면", "가운데 작은 녹색 토핑", "밝은 아래층과 옆 아이스크림"],
      en: ["A round top covered in cocoa", "A small green topping in the center", "A light-colored lower layer and ice cream on the side"],
    },
  },
  {
    productId: "0afcb9d2-b0dd-4250-a4e6-fb9dc2be1e80",
    sourceCharacter: "C",
    photo: "/dessert-friends/assets/references/C.jpg",
    features: {
      ko: ["수플레를 덮어 흐르는 흰 크림", "금빛 캐러멜 표면과 작은 허브", "접시 위 둥근 소스 선"],
      en: ["White cream flowing over the soufflé", "A golden caramel surface and a small herb", "A rounded line of sauce on the plate"],
    },
  },
  {
    productId: "a0f72a0e-4f4f-41cb-80f5-029df26c7464",
    sourceCharacter: "B",
    photo: "/dessert-friends/assets/references/B.jpg",
    features: {
      ko: ["낮은 그릇의 회색 바탕과 검은 가루", "오른쪽에 놓인 말린 토핑", "스쿱·오렌지 장식·허브와 밝은 가루"],
      en: ["A gray base and black powder in a low bowl", "A dried topping on the right", "A scoop, orange decoration, herbs, and light-colored powder"],
    },
  },
  {
    productId: "e706269d-980a-4f36-81ca-431e35178882",
    sourceCharacter: "M",
    photo: "/dessert-friends/assets/references/M.jpg",
    features: {
      ko: ["그릇 가득 세 방향으로 펼친 망고", "얇고 겹겹이 포개진 과일 조각", "중앙의 가지 모양 허브"],
      en: ["Mango fanning out in three directions across the bowl", "Thin, overlapping fruit slices", "A branch-like herb in the center"],
    },
  },
  {
    productId: "f4f11eb5-c434-4057-9c5f-3693e732dfc6",
    sourceCharacter: "L",
    photo: "/dessert-friends/assets/references/L.jpg",
    features: {
      ko: ["갈색 비스킷 부스러기 바탕", "흰 스쿱과 갈색 소스·세운 비스킷", "옆에 놓인 작은 커피 피처"],
      en: ["A base of brown biscuit crumbs", "A white scoop, brown sauce, and an upright biscuit", "A small coffee pitcher on the side"],
    },
  },
];

export type PublicProductDetail = { product: PublicProduct; detail: ProductDetailSource };

/** Join by actual product ID; names, price and visibility come from the current catalog. */
export function getPublicProductDetails(products: readonly PublicProduct[]): PublicProductDetail[] {
  const productsById = new Map(products.filter(product => product.id && product.qrAvailable).map(product => [product.id, product]));
  return PUBLIC_PRODUCT_DETAILS.flatMap(detail => {
    const product = productsById.get(detail.productId);
    return product ? [{ product, detail }] : [];
  });
}
