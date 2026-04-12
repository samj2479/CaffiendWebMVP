"use client";

import HeroSection from "./components/HeroSection";
import FooterSection from "./components/FooterSection";
import { useT } from "./i18n/useT";
import { useLanguage } from "./context/LanguageContext";

const krFont = { fontFamily: "var(--font-noto-kr), var(--font-lato), sans-serif" };

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array(5).fill(null).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20"
          fill={i < count ? "#1A1A1A" : "none"} stroke="#1A1A1A" strokeWidth="1.5">
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <div className="h-px w-12 bg-sienna/40" />
      <span className="text-sienna text-sm">✦</span>
      <div className="h-px w-12 bg-sienna/40" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section: CEO's Story
───────────────────────────────────────────── */
const timeline = [
  {
    years: "1993 – 1999",
    titleKo: "유치원 교사",
    titleEn: "Kindergarten Teacher",
    descKo: "6년간 어린 마음들을 돌보며, 만나는 아이 한 명 한 명에게 따뜻함과 호기심, 그리고 창의성의 씨앗을 심었습니다.",
    descEn: "For six years she nurtured young minds, planting seeds of warmth, curiosity, and creativity in every child she met.",
    icon: "🌱",
  },
  {
    years: "2000년대 초 · Early 2000s",
    titleKo: "한국 정부 커피 교육 프로그램",
    titleEn: "Korean Gov't Coffee Education Program",
    descKo: "가르침보다 더 깊은 부름 — 국가 교육 프로그램을 통해 커피의 예술과 과학, 그리고 영혼을 발견했습니다.",
    descEn: "A calling deeper than teaching — through a national education program she discovered the art, science, and soul of coffee.",
    icon: "☕",
  },
  {
    years: "2013 – 2022",
    titleKo: "교육 및 사회 봉사",
    titleEn: "Education & Community Service",
    descKo: "장애인, 예비 카페 창업자, 부모님들에게 아낌없이 지식을 나눴습니다. 언제나 베풀고, 언제나 가르쳤습니다.",
    descEn: "She shared knowledge freely with people with disabilities, aspiring café owners, and parents. Always giving, always teaching.",
    icon: "🤝",
  },
  {
    years: "2022년 9월 · Sept 2022",
    titleKo: "포항에서의 새 출발",
    titleEn: "A New Beginning in Pohang",
    descKo: "평생의 배움과 나눔에 대한 굳건한 믿음을 안고, 포항 양덕에 새로운 첫걸음을 내디뎠습니다.",
    descEn: "Carrying a lifetime of learning and an unwavering belief in giving back, she took her first step in Yangdeok, Pohang.",
    icon: "🏡",
  },
  {
    years: "2022년 12월 · Dec 2022",
    titleKo: "카피엔드 개업",
    titleEn: "Caffiend Opens",
    descKo: "메뉴 하나당 300개의 달걀을 테스트하고, 수년간 모든 레시피를 완성에 이르기까지 — 카피엔드가 사랑의 결실로 세상에 문을 열었습니다.",
    descEn: "After testing 300 eggs per menu item and years perfecting every recipe — Caffiend opened its doors as the fruit of a life's love.",
    icon: "✨",
  },
];

function StorySection() {
  const t = useT();
  return (
    <section id="story" className="min-h-screen flex flex-col justify-center py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2
            className="sr-init sr-fade-up font-serif font-bold text-caramel"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 0.9 }}
          >
            {t("브랜드 이야기", "Brand Story")}
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
/* ─────────────────────────────────────────────
   Section: Menu — carousel (client component)
───────────────────────────────────────────── */
function MenuSection() {
  const t = useT();
  return (
    <section id="menu" className="min-h-screen flex flex-col justify-center py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2
            className="sr-init sr-fade-up font-serif font-bold text-caramel"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 0.9 }}
          >
            MENU
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────

/* ─────────────────────────────────────────────
   Section: Customer Reviews
───────────────────────────────────────────── */
const reviews = [
  {
    name: "박지영",
    locationKo: "포항",
    locationEn: "Pohang",
    rating: 5,
    textKo: "수플레가 정말 환상적이었어요 — 이렇게 가볍고 완벽한 맛은 처음이에요. 사장님이 너무 따뜻하게 맞아주셔서 진짜 가족을 만난 것 같았어요.",
    textEn: "The soufflé was truly magical — I've never tasted anything so light and perfect. The owner welcomed us so warmly, it felt like meeting family.",
  },
  {
    name: "이서준",
    locationKo: "서울에서 방문",
    locationEn: "Visiting from Seoul",
    rating: 5,
    textKo: "SNS에서 무화과 수플레를 보고 서울에서 직접 운전해 왔어요. 그 거리가 전혀 아깝지 않았어요. 가을 시즌 메뉴는 필수입니다. 이미 재방문을 예약했어요.",
    textEn: "I drove all the way from Seoul after seeing the fig soufflé online. Not a single regret. The autumn menu is a must. Already planning my return visit.",
  },
  {
    name: "김민아",
    locationKo: "대구",
    locationEn: "Daegu",
    rating: 5,
    textKo: "미경 대표님가 그 자리에서 팬케이크 레시피를 가르쳐 주셨어요. 그 나눔의 정신은 진짜예요 — 마케팅이 아닙니다. 진정한 영혼이 있는 카페입니다.",
    textEn: "Mi-gyeong taught me the pancake recipe right on the spot. That spirit of giving is real — not marketing. This is a café with a genuine soul.",
  },
];

function ReviewsSection() {
  const t = useT();
  const { lang } = useLanguage();
  return (
    <section id="reviews" className="min-h-screen flex flex-col justify-center py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="sr-init sr-fade-up font-serif font-bold text-caramel"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 0.9 }}
          >
            {t("소중한 고객님들의 후기", "Guest Reviews")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i}
              className="sr-init sr-fade-up bg-cream rounded-3xl p-8 border border-latte flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${i * 120}ms` }}>
              <StarRating count={review.rating} />
              <p className="font-sans text-mocha/70 text-sm leading-relaxed flex-1">
                &ldquo;{lang === "ko" ? review.textKo : review.textEn}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-latte">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg text-cream flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #333333, #111111)" }}>
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-caramel" style={krFont}>{review.name}</p>
                  <p className="font-sans text-xs text-mocha/40" style={krFont}>
                    {lang === "ko" ? review.locationKo : review.locationEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sr-init sr-fade-up mt-16 text-center" style={{ transitionDelay: "200ms" }}>
          <Ornament />
          <p className="font-serif italic text-lg text-mocha/40 mt-4">
            &ldquo;{t("낯선 이로 오셔서, 가족으로 돌아가세요.", "Come as strangers, leave as family.")}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: Photo Mosaic CTA
───────────────────────────────────────────── */
function NoticeSection() {
  const t = useT();
  return (
    <section id="notice" className="min-h-screen flex flex-col justify-center py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2
            className="sr-init sr-fade-up font-serif font-bold text-caramel"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 0.9 }}
          >
            {t("공지", "Notice")}
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section: Visit
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Section: Reserve Order
───────────────────────────────────────────── */
function ReserveSection() {
  const t = useT();
  return (
    <section id="reserve" className="min-h-screen flex flex-col justify-center py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="sr-init sr-fade-up font-serif font-bold text-caramel mb-6"
          style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em", lineHeight: 0.9 }}
        >
          {t("단체주문", "Group Orders")}
        </h2>
        <p className="sr-init sr-fade-up font-sans text-mocha/65 text-lg max-w-2xl mx-auto leading-relaxed mb-10" style={{ transitionDelay: "160ms" }}>
          {t(
            "행사, 모임, 선물 등 단체주문은 전화 또는 인스타그램으로 미리 문의해 주세요. 미경 대표님이 정성껏 준비해 드립니다.",
            "For events, gatherings, or gifts — please enquire in advance by phone or Instagram. Mi-gyeong will prepare everything with care."
          )}
        </p>
        <div className="sr-init sr-fade-up flex justify-center" style={{ transitionDelay: "240ms" }}>
          <a href="tel:0507-1366-4878"
            className="font-sans text-sm tracking-widest uppercase bg-sienna text-cream px-10 py-3.5 rounded-full hover:bg-caramel transition-colors duration-300">
            {t("단체주문 예약", "Reserve Group Order")}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section Ornament Divider
───────────────────────────────────────────── */
function SectionOrnament() {
  return (
    <div
      className="flex items-center justify-center py-10"
      style={{ background: "#F2F2F2" }}
    >
      <div className="flex items-center gap-5">
        <div className="sr-init sr-expand h-px w-20 bg-sienna/30" style={{ transformOrigin: "right" }} />
        <span className="sr-init sr-fade-up text-sienna/50 text-base" style={{ transitionDelay: "120ms" }}>✦</span>
        <div className="sr-init sr-expand h-px w-20 bg-sienna/30" style={{ transformOrigin: "left" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function Page() {
  return (
    <main>
      <HeroSection />
      <MenuSection />
      <StorySection />
      <ReserveSection />
      <ReviewsSection />
      <NoticeSection />
      <FooterSection />
    </main>
  );
}
