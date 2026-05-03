"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import FooterSection from "../../components/FooterSection";

const sortOptions = [
  { ko: "인기순", en: "Popular" },
  { ko: "최신순", en: "Latest" },
  { ko: "이름순", en: "Name" },
];

const seasonItems = [
  { ko: "스프링 블라썸 에이드", en: "Spring Blossom Ade" },
  { ko: "벚꽃 슈크림 라떼", en: "Cherry Blossom Cream Latte" },
  { ko: "망고 말차 라떼", en: "Mango Matcha Latte", image: "/%EB%A7%9D%EA%B3%A0%EB%A7%90%EC%B0%A8%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "산타 메리", en: "Santa Mary" },
  { ko: "고구마 크림브륄레 라떼", en: "Sweet Potato Crème Brûlée Latte", image: "/%ED%81%AC%EB%A6%BC%20%EB%B8%8C%EB%A5%84%EB%A0%88%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "청귤티", en: "Green Tangerine Tea" },
  { ko: "청귤에이드", en: "Green Tangerine Ade", image: "/%EC%B2%AD%EA%B7%A4%20%EC%97%90%EC%9D%B4%EB%93%9C.png" },
  { ko: "오미자 티", en: "Omija Tea" },
  { ko: "오미자 에이드", en: "Omija Ade" },
  { ko: "오미자 라떼", en: "Omija Latte" },
];

const soufleeItems = [
  { ko: "초코 수플레", en: "Chocolate Soufflé", image: "/%EC%B4%88%EC%BD%94%20%EC%88%98%ED%94%8C%EB%A0%88.jpg" },
  { ko: "크림브륄레 수플레", en: "Crème Brûlée Soufflé", image: "/%ED%81%AC%EB%A6%BC%EB%B8%8C%EB%A5%84%EB%A0%88%20%EC%88%98%ED%94%8C%EB%A0%88.jpg" },
  { ko: "로투스 수플레", en: "Lotus Soufflé", image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%20%EC%88%98%ED%94%8C%EB%A0%88.jpg" },
  { ko: "인절미 수플레", en: "Injeolmi Soufflé", image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EC%88%98%ED%94%8C%EB%A0%88.jpg" },
  { ko: "돼지바 수플레", en: "Dwaeji Bar Soufflé", image: "/%EB%8F%BC%EC%A7%80%EB%B0%94%20%EC%88%98%ED%94%8C%EB%A0%88.png", scale: 1.2 },
  { ko: "밤 수플레", en: "Chestnut Soufflé", image: "/%EB%B0%A4%20%EC%88%98%ED%94%8C%EB%A0%88.jpg", objectPosition: "center 80%" },
  { ko: "흑임자 수플레", en: "Black Sesame Soufflé", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%88%98%ED%94%8C%EB%A0%88.png" },
  { ko: "생과일 수플레 (딸기/복숭아/무화과)", en: "Fresh Fruit Soufflé (Strawberry/Peach/Fig)", image: "/%EB%94%B8%EA%B8%B0%20%EC%88%98%ED%94%8C%EB%A0%88.jpg" },
  { ko: "두바이 수플레", en: "Dubai Soufflé", image: "/%EB%91%90%EB%B0%94%EC%9D%B4%20%EC%88%98%ED%94%8C%EB%A0%88.png", objectPosition: "center 80%" },
  { ko: "두바이 딸기 수플레", en: "Dubai Strawberry Soufflé" },
];

const bingsuItems = [
  { ko: "인절미 팥빙수", en: "Injeolmi Red Bean Bingsu", image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%20%ED%8C%A5%EB%B9%99%EC%88%98.png" },
  { ko: "오레오초코 빙수", en: "Oreo Chocolate Bingsu", image: "/%EC%98%A4%EB%A0%88%EC%98%A4%EC%B4%88%EC%BD%94%20%EB%B9%99%EC%88%98.png" },
  { ko: "로투스커피 빙수", en: "Lotus Coffee Bingsu", image: "/%EB%A1%9C%ED%88%AC%EC%8A%A4%EC%BB%A4%ED%94%BC%20%EB%B9%99%EC%88%98.png" },
  { ko: "코코망고리치 빙수", en: "Coco Mango Lychee Bingsu", image: "/%EC%BD%94%EC%BD%94%EB%A7%9D%EA%B3%A0%EB%A6%AC%EC%B9%98%20%EB%B9%99%EC%88%98.jpg" },
  { ko: "흑임자 빙수", en: "Black Sesame Bingsu", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EB%B9%99%EC%88%98.jpg" },
  { ko: "포레스트 팥빙수", en: "Forest Red Bean Bingsu", image: "/%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8%20%ED%8C%A5%EB%B9%99%EC%88%98.jpg" },
  { ko: "오디 빙수", en: "Mulberry Bingsu", image: "/%EC%98%A4%EB%94%94%20%EB%B9%99%EC%88%98.png" },
  { ko: "생과일 빙수 (딸기/복숭아)", en: "Fresh Fruit Bingsu (Strawberry/Peach)", image: "/%EB%94%B8%EA%B8%B0%20%EB%B9%99%EC%88%98.png" },
  { ko: "무화과 밀크티 빙수", en: "Fig Milk Tea Bingsu" },
  { ko: "꿀자몽 빙수", en: "Honey Grapefruit Bingsu", image: "/%EA%BF%80%EC%9E%90%EB%AA%BD%20%EB%B9%99%EC%88%98.jpg" },
];

const lightDessertItems = [
  { ko: "미니 쫀득쿠키", en: "Mini Chewy Cookie", image: "/%EB%AF%B8%EB%8B%88%20%EC%AB%80%EB%93%9D%20%EC%BF%A0%ED%82%A4.png" },
  { ko: "티라미수 볼 (코코아/말차/인절미/로투스)", en: "Tiramisu Ball (Cocoa/Matcha/Injeolmi/Lotus)" },
  { ko: "1인 티라미수", en: "Single Tiramisu", image: "/1%EC%9D%B8%20%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98.png" },
  { ko: "말렌카 (코코아/월넛)", en: "Medovik (Cocoa/Walnut)", image: "/%EB%A7%90%EB%A0%8C%EC%B9%B4%20(%EC%BD%94%EC%BD%94%EC%95%84%20%EC%9B%94%EB%84%9B).png" },
  { ko: "3~4인 티라미수", en: "Tiramisu for 3–4", image: "/3%204%EC%9D%B8%20%ED%8B%B0%EB%9D%BC%EB%AF%B8%EC%88%98.png" },
];

const dripItems = [
  { ko: "핸드드립 케냐 AA", en: "Hand Drip Kenya AA" },
  { ko: "콜드브루 아이스", en: "Cold Brew Ice" },
  { ko: "콜드브루 라떼", en: "Cold Brew Latte" },
];

const coffeeItems = [
  { ko: "에스프레소", en: "Espresso" },
  { ko: "에소 콘파냐", en: "Espresso con Panna" },
  { ko: "패션후르츠 콘파냐", en: "Passion Fruit con Panna" },
  { ko: "아메리카노", en: "Americano" },
  { ko: "헤이즐넛 아메리카노", en: "Hazelnut Americano" },
  { ko: "꿀 아메리카노", en: "Honey Americano" },
  { ko: "사케라또", en: "Shakerato" },
  { ko: "카페라떼", en: "Café Latte" },
  { ko: "퐁실 카푸치노", en: "Fluffy Cappuccino", image: "/%ED%90%81%EC%8B%A4%20%EC%B9%B4%ED%91%B8%EC%B9%98%EB%85%B8.png" },
  { ko: "바닐라말차샷", en: "Vanilla Matcha Shot" },
  { ko: "아가베라떼", en: "Agave Latte" },
  { ko: "바닐라빈라떼", en: "Vanilla Bean Latte" },
  { ko: "돌체라떼", en: "Dolce Latte" },
  { ko: "카라멜마끼야또", en: "Caramel Macchiato" },
  { ko: "카페모카", en: "Café Mocha" },
];

const nonCoffeeItems = [
  { ko: "말차 숲라떼", en: "Matcha Forest Latte", image: "/%EB%A7%90%EC%B0%A8%20%EC%88%B2%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "고구마라떼", en: "Sweet Potato Latte" },
  { ko: "로얄밀크티", en: "Royal Milk Tea" },
  { ko: "수제초코라떼", en: "Homemade Chocolate Latte" },
  { ko: "딸기라떼", en: "Strawberry Latte", image: "/%EB%94%B8%EA%B8%B0%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "흑말 라떼", en: "Black Sesame Matcha Latte" },
  { ko: "초코크림딸기라떼", en: "Chocolate Cream Strawberry Latte", image: "/%EC%B4%88%EC%BD%94%ED%81%AC%EB%A6%BC%EB%94%B8%EA%B8%B0%EB%9D%BC%EB%96%BC.png" },
  { ko: "인절미말차라떼", en: "Injeolmi Matcha Latte", image: "/%EC%9D%B8%EC%A0%88%EB%AF%B8%20%EB%A7%90%EC%B0%A8%20%EB%9D%BC%EB%96%BC.png" },
];

const einItems = [
  { ko: "아인슈페너", en: "Einspänner" },
  { ko: "로투스 카라멜라떼", en: "Lotus Caramel Latte" },
  { ko: "헤이즐토피넛라떼", en: "Hazel Toffee Nut Latte" },
  { ko: "옥수수슈페너", en: "Corn Einspänner" },
  { ko: "얼그레이 바닐라티라떼", en: "Earl Grey Vanilla Tea Latte", image: "/%EC%96%BC%EA%B7%B8%EB%A0%88%EC%9D%B4%20%EB%B0%94%EB%8B%90%EB%9D%BC%ED%8B%B0%20%EB%9D%BC%EB%96%BC.png" },
  { ko: "런던포그", en: "London Fog", image: "/%EB%9F%B0%EB%8D%98%20%ED%8F%AC%EA%B7%B8.png" },
  { ko: "흑임자 슈페너", en: "Black Sesame Einspänner", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%8A%88%ED%8E%98%EB%84%88.png" },
  { ko: "에쏘 아포가토", en: "Espresso Affogato" },
  { ko: "숲 아포가토", en: "Forest Affogato", image: "/%EC%88%B2%20%EC%95%84%ED%8F%AC%EA%B0%80%ED%86%A0%20.png" },
  { ko: "흑임자 아포가토", en: "Black Sesame Affogato", image: "/%ED%9D%91%EC%9E%84%EC%9E%90%20%EC%95%84%ED%8F%AC%EA%B0%80%ED%86%A0.png" },
];

const teaItems = [
  { ko: "캐모마일", en: "Chamomile" },
  { ko: "얼그레이", en: "Earl Grey" },
  { ko: "히비스커스", en: "Hibiscus" },
  { ko: "루이보스", en: "Rooibos" },
  { ko: "아이스티", en: "Iced Tea" },
  { ko: "꿀생강차", en: "Honey Ginger Tea" },
  { ko: "레몬생강차", en: "Lemon Ginger Tea" },
  { ko: "유자차", en: "Yuzu Tea" },
  { ko: "꿀대추차", en: "Honey Jujube Tea" },
  { ko: "자몽티", en: "Grapefruit Tea" },
  { ko: "레몬티", en: "Lemon Tea" },
  { ko: "애플유자티", en: "Apple Yuzu Tea", image: "/%EC%95%A0%ED%94%8C%EC%9C%A0%EC%9E%90%ED%8B%B0.png" },
  { ko: "허니자몽블랙티", en: "Honey Grapefruit Black Tea" },
  { ko: "허니딸기블랙티", en: "Honey Strawberry Black Tea" },
];

const adeItems = [
  { ko: "자몽에이드", en: "Grapefruit Ade" },
  { ko: "레몬 에이드", en: "Lemon Ade" },
  { ko: "패션후르츠 에이드", en: "Passion Fruit Ade" },
  { ko: "얼그레이유자 에이드", en: "Earl Grey Yuzu Ade", image: "/%EC%96%BC%EA%B7%B8%EB%A0%88%EC%9D%B4%20%EC%9C%A0%EC%9E%90%20%EC%97%90%EC%9D%B4%EB%93%9C.png" },
  { ko: "바질토마토 에이드", en: "Basil Tomato Ade", image: "/%EB%B0%94%EC%A7%88%20%ED%86%A0%EB%A7%88%ED%86%A0%20%EC%97%90%EC%9D%B4%EB%93%9C.png" },
];

const smoothieItems = [
  { ko: "미숫가루", en: "Misugaru" },
  { ko: "냉귀리 쉐이크", en: "Cold Oat Shake" },
  { ko: "그릭요거드 (그래놀라/딸기/블루베리/망고)", en: "Greek Yogurt (Granola/Strawberry/Blueberry/Mango)" },
  { ko: "배 스무디", en: "Pear Smoothie" },
  { ko: "유자 스무디", en: "Yuzu Smoothie" },
];

const categories = [
  {
    ko: "전체", en: "All",
    sub: null,
    items: [
      ...seasonItems, ...soufleeItems, ...bingsuItems, ...lightDessertItems,
      ...dripItems, ...coffeeItems, ...nonCoffeeItems, ...einItems,
      ...teaItems, ...adeItems, ...smoothieItems,
    ],
  },
  {
    ko: "시즌 메뉴", en: "Season Menu",
    sub: null,
    items: seasonItems,
  },
  {
    ko: "디저트", en: "Desserts",
    sub: [
      { ko: "수플레", en: "Soufflé", items: soufleeItems },
      { ko: "빙수", en: "Bingsu", items: bingsuItems },
      { ko: "간편 디저트", en: "Light Desserts", items: lightDessertItems },
    ],
    items: [],
  },
  {
    ko: "음료", en: "Drinks",
    sub: [
      { ko: "드립/더치", en: "Drip/Dutch", items: dripItems },
      { ko: "커피", en: "Coffee", items: coffeeItems },
      { ko: "논커피 라떼", en: "Non-Coffee Latte", items: nonCoffeeItems },
      { ko: "아인슈페너/아포가토", en: "Einspänner/Affogato", items: einItems },
      { ko: "티", en: "Tea", items: teaItems },
      { ko: "에이드", en: "Ade", items: adeItems },
      { ko: "스무디", en: "Smoothie", items: smoothieItems },
    ],
    items: [],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Page() {
  const { lang } = useLanguage();
  const [activeSort, setActiveSort] = useState(0);
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const activeCat = categories[activeCatIndex];

  const menuItems = (() => {
    if (activeCat.sub) {
      return activeCat.sub[activeSubIndex]?.items ?? [];
    }
    return activeCat.items;
  })();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleCatClick(i: number) {
    setActiveCatIndex(i);
    setActiveSubIndex(0);
  }

  return (
    <main>
      <section className="min-h-screen flex flex-col bg-white relative pt-[100px] md:pt-[140px] px-4 sm:px-6 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto w-full">

          {/* Title */}
          <h1
            className="font-serif font-bold text-caramel text-center"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            MENU
          </h1>

          {/* Top-level category row */}
          <div className="flex flex-wrap justify-start mt-8 gap-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCatClick(i)}
                className={`font-sans text-sm px-6 py-2.5 rounded-full border transition-all ${
                  activeCatIndex === i
                    ? "bg-caramel text-white border-caramel"
                    : "bg-white text-black/70 border-black/20 hover:border-black/40"
                }`}
              >
                {lang === "ko" ? cat.ko : cat.en}
              </button>
            ))}
          </div>

          {/* Sub-category row (only for 디저트 / 음료) */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: activeCat.sub ? "120px" : "0px",
              opacity: activeCat.sub ? 1 : 0,
              marginTop: activeCat.sub ? "16px" : "0px",
            }}
          >
            <div className="flex flex-wrap justify-start gap-2">
              {(activeCat.sub ?? []).map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSubIndex(i)}
                  className={`font-sans text-xs px-4 py-1.5 rounded-full border transition-all ${
                    activeSubIndex === i
                      ? "bg-black text-white border-black"
                      : "bg-white text-black/50 border-black/15 hover:border-black/30 hover:text-black/70"
                  }`}
                >
                  {lang === "ko" ? sub.ko : sub.en}
                </button>
              ))}
            </div>
          </div>

          {/* Sort row */}
          <div className="flex justify-end mt-6" ref={sortRef}>
            <div className="flex items-center gap-3">
              <span className="font-sans text-sm text-black/50">{lang === "ko" ? "정렬" : "Sort"}</span>
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 font-sans text-sm px-4 py-2 rounded-full border border-black/20 bg-white text-black/80 hover:border-black/40 transition-all"
                >
                  {lang === "ko" ? sortOptions[activeSort].ko : sortOptions[activeSort].en}
                  <ChevronIcon open={sortOpen} />
                </button>
                {sortOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                    {sortOptions.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => { setActiveSort(i); setSortOpen(false); }}
                        className={`w-full text-left font-sans text-sm px-4 py-2.5 transition-colors ${
                          activeSort === i ? "bg-caramel/10 text-caramel" : "text-black/70 hover:bg-black/5"
                        }`}
                      >
                        {lang === "ko" ? option.ko : option.en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu grid */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {menuItems.map((item, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  {(item as { image?: string; objectPosition?: string; scale?: number }).image && (
                    <img
                      src={(item as { image?: string }).image}
                      alt={lang === "ko" ? item.ko : item.en}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: (item as { objectPosition?: string }).objectPosition ?? "center",
                        transform: `scale(${(item as { scale?: number }).scale ?? 1})`,
                      }}
                    />
                  )}
                </div>
                <p className="font-sans text-sm md:text-base text-black/80 mt-3 text-center">
                  {lang === "ko" ? item.ko : item.en}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
      <FooterSection />
    </main>
  );
}
