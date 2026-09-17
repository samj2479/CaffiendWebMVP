# CAFFIEND 2.0 — EXECUTION ROADMAP

We are currently in Week 3.

Do not implement the entire roadmap in one uncontrolled change.

Work phase by phase.

At the beginning of each phase:

1. inspect latest GitHub main
2. inspect current implementation
3. identify dependencies
4. identify database impact
5. propose a short technical implementation plan
6. then implement

---

# PHASE 1 — WEEK 3

## Architecture Audit + Scope Freeze

Goal:

Understand the current system and prepare it for Caffiend 2.0.

Tasks:

* inspect current customer QR order implementation
* inspect current Admin implementation
* inspect current Supabase client/schema assumptions
* inspect Realtime architecture
* inspect existing menu-management architecture
* inspect authentication/security
* identify localStorage-based configuration that should become server-backed
* identify current order schema
* identify technical debt that directly affects payment/auth/KDS

Produce:

1. Current architecture summary
2. Current order lifecycle
3. Current database assumptions
4. Security weaknesses relevant to production
5. Proposed Caffiend 2.0 architecture
6. Required DB migration plan
7. Exact implementation sequence

Do not perform a large rewrite yet.

---

# PHASE 2 — WEEK 4

## Data Model + Authentication Foundation

Goal:

Prepare secure backend foundations.

Implement or prepare:

* Owner authentication with Supabase Auth
* protected Admin access
* required RLS/security policies
* improved order schema
* separate order/payment state
* server-backed store/menu configuration where necessary

Possible entities/fields should support:

Order:

* id
* table_number
* items
* total_amount
* order_status
* payment_status
* payment_method
* created_at
* paid_at
* accepted_at
* ready_at
* completed_at

Exact schema should be based on current repository/database reality.

Do not introduce unnecessary complexity.

Success condition:

Owner auth works and the data model can support online payments.

---

# PHASE 3 — WEEK 5

## Payment Sandbox

Goal:

Complete a secure TEST payment.

Target:

Customer cart
→ checkout
→ payment provider
→ successful test transaction
→ server-side verification

Do not yet optimize every UI edge case.

Priority:

correctness and security.

Required:

* sandbox environment
* server verification
* appropriate error states
* cancelled payment handling
* payment identity/order identity matching
* no secret payment keys in client

Success condition:

One real test order can successfully complete payment and produce a verified result.

---

# PHASE 4 — WEEK 6

## Full End-to-End Transaction

This is the most important milestone.

Target demonstration:

Phone
→ scan Table QR
→ select menu
→ cart
→ payment
→ verified payment
→ order appears on owner system
→ owner accepts
→ customer status changes

Success condition:

The complete critical path works without manual database intervention.

Do not proceed to cosmetic/optional features until this is stable.

---

# PHASE 5 — WEEK 7

## iPad KDS / Owner Dashboard

Redesign `/admin` or the appropriate owner route for iPad landscape use.

Target layout:

NEW | PREPARING | READY

Add:

* clear order cards
* large action controls
* elapsed order time
* payment indicator
* table number prominence
* customer notes/options
* completion workflow

Also improve:

* menu availability / sold-out management

Success condition:

The café owner could realistically operate incoming orders using the iPad.

---

# PHASE 6 — WEEK 8

## PWA + Analytics

PWA:

* manifest
* home-screen installation
* CAFFIEND OWNER branding/icon
* standalone display
* iPad behavior

If stable and feasible:

* new-order notification / Web Push

Analytics:

Add one practical owner analytics view:

* Today's Revenue
* Orders
* Average Order Value
* Best Seller
* Peak Hour

Do not build advanced BI.

Success condition:

Owner can launch CAFFIEND OWNER from the iPad Home Screen and see live operations + basic business metrics.

---

# PHASE 7 — WEEK 9

## Real Café Pilot + Optional App Packaging

Primary objective:

Test the system in the real Caffiend environment.

Verify:

* actual iPad
* actual customer phones
* QR routing
* Korean/English behavior
* real Wi-Fi/mobile network
* realtime behavior
* payment flow
* order state flow
* owner usability

Collect issues.

Fix high-impact problems first.

OPTIONAL only if the core product is stable:

* package for iPadOS/App Store workflow
* add meaningful native capability

Do not risk the working production system merely to meet an App Store goal.

---

# PHASE 8 — WEEK 10

## Stabilization + Final Research Result

Feature freeze.

No major new features.

Focus only on:

* bugs
* reliability
* UX friction
* deployment
* validation data
* documentation

Prepare before/after technical comparison.

Semester 1:

Website

* QR Ordering
* Basic Admin
* Counter Payment

Semester 2:

Website

* QR Ordering
* Online Payment
* Secure Owner Auth
* iPad KDS
* PWA
* Basic Analytics
* Real Café Validation

Document:

* problem
* previous limitation
* implementation
* technical architecture
* actual field feedback
* measured result
* limitations
* future work

---

# FUTURE WORK — DO NOT IMPLEMENT UNLESS CORE IS FINISHED

* AI sales insights
* demand prediction
* inventory forecasting
* loyalty
* membership
* coupons
* multi-store support
* generalized SaaS platform
* advanced POS integration
* iOS customer app
* Android owner app
* customer native app

---

# CRITICAL RULE

At every phase, prioritize this one flow:

PHONE QR
→ ORDER
→ PAYMENT
→ VERIFIED TRANSACTION
→ IPAD NEW ORDER
→ ACCEPT
→ PREPARING
→ READY
→ COMPLETE

This flow is the heart of Caffiend 2.0.

Do not sacrifice its reliability for secondary features.
