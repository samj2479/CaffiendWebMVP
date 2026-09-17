# CAFFIEND 2.0 — MASTER DEVELOPMENT PROMPT

Use the latest `main` branch of `samj2479/CaffiendWebMVP` as the source of truth.

Before modifying anything:

* inspect current repository structure
* read `AGENTS.md`
* inspect relevant implementation
* inspect relevant Next.js documentation if required
* identify what is already implemented
* do not duplicate existing functionality
* preserve currently working functionality

Do NOT begin by rewriting the project.

This is an incremental production upgrade of the existing Caffiend MVP.

---

# PRIMARY GOAL

Transform the current Caffiend system from:

**Website + QR Ordering + Basic Admin + Counter Payment**

into:

**Website + QR Ordering + Online Payment + Secure Owner System + iPad Realtime KDS + PWA + Basic Analytics**

by Week 10.

The owner uses an iPad.

The customer uses their own phone through QR/mobile web.

---

# PRIORITY ORDER

Development priority must remain:

## P0 — Essential

1. Stable existing QR ordering
2. Payment architecture
3. End-to-end payment verification
4. Secure owner authentication
5. Realtime order processing
6. iPad-optimized owner UI

## P1 — Important

7. Sold-out / menu availability controls
8. Basic owner analytics
9. PWA installation
10. Owner notification for new orders

## P2 — Optional

11. Native iPad packaging / App Store preparation
12. refund management
13. enhanced analytics

Do not implement P2 while P0 remains unstable.

---

# TARGET CUSTOMER FLOW

The target customer workflow is:

QR Scan
→ Table Identified
→ Browse Menu
→ Select Options
→ Cart
→ Checkout
→ Payment
→ Server Verification
→ Order Created / Confirmed
→ Live Status
→ Ready
→ Completed

The current "please pay at the counter" step should eventually disappear from the final production flow.

---

# PAYMENT REQUIREMENTS

Design payment integration securely.

Use sandbox/test mode first.

Payment success must NOT be trusted solely based on a client redirect.

Target architecture:

Client checkout
→ payment provider
→ payment completion callback/result
→ trusted server-side verification
→ verified payment record
→ order state update / creation

Payment and Order should have logically separate states.

Persist sufficient payment information for:

* payment status
* total paid
* payment method
* provider transaction/payment identifier
* payment time
* cancellation/refund state if later implemented

Never expose secret keys in client code.

Never place private payment credentials into `NEXT_PUBLIC_*`.

Do not commit credentials.

Use environment variables appropriately.

---

# OWNER AUTHENTICATION

Replace MVP PIN-only owner security.

Preferred stack:

Supabase Auth

The owner-facing system should require authentication.

Protect sensitive operations.

Where appropriate:

* use authorization
* use RLS
* restrict write operations
* avoid trusting client state alone

Document important security decisions.

---

# OWNER IPAD UI

Redesign the owner experience for actual iPad use.

Primary target:

iPad landscape orientation.

Do not constrain the main operating interface to a narrow mobile-width column.

Create a true tablet dashboard.

Suggested main layout:

Header:

* CAFFIEND OWNER
* current time
* today's revenue / order summary
* status indicator

Main KDS:

NEW | PREPARING | READY

Each order card should prominently display:

* table number
* elapsed time
* order time
* menu
* quantity
* temperature
* custom options
* customer note
* total
* payment state

Actions should be large and touch-friendly.

Examples:

NEW:
[ACCEPT] [CANCEL]

PREPARING:
[READY]

READY:
[COMPLETE]

Avoid tiny desktop controls.

This interface will be used in a real café.

---

# REALTIME BEHAVIOR

Preserve/strengthen Supabase Realtime.

Important events should reflect across customer and owner interfaces.

Example:

Customer pays/order created
→ iPad displays new order

Owner accepts
→ customer sees preparing state

Owner marks ready
→ customer sees ready state

Owner completes
→ order enters history

Avoid fragile state synchronization.

Always consider reconnection / refresh synchronization.

---

# SOLD-OUT MANAGEMENT

Add practical owner controls for menu availability if not already sufficiently implemented.

Owner should be able to toggle:

AVAILABLE
↔ SOLD OUT

Customer QR menu should reflect the result.

Do not delete products simply because they are sold out.

Availability should be reversible.

---

# BASIC ANALYTICS

Provide one simple useful owner dashboard.

Do not overbuild.

Minimum useful metrics:

* Today's Revenue
* Today's Orders
* Average Order Value
* Best Seller
* Peak Ordering Hour

Analytics must derive from real order/payment data.

Clearly define which states count toward revenue.

Cancelled/unpaid test orders should not incorrectly inflate revenue.

---

# PWA

Make the Owner interface installable on the owner's iPad.

Target:

Safari
→ Add to Home Screen
→ CAFFIEND OWNER icon
→ standalone app-like experience

Configure appropriate:

* web app manifest
* app name
* icons
* standalone display
* theme/background
* responsive behavior

If Web Push/new-order notifications can be implemented reliably within the timeline, add them after the primary ordering/payment flow is stable.

---

# NATIVE / APP STORE RULE

Do not rewrite the project using React Native.

Do not build an Android app unless explicitly requested.

The café owner uses an iPad.

If App Store packaging is attempted later:

Existing Web/PWA
→ suitable iOS/iPadOS packaging approach
→ meaningful native functionality

Potential native functionality:

* push notifications
* badge counts
* authentication integration
* keep-screen-awake behavior
* native alert/sound behavior

App Store submission is secondary to the functioning product.

---

# DESIGN REQUIREMENTS

Customer UI:

* mobile first
* fast
* minimal friction
* Korean + English
* easy ordering
* obvious payment state
* obvious order state

Owner UI:

* iPad first
* landscape optimized
* large touch targets
* high information clarity
* readable from operating distance
* fast status updates
* no unnecessary visual decoration during operation

Preserve Caffiend branding.

---

# RESEARCH / ENGINEERING VALUE

When making meaningful architecture changes, keep enough documentation that we can later explain:

* what the old architecture did
* what weakness/problem was identified
* what was changed
* why it was changed
* how the new implementation works
* what trade-offs were made

Examples:

Old:
Client-visible admin PIN

New:
Supabase Auth + session-based owner access

Old:
Counter payment

New:
Verified online transaction

Old:
Mobile-width admin screen

New:
iPad KDS dashboard

Old:
Basic order record

New:
Separated payment and fulfillment state

These before/after changes are important for the final university presentation and portfolio.

---

# TIME CONSTRAINT

We are currently in Week 3.

Deadline is Week 10.

Therefore:

Do NOT attempt to perfect everything simultaneously.

Always ask:

"Does this directly contribute to the final end-to-end demonstration?"

The final critical path is:

QR
→ MENU
→ CART
→ PAYMENT
→ VERIFIED ORDER
→ OWNER IPAD
→ ACCEPT
→ PREPARING
→ READY
→ COMPLETE

If a proposed change threatens this critical path, postpone it.

---

# DEVELOPMENT BEHAVIOR

For every substantial implementation task:

1. Inspect relevant current code first.
2. Explain briefly what currently exists.
3. Identify affected files.
4. Make the smallest architecture-consistent change.
5. Preserve existing KR/EN behavior where relevant.
6. Preserve existing menu/order features.
7. Run relevant type/lint/build/tests.
8. Check regressions.
9. Report exactly what changed.
10. Call out any database/environment/manual setup required.

Do not silently assume Supabase schema changes have already been applied.

When DB changes are required:

* provide SQL/migration clearly
* explain any RLS changes
* explain required environment variables
* explain how to verify the change

---

# SUCCESS DEFINITION

By the end of the project, Caffiend 2.0 should demonstrate:

A real customer can:

* scan QR
* select products
* pay
* submit an order
* follow live order status

The owner can:

* receive the order on an iPad
* manage preparation
* manage menu availability
* view basic operational data

The system should be deployable and testable in the actual Caffiend café.

This is the product target.

Avoid scope creep.
