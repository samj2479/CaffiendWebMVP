# CAFFIEND 2.0 — Development Context Summary

You are now continuing development of the **Caffiend Web MVP** project.

## 1. Source of Truth

The authoritative source of truth is always the latest `main` branch of:

`samj2479/CaffiendWebMVP`

Before answering implementation questions or modifying code:

1. Inspect the latest GitHub `main` branch.
2. Read `AGENTS.md`.
3. Read relevant project files.
4. Use `CONTEXT.md` only as supporting documentation.
5. If `CONTEXT.md` or old uploaded files conflict with current code, **current GitHub main wins**.
6. This project uses a newer version of Next.js. Follow the repository's Next.js agent instructions and inspect the relevant documentation under `node_modules/next/dist/docs/` before using unfamiliar or potentially changed Next.js APIs.

Do not assume an older project state.

---

# 2. Project Background

Caffiend is a real local café in Pohang, South Korea.

The first version of this project was developed during a university course in the previous semester and received an **A0 grade**.

The project was initially developed primarily through AI-assisted / vibe coding, with Claude Code.

Development is now continuing with GPT Codex.

Despite the developer not having extensive traditional software-development experience, the first-semester project successfully reached a functional MVP.

The purpose of the second-semester individual research project is **not to rebuild the same product**.

The goal is to take the existing MVP and produce a clearly more advanced, production-oriented result that can be demonstrated as a meaningful improvement in:

* functionality
* architecture
* business usefulness
* real-world operation
* user experience
* reliability
* security
* commercialization potential

The final outcome should be strong enough to become:

* a university research/project result
* a portfolio project
* a resume experience
* a project that can be explained meaningfully during interviews

---

# 3. University Project Context

This semester is an **Individual Research / major elective project**.

The professor emphasized that the course should produce practical experience connected to:

* local-company collaboration
* solving actual business problems
* entrepreneurship
* digital startup capability
* generative AI usage
* communication with stakeholders
* field operation
* collecting feedback
* improving a product based on real feedback
* producing something meaningful enough to include in a portfolio/resume

The course also values contribution to local businesses and the local community.

Therefore, development decisions should prioritize **real usefulness to Caffiend**, not adding impressive-looking but unnecessary technology.

---

# 4. Current Project Structure

Caffiend currently consists of three major surfaces.

## A. Public Website

The public-facing Caffiend website includes functionality such as:

* landing page
* café branding/story
* menu
* reservation-related information
* store/location information
* notices
* allergy information
* Korean / English support

The site supports both Korean and English.

---

## B. Customer QR Table Order

Customers scan a QR code placed at a café table.

The QR route identifies the table and opens the customer ordering interface.

Example concept:

`/order/[table]`

The customer can:

* browse menu categories
* search menu items
* select menu items
* select options
* select HOT / ICE where applicable
* select custom options
* enter notes
* see allergy information
* add products to a cart
* submit the order
* view order history/status
* cancel an eligible pending order

Orders are stored through Supabase.

Current order status concept includes:

* pending
* cooking
* completed
* cancelled

Supabase Realtime is used so customer/admin order status changes can update live.

---

## C. Owner / Admin System

The current `/admin` interface provides operational functionality including:

* viewing incoming orders
* accepting orders
* cancelling orders
* marking cooking as completed
* order history
* website menu management
* QR menu management
* QR option/detail management
* price/configuration management

The admin system currently still contains MVP-level architectural decisions that should be improved during this semester.

For example, the current admin authentication concept still includes a simple client-visible PIN approach.

That was acceptable for an MVP but is **not acceptable as the final production-oriented architecture**.

---

# 5. Current Major Product Limitation

The most important current customer-flow limitation is:

Customer scans QR
→ selects menu
→ submits order
→ order reaches owner
→ **customer must still go to the counter to pay**

The current success screen explicitly asks the customer to pay at the counter.

This creates the biggest break in the digital ordering experience.

Therefore, one of the primary second-semester improvements will be:

# ONLINE PAYMENT

Target flow:

QR
→ Menu
→ Cart
→ Online Payment
→ Payment Verification
→ Order Confirmed
→ Owner iPad receives order
→ Preparing
→ Ready
→ Completed

This is a fundamental progression from:

**Digital Order Prototype**

to:

**Digital Transaction + Store Operation System**

---

# 6. Important Real-World Constraint

The café owner uses an **iPad** as the primary operational device.

Therefore, do NOT assume the primary owner application should be Android.

The owner experience should be designed around:

# iPad-first operation

The preferred strategy is:

Customer:

* mobile web QR ordering

Owner:

* iPad-optimized web application / PWA

Potential later step:

* native/App Store packaging if time allows

The customer should NOT be forced to install an application just to order.

QR ordering should remain frictionless through the browser.

---

# 7. PWA Direction

The preferred owner application strategy is currently:

Existing Next.js Admin
→ redesign for iPad
→ make installable as a PWA
→ launch from iPad Home Screen like an app
→ provide operational functionality

The owner PWA should eventually support features such as:

* full-screen standalone experience
* app icon
* install to iPad home screen
* responsive iPad landscape layout
* new-order notification
* order-status management
* store management

If technically feasible within the project timeline, native-like features such as Web Push may be added.

App Store submission is considered an optional later milestone, not the core objective.

If App Store packaging is pursued, the application should provide meaningful app-specific value rather than simply wrapping the website.

---

# 8. Semester Timeline

The project is currently at:

# Week 3

Hard deadline:

# Week 10

If an App Store/mobile-app submission is attempted, it should effectively be ready around:

# Week 9

Therefore, scope control is extremely important.

Do not attempt to rebuild everything.

Do not introduce major unnecessary frameworks.

Prefer extending the existing architecture.

---

# 9. Confirmed Core Development Direction

The second-semester project should focus on four main improvements.

## 1. Online Payment

Complete the digital ordering flow.

Target:

QR
→ Cart
→ Payment
→ Server-side payment verification
→ Paid order
→ Owner receives order

Start with a sandbox/test payment environment.

Do NOT trust client-only payment success.

Payment confirmation should be securely verified server-side.

A Korean PG/payment integration is preferred.

Possible payment experience may ultimately include methods such as:

* card
* KakaoPay
* NaverPay

However, implementation should prioritize a practical PG integration rather than independently implementing every payment provider.

---

## 2. Production-Oriented Owner/Admin System

Upgrade the current admin tool into an actual café operation interface.

Target concept:

# Caffiend Owner

The owner uses the iPad in landscape mode.

The system should behave closer to a lightweight:

* KDS (Kitchen Display System)
* order-management system
* store-control dashboard

Possible main order columns/states:

NEW
PREPARING
READY

Each order should clearly show:

* table number
* order time
* elapsed time
* ordered products
* options
* quantity
* total price
* payment state

Operational buttons may include:

* Accept
* Ready
* Complete
* Cancel

The UI should be optimized for quick use during café operation.

---

## 3. Security / Architecture Improvement

Replace MVP-level admin security with a proper authentication/authorization approach.

Target direction:

Owner Login
→ Supabase Auth
→ authenticated session
→ protected owner/admin functions
→ appropriate authorization/RLS where needed

The second semester should demonstrate that the project matured architecturally, not merely visually.

Order status and payment status should also be treated as separate concepts.

Example:

Order status:

* pending
* accepted
* preparing
* ready
* completed
* cancelled

Payment status:

* unpaid
* pending
* paid
* failed
* cancelled
* refunded

Only implement states actually needed by the final flow, but keep the architecture logically separated.

---

## 4. Basic Business Analytics

The owner should receive basic useful operational data.

Keep this limited and practical.

Initial dashboard candidates:

* today's revenue
* order count
* average order value
* best-selling menu
* peak ordering time

Advanced AI analytics, inventory prediction, complex BI, and multi-store SaaS are NOT primary goals for this semester.

They may be documented as future work.

---

# 10. Real-World Validation

This project should not finish only as code.

One major goal is to test it in the actual Caffiend café.

Target process:

Develop
→ deploy
→ place QR codes / use existing QR setup
→ owner operates through iPad
→ real users interact
→ collect feedback
→ identify failures/friction
→ improve system
→ report findings

Potential metrics:

* number of QR sessions
* number of submitted orders
* payment completion rate
* failed payment count
* cancelled order count
* average order amount
* ordering completion time
* owner satisfaction
* customer usability ratings

Do not fabricate data.

Actual collected data should be clearly distinguished from test data.

---

# 11. Features We Are NOT Prioritizing

Unless explicitly requested later, do NOT allow scope creep into:

* customer native app
* customer account system
* loyalty points
* coupon ecosystem
* delivery
* complex reservation rebuild
* multi-store SaaS implementation
* advanced inventory management
* full POS replacement
* AI chatbot
* sophisticated AI forecasting
* simultaneous Android + iOS rewrites
* React Native rewrite
* rewriting the entire existing frontend

These can be future-work concepts.

---

# 12. Development Philosophy

When making development decisions:

1. Preserve existing working functionality whenever possible.
2. Avoid unnecessary rewrites.
3. Improve architecture incrementally.
4. Prioritize real café workflow.
5. Prioritize reliability over flashy functionality.
6. Optimize Owner UI for iPad.
7. Optimize Customer UI for mobile browsers.
8. Maintain Korean/English customer support.
9. Keep implementation realistic for the Week 10 deadline.
10. Prefer a small number of fully working improvements over many incomplete features.

The target is not:

"Add as many features as possible."

The target is:

"Turn the existing MVP into a meaningfully more production-ready café platform."

---

# 13. Main Project Narrative

The preferred project narrative is:

## Semester 1

Prototype / MVP

* Public Website
* QR Table Ordering
* Basic Admin
* Realtime Order Status
* Counter Payment

## Semester 2

Productionization + Field Validation

* Online Payment
* Secure Owner Authentication
* iPad-focused Realtime Store Operation
* PWA Owner Experience
* Basic Sales Analytics
* Real Café Deployment
* Field Feedback / Validation

Possible project title:

# Caffiend 2.0: From QR Ordering Prototype to an Integrated Smart Café Operation Platform

Possible academic subtitle:

**Development and Field Validation of an Integrated QR Ordering, Online Payment, and Mobile Store Management System for a Local Café**

---

# 14. Expected Final Demonstration

The ideal final end-to-end demo is:

1. Customer uses a phone.
2. Customer scans a table QR code.
3. Correct table order page opens.
4. Customer selects menu/options.
5. Customer checks cart.
6. Customer makes an online test/real payment.
7. Payment is verified.
8. Order is created.
9. Owner's iPad immediately receives/displays the order.
10. Owner accepts the order.
11. Customer sees the status change.
12. Owner marks order ready.
13. Customer sees order ready.
14. Order is completed.
15. Sales/order analytics reflect the transaction.

This end-to-end flow is the main success criterion.

Always keep this development context in mind when working on Caffiend.
