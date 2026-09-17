# Caffiend project instructions

## Start of every task
- Current authorized phase: **Phase 1 / Week 3 — Architecture Audit + Scope Freeze only**. Read `docs/CAFFIEND_2_ROADMAP.md` and `docs/PHASE_1_ARCHITECTURE_AUDIT.md`. Do not implement Phase 2 or later until the user explicitly advances the phase. Later explicit user phase instructions supersede this gate; update it then.
- Read `PROJECT_CONTEXT.md` before answering project questions or implementing changes. It is the canonical cross-session project handoff.
- Read `docs/CAFFIEND_2_CONTEXT.md` and `docs/CAFFIEND_2_MASTER.md` for the user's confirmed 2.0 requirements. Inspect the latest GitHub `main` of `samj2479/CaffiendWebMVP` before implementation answers or edits. Current upstream code is the implementation baseline; preserve and inspect local changes rather than overwriting them. If fetching is blocked, disclose that the baseline could not be refreshed.
- Follow P0 before P1; defer P2 until P0 is stable. Customer: bilingual mobile web. Owner: iPad landscape web/PWA. No rewrite, customer native app, Android app, or React Native migration.
- For substantial changes, identify existing behavior and affected files, implement incrementally, run relevant checks, and report required migrations/environment/manual setup. Never assume migrations were applied. Payment must use test mode first, server-side verification, server-trusted totals, and separate payment/order states; private credentials must never use `NEXT_PUBLIC_*`.
- `CONTEXT.md` contains historical Claude Code notes. Some describe older implementations; verify them against current code and prefer the current handoff and explicit user requirements when they conflict.
- Product direction and idea development happen in the user's separate GPT project chat. Here, implement and verify the requirements the user brings. Do not independently expand scope or treat brainstormed ideas as approved work.
- Preserve existing local changes. The user is not a software developer: make routine technical decisions, explain results briefly in plain language, and provide a test link or clear testing steps when useful.
- Keep customer-facing changes aligned across Korean and English, and check effects on both the public menu and QR ordering when modifying shared menu data. The admin UI currently uses Korean.
- After substantive work, update the current state, confirmed decisions, verification results, and next steps in `PROJECT_CONTEXT.md`. Distinguish requested work from suggestions and unverified findings. Never store credentials or personal customer/order data in these notes.
- Do not claim to remember prior conversations beyond the available context and files. Read the handoff first; ask only for essential missing requirements.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
