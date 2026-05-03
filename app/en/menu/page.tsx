"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import FooterSection from "../../components/FooterSection";

const sortOptions = [
  { ko: "인기순", en: "Popular" },
  { ko: "최신순", en: "Latest" },
  { ko: "이름순", en: "Name" },
];

const categories = [
  { ko: "수플레 & 팬케이크", en: "Soufflé & Pancakes" },
  { ko: "음료", en: "Drinks" },
];

const dessertItems = [
  { ko: "초코 수플레", en: "Chocolate Soufflé" },
  { ko: "딸기 수플레", en: "Strawberry Soufflé" },
  { ko: "밤 수플레", en: "Chestnut Soufflé" },
  { ko: "두바이 수플레", en: "Dubai Soufflé" },
  { ko: "메뉴 5", en: "Menu 5" },
  { ko: "메뉴 6", en: "Menu 6" },
  { ko: "메뉴 7", en: "Menu 7" },
  { ko: "메뉴 8", en: "Menu 8" },
];

const drinkItems = [
  { ko: "음료 1", en: "Drink 1" },
  { ko: "음료 2", en: "Drink 2" },
  { ko: "음료 3", en: "Drink 3" },
  { ko: "음료 4", en: "Drink 4" },
  { ko: "음료 5", en: "Drink 5" },
  { ko: "음료 6", en: "Drink 6" },
  { ko: "음료 7", en: "Drink 7" },
  { ko: "음료 8", en: "Drink 8" },
];

function SortArrowIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Page() {
  const { lang } = useLanguage();
  const [activeSort, setActiveSort] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = activeCategory === 0 ? dessertItems : drinkItems;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main>
      {/* Header section with title and sorting */}
      <section className="min-h-screen flex flex-col bg-white relative pt-[100px] md:pt-[140px] px-4 sm:px-6 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto w-full">
          {/* Centered Title */}
          <h1
            className="font-serif font-bold text-caramel text-center"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            MENU
          </h1>

          {/* Category Toggle */}
          <div className="flex flex-wrap justify-center mt-8 gap-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={`font-sans text-sm px-6 py-2.5 rounded-full border transition-all ${
                  activeCategory === i
                    ? "bg-caramel text-white border-caramel"
                    : "bg-white text-black/70 border-black/20 hover:border-black/40"
                }`}
              >
                {lang === "ko" ? cat.ko : cat.en}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown - below category, right aligned */}
          <div className="flex justify-end mt-6" ref={dropdownRef}>
            <div className="flex items-center gap-3">
              <span className="font-sans text-sm text-black/50">{lang === "ko" ? "정렬" : "Sort"}</span>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 font-sans text-sm px-4 py-2 rounded-full border border-black/20 bg-white text-black/80 hover:border-black/40 transition-all"
                >
                  {lang === "ko" ? sortOptions[activeSort].ko : sortOptions[activeSort].en}
                  <SortArrowIcon open={dropdownOpen} />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden z-50 min-w-[120px]">
                    {sortOptions.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveSort(i);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left font-sans text-sm px-4 py-2.5 transition-colors ${
                          activeSort === i
                            ? "bg-caramel/10 text-caramel"
                            : "text-black/70 hover:bg-black/5"
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

          {/* Menu items grid - responsive */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {menuItems.map((item, i) => (
              <div key={i} className="flex flex-col">
                {/* Grey placeholder box */}
                <div className="aspect-square bg-gray-200" />
                {/* Item name */}
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
