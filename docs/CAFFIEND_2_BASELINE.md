# Caffiend 2.0 — implementation baseline

Inspected 2026-09-17. GitHub main and local HEAD: `ac9fcb72ecc52172d04989d6d4c3dce7d5424fb8`. Source review only; hosted schema/policies, payment configuration, iPad behavior, and end-to-end workflows have not yet been verified.

## Existing behavior and gaps

| Area | Existing code | Required progression |
| --- | --- | --- |
| Customer ordering | `app/order/[table]/page.tsx` inserts orders directly using browser-calculated items; realtime and history exist | Preserve options/languages; establish server-validated checkout and verified payment confirmation |
| Owner access | `app/admin/page.tsx` compares a public PIN in the browser | Supabase Auth session plus owner authorization enforced by server/database |
| Data model | `lib/supabase.ts` has four order statuses; checked-in migration permits only pending/done | Inspect actual schema; reconcile migrations without destroying existing data; separate payment and fulfillment states |
| Menu | Shared Supabase menu tables and QR overrides are already consumed by both surfaces | Preserve editors; use stable item IDs and canonical server prices for checkout; distinguish hidden from sold out |
| Owner UI | Narrow mobile-width admin shell and order cards | Tablet landscape NEW / PREPARING / READY operation, preserving menu tools and history |
| Realtime | Existing customer/admin subscriptions and some refresh synchronization | Reconcile on reconnect/refresh under proper access policies |
| Analytics/PWA | No dedicated payment-backed analytics or manifest found in app routes | Implement after stable P0; distinguish sandbox from real sales |

## First implementation sequence within the confirmed P0

1. Inspect actual Supabase table definitions, policies, storage rules, and existing data shape using read-only access or a schema export. The repository cannot currently reproduce the hosted schema. Do not assume its permissive historical migration describes today's deployment.
2. Define the smallest compatible order/payment schema and owner authorization model, migration/rollback approach, and guest access boundary. Document which owner accounts are allowed; an arbitrary authenticated account must not become an owner.
3. Add server-side checkout with canonical item prices/availability, validated options and table IDs, stable checkout identity, and idempotent payment confirmation. Decide safe handling of variable-price products before enabling online checkout for them.
4. Integrate one Korean PG sandbox with server verification and retry/reconciliation behavior. Provider and sandbox credentials are still needed; no production payment action is authorized by merely defining this roadmap.
5. Connect paid orders to the authenticated owner workflow and customer realtime status, including ready/completed distinction. Keep existing counter-payment behavior until the new path is configured and verified.
6. Adapt the existing owner shell to iPad landscape; then proceed to P1.

Expected affected areas: Supabase migrations; server-side Supabase/auth/payment modules and route handlers; `lib/supabase.ts`; customer order page; admin page and shared layout; later manifest/icons and analytics. Final file boundaries depend on inspection of the actual database and relevant bundled Next.js documentation.

## Verification required for implementation

- Relevant type/lint/build checks and focused tests for pricing, access control, state transitions, and duplicate/retried confirmations.
- KO/EN menu/options/cart/history regression checks.
- Sandbox: failed/cancelled payment, amount mismatch, duplicate confirmation, refresh after payment, realtime reconnection, and unauthenticated/unauthorized owner writes.
- Verify notifications and layout on the actual iPad; desktop emulation alone is not field validation.
- Report SQL/environment setup explicitly. Do not claim live migrations, payment success, or field validation until observed.

## This handoff's changes

Only project guidance/documentation was updated. No application code, database policies, deployed service, or payments were changed. The two user-provided source documents were preserved verbatim. The branch comparison was verified; application tests were not run for documentation-only edits.
