# Session Context — Caffiend Website

## ⚠️ REMINDER FOR CLAUDE
**Before tokens run out or session ends: update this file with all key changes made.**
Do this proactively — don't wait for the user to ask.

---

## Project
Single-page Next.js website for Caffiend café (포항 양덕). Bilingual KO/EN.
Main file: `app/page.tsx` (all sections). Components in `app/components/`.

## Collaboration Rules
I am not a software developer. Follow these rules:
- **Be the Expert:** Don't ask 'how' to implement something or for technical preferences. Make the best technical choice (Tailwind/Standard JS) and just tell me what you did.
- **Decision-Lite:** If a decision is needed, give 2 simple options (e.g., "Option A: Blue header, Option B: White header") rather than open-ended questions.
- **Assume Full Control:** You are responsible for file structure and logic. Just show me the visual result or tell me what to click to test it.
- **Keep it Brief:** No long explanations, no chatty filler. Code and action only.
- **Both sites always:** Any content/UI change must be applied to both KR (`/`) and EN (`/en`) sites, including dropdown menu items.
- After all changes: run `npm run dev`.

## Sections (top → bottom)
Hero → Story (CEO timeline) → Philosophy (values + seasons) → Menu (carousel) → Signature → Reviews → PhotoCTA → Visit → Reserve (group orders) → Footer

## Key Files
- `app/page.tsx` — all page sections (client component)
- `app/components/Nav.tsx` — sticky nav + mega dropdown + language toggle
- `app/components/HeroSection.tsx` — hero with background image
- `app/components/MenuCarousel.tsx` — infinite sliding carousel
- `app/components/Marquee.tsx` — scrolling text band
- `app/components/BlankPage.tsx` — placeholder for sub-pages (takes ko/en props)
- `app/context/LanguageContext.tsx` — language derived from URL, no state
- `app/i18n/useT.ts` — `t(ko, en)` translation hook
- `app/globals.css` — custom animations (hero, scroll-reveal, shimmer, etc.)

## Language System (current architecture)
- Language is **URL-based**, not state-based. No localStorage, no flash, no hydration issues.
- Korean site: `/` and all sub-routes (`/menu`, `/reserve`, `/visit`, `/notice/*`, `/brand/*`)
- English site: `/en` and all sub-routes (`/en/menu`, `/en/reserve`, etc.)
- `LanguageContext` reads `usePathname()` — if starts with `/en` → `lang = "en"`, else `"ko"`
- Lang button calls `setLang()` which does `router.push()` to the equivalent URL
- Nav uses helper `h(href)` to prefix all links with `/en` when on English site
- English pages under `app/en/` are thin wrappers — same components, context provides the language

## Nav Mega-menu
- Hover any nav link → full-width white panel (160px tall) fades in below the 60px bar
- Each column: nav link (in bar) + sub-items below — same flex item = guaranteed alignment
- Layout: `flex justify-center gap-20` on both rows
- Active nav item: caramel (#7D4E24). Active column sub-items: mocha (#4A2C1A). Inactive: black/50
- Bottom edge: 1px `rgba(0,0,0,0.1)` line on the panel background
- All transitions unified at 200ms ease (bar bg, panel bg, link color, sub-items)
- `onMouseLeave` only on outer `<nav>` — mouse can travel from bar into panel freely
- `isHome` check: `pathname === "/" || pathname === "/en"`

## Scroll Progress Bar (`app/components/ScrollProgressBar.tsx`)
- Fixed right edge (right: 16px), vertically centered, 6px wide × 160px tall, rounded ends
- Visible on ALL pages (not just home)
- Fades out at top (progress ≤ 0) and after bottom (progress > 1, i.e. footer entered view)
- Progress calculated against `footer#contact offsetTop - clientHeight` (full at last content section)
- Dark mode: white fill + white/20 track when `#home` hero is in viewport (IntersectionObserver, threshold 0.2)
- Light mode: #111 fill + #D0D0D0 track for all other sections
- Browser scrollbar hidden via CSS on `#scroll-container`

## Footer (`app/components/FooterSection.tsx`)
- Brand col: "눈꽃빙수·수플레" (single line, cream/70), Instagram hover → white
- Hours: 월-금 & 토 12:00–21:00 LO 20:30 / 일 14:00–20:00 LO 19:30
- Hours note: "운영시간이 바뀔 수 있습니다. 최신 공지 & 네이버지도 공지를 꼭 확인해 주세요."
- Bottom bar: 대표: 김미진 | 사업자등록번호: 464-05-02376 above © line
- All hyperlinks hover → white
- Footer nav links use `h()` helper (language-aware hrefs)

## Nav behaviour
- Clicking a nav label goes to `link.sub[0].href` (first dropdown page), not the section anchor
- `isHome` = `pathname === "/" || pathname === "/en"`
- `isDark` = `isHome && !scrolled && !megaOpen` (sub-pages always white nav)
- `ScrollAnimationObserver` re-runs on `pathname` change so EN page sections animate in correctly

## Completed Changes (previous sessions)
- Lang button: shows "English" / "🇰🇷 한국어", animates on switch (`lang-in` keyframe)
- Reviews section label: "소중한 고객님들의 후기"
- Group orders: single "단체주문 예약" button only
- Menu carousel: allergy info bottom-right (grey, small, with (예시)), no price tag, smooth infinite slide
- Address: 경북 포항시 북구 천마로 103 카피엔드 / 103, Cheonma-ro, Buk-gu, Pohang-si, Gyeongsangbuk-do, Republic of Korea
- "언제나 무료 레슨" box removed from Philosophy (values: 2 cards only, md:grid-cols-2)
- Hero image: quality=90, scale(0.72) to zoom out and reduce pixelation

## Palette Tokens
cream #FDF6EC · parchment #F5E6CC · latte #EDD5B3 · caramel #7D4E24 · sienna #C8935A · mocha #4A2C1A · espresso #2C1208

## Instagram / Contact
@caffiend__ · Tel: 0507-1366-4878
