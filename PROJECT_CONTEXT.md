# Caffiend — shared project context

Last updated: 2026-09-17. This file carries project context across new Codex and Claude Code tasks. It is a handoff, not a full conversation archive. Inspect latest GitHub `main` as the implementation baseline and preserve local work. The user's full confirmed requirements are in `docs/CAFFIEND_2_CONTEXT.md` and `docs/CAFFIEND_2_MASTER.md`; read both at task start.

## Project and academic background

Caffiend (카피엔드) is a real café in Yangdeok, Pohang. This project combines its public website, mobile table ordering through QR codes, and an owner administration/customization tool. Customer-facing experiences support Korean and English.

The user built the first version with Claude Code during the first university semester and received A0. Development is now continuing with Codex for a second-semester individual research course. The aim is a demonstrably improved result grounded in real café use. The course emphasizes local business collaboration, community contribution, practical problem-solving, field operation, communication, feedback, and portfolio/interview-ready experience.

## Division of responsibilities — explicit user preference

- The separate GPT project chat is where direction, roadmap, and ideas are discussed and improved.
- Codex in this project implements and verifies the resulting requirements.
- Do not offer an unsolicited roadmap, start speculative features, or expand the agreed scope.
- The user has now supplied the confirmed Caffiend 2.0 direction. Online payment through a practical Korean PG in test mode first is a core requirement; exact provider/payment methods are not selected. App Store packaging is optional P2, not the core objective.
- Do not monitor or schedule follow-ups unless asked.
- Prefer concise Korean communication when the user writes Korean. The user is not a software developer; handle routine implementation choices and explain concrete outcomes.

## Repository and local development

- Git repository: https://github.com/samj2479/CaffiendWebMVP.git
- Workspace root: `D:\Caffiend`
- Actual application/repository: `D:\Caffiend\my-website`
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, Supabase.
- Start locally from the application directory with `npm.cmd run dev` (Windows).
- Usual URL: http://localhost:3000 — check that the server is running before claiming it is available.
- Preserve unrelated local edits and untracked files. Do not print `.env.local` values or credential-bearing remote URLs.

## Confirmed Caffiend 2.0 target

- User's semester timeline: Week 3 at handoff, hard deadline Week 10; optional store submission should be ready around Week 9. These are academic milestones, not inferred calendar dates.
- P0: stable existing QR ordering; payment architecture and server verification; secure Supabase Auth owner access and authorization; reliable realtime synchronization; iPad landscape owner KDS.
- P1: reversible sold-out controls, basic analytics, owner PWA installation, and new-order notification. Add Web Push only if reliable within the timeline after P0 is stable.
- P2: optional native iPad/App Store packaging, refund management, enhanced analytics. Do not implement while P0 is unstable.
- Target demonstration: QR → menu/options → cart → payment → server-verified order → owner iPad → accept/preparing → ready → complete, with live customer status and accurate analytics.
- Keep payment and fulfillment states separate. Verify payment server-side, avoid client-trusted totals, persist provider/payment identifiers and verification details, and keep secrets server-only.
- Owner uses an iPad; customer stays in the mobile browser without installation or accounts. Preserve existing menus/options, brand, and KO/EN behavior.
- Analytics: today's revenue/orders, average order value, best seller, peak hour. Define eligible payment/order states and distinguish actual café data from sandbox/test data; never fabricate field results.
- Document architecture before/after, rationale, trade-offs, verification, and actual field feedback for the university/portfolio narrative.
- Out of scope unless requested: customer native app/accounts, loyalty/coupons, delivery, reservation rebuild, multi-store SaaS, advanced inventory/AI forecasting, full POS replacement, chatbot, Android/iOS simultaneous rewrites, React Native rewrite.

## Three connected experiences

### Public website
- Korean `/`; English `/en`; matching routes for menu, visit, reserve, brand, and notices.
- Current homepage renders hero, founder story, menu introduction, group-order introduction, and footer. Older notes list additional sections no longer rendered.
- Public language is URL-based through `app/context/LanguageContext.tsx` and `app/i18n/useT.ts`.
- Some English pages re-export shared pages; others, including the menu, contain duplicate implementations. Inspect both language routes when changing UI.
- Group reservations currently link to an external Google Form.

### Mobile QR ordering
- `/order` selects tables 1–8; `/order/[table]` is a table-specific ordering page.
- Includes menu browsing, options, quantities, notes, cart, submission, history, cancellation controls, and live order status.
- QR language uses a separate toggle and browser local storage (`caffiend-order-lang`).
- Orders go to Supabase `orders`; intended statuses are `pending`, `cooking`, `completed`, and `cancelled`.
- Customers currently pay at the counter, according to the user. No online payment integration was found during the initial code review.

### Administration
- `/admin`: Korean UI with PIN entry, live order handling/history, and website/QR menu editors.
- `app/admin/SiteMenuManager.tsx`: shared menu names (KO/EN), images, prices, seasonal flags, allergens, categories, and main-site visibility.
- `app/admin/QRMenuManager.tsx` and `QRDetailsManager.tsx`: QR visibility, item management, temperature rules, and bilingual custom options.
- Supabase tables referenced by code: `site_menu_items`, `site_categories`, `site_menu_category_items`, `site_allergen_types`, `site_qr_overrides`, and `orders`. Images use the `menu-images` storage bucket.
- Public and QR menus share item records. QR editing of base fields affects the shared record; QR deletion currently deletes the shared item. Separate visibility settings do not imply independent catalogs.

## Known implementation gaps — baseline observations

Initial source inspection found the following; the live database and full user flows have not been audited:
- Brand story, founder, and gallery subpages show under-construction content; news is a placeholder.
- Admin reservation and location editors are placeholders; much public-site content is hardcoded.
- Allergy data exists in several static and database-backed forms. Not all customer-facing displays consume admin-edited values. The dedicated admin allergy view is a simplified read-only placeholder.
- Admin PIN validation runs in browser code; it is not server-enforced authentication.
- The checked-in orders migration permits older statuses (`pending`, `done`) and includes a permissive policy. The repository lacks migrations for the menu tables referenced by current code. Actual hosted database state is unverified.
- Static menu fallbacks coexist with database-backed menus.
- `CONTEXT.md` is historical and contains outdated architecture descriptions and technical assertions; do not treat it as verified current behavior.

## Current handoff

- Current explicit scope: Phase 1 / Week 3 architecture audit and scope freeze only. User explicitly prohibited starting Phase 2. Roadmap preserved verbatim at `docs/CAFFIEND_2_ROADMAP.md`.
- Audit deliverable: `docs/PHASE_1_ARCHITECTURE_AUDIT.md` covers all seven requested outputs, with source evidence, DB assumptions, risks, target design, migration plan, and phase sequence. It supersedes the earlier baseline's sequence where the roadmap is more specific.
- Source audit complete; live Supabase schema/security verification remains unperformed. `docs/phase-1-schema-inventory.sql` is a metadata-only read-only query, not a migration; it has NOT been executed against Supabase.
- Baseline checks: TypeScript passes; ESLint has 10 existing errors and 31 warnings. No application change, schema migration, PG integration, production build, or live-order test was performed in Phase 1.
- New findings: existing history has completed-order revenue sums (not verified payment revenue); local menu settings are partly orphaned and can disagree with cart totals; cart uses item names and loses option variants; owner cards omit extras; writes can report local success despite DB errors; realtime lacks explicit reconnect reconciliation.

- Pulled from the requested GitHub repository: Git reported already up to date; existing local changes were preserved.
- Fixed missing `@next/third-parties/google` by installing declared dependencies with `npm.cmd install --no-audit --no-fund`. The homepage then returned HTTP 200.
- Read the main source flows and explained the architecture to the user. No 2.0 application feature has been implemented yet.
- User supplied the full 2.0 development summary and master prompt; saved verbatim in `docs/CAFFIEND_2_CONTEXT.md` and `docs/CAFFIEND_2_MASTER.md`.
- Fetched GitHub `main` and verified it matches local HEAD `ac9fcb72ecc52172d04989d6d4c3dce7d5424fb8`. Local uncommitted files remain intact.
- Baseline diagnostic and first implementation sequence: `docs/CAFFIEND_2_BASELINE.md`. This is implementation sequencing within the user's roadmap, not a new product direction.
- Added persistent instructions and this handoff at the user's request so new tasks can recover overall context.

## Keeping this handoff useful

After substantive authorized work, replace stale current-state notes with a concise account of what changed, why, what was verified, limitations, and the next agreed action. Keep proposals separate from decisions. Do not record secrets. Do not start development merely because a possible future feature is mentioned here.
