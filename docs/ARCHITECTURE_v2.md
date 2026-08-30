# Platform Architecture Design v2

### Full feature set: shop, subscriptions, bookings, owner dashboard, accounts, CMS, automations

## 1. Revised stack decision

The v1 design recommended hand-rolled `/admin/*` CRUD pages. Given the full
feature list — rich text editing, media library, SEO fields, draft/scheduled
states, multilingual content, plus commerce data all in one dashboard — that
would mean rebuilding a CMS by hand. Not worth it. Revised stack:

| Layer | Choice | Role |
|---|---|---|
| CMS + Admin dashboard | **Payload CMS** (self-hosted, embeds directly in your Next.js app, Postgres adapter) | Owns: blog posts, events, products, subscription tiers, media library, SEO fields, draft/publish/scheduled states, localization (EN/BG), and the entire admin UI. Ships RBAC out of the box. |
| Database | **Postgres** (via Payload's Postgres adapter — can be the same Supabase Postgres instance, or plain Postgres on any host) | Single source of truth for everything, including commerce tables. |
| Customer accounts | **Payload auth-enabled collections** (`Staff` for admin/owner, `Customers` for the public) | Payload supports multiple auth collections with different access rules — one login system, two roles, no separate auth vendor needed. |
| Payments | **Stripe** (Checkout, Billing, Customer Portal, Coupons) | All money movement: one-time purchases, subscriptions, discount codes, refunds. Payload stores references (`stripe_price_id`, `stripe_subscription_id`), Stripe stays source of truth for billing state, synced via webhook. |
| Transactional + marketing email | **Resend** | Order confirmations, registration confirmations, password reset, welcome sequence, abandoned cart, event reminders, newsletter broadcasts. |
| Bookings (1:1 coaching) | **Cal.com embed** for launch; native `Bookings` collection later if you need tighter control over payment-gated slots | Fastest path to a working booking flow without building calendar logic from scratch. |
| QR check-in | `qrcode` npm package generating a signed token per registration; a `/checkin` staff-only mobile page scans and calls an API route that flips `registrations.status` to `checked_in` | No new vendor needed. |

**Why Payload over Sanity:** Sanity's editor is excellent but it is a separate
hosted data store — you'd end up syncing content between Sanity and your
commerce/subscription tables in Postgres. Payload lives *inside* your Next.js
app and reads/writes the same Postgres database as everything else, so a
blog post, a product, and an order are all just rows you can join, and the
admin UI is generated from your schema instead of hand-built.

---

## 2. Collections (Payload) / tables (commerce)

Payload collections (each gets a generated admin UI: list, create, edit,
publish states, media picker, localization tabs automatically):

```
Staff            (auth-enabled: name, email, role: admin | owner | editor)
Customers        (auth-enabled: name, email, phone, city, billing prefs,
                  stripe_customer_id)
BlogPosts        (title, slug, body [rich text], cover image, SEO fields,
                  status: draft/published/scheduled, publishAt, locale,
                  visibility: public | members-only, memberTierRequired)
Events           (title, description, startsAt, capacity, locale, status)
EventPackages    (event relation, name, price, stripePriceId)
Products         (name, description, price, images, category, variants,
                  digital|physical, downloadFile, inventory, status)
SubscriptionTiers(name, stripePriceId, priceCents, interval, perks[])
Media            (shared media library — images, PDFs, recordings)
Pages            (Terms, Privacy, Refund Policy — simple CMS pages)
```

Commerce tables (still Postgres, queried directly by Stripe webhook handlers
— can be plain Payload collections too, but treated as system-of-record
mirrors of Stripe rather than editor-facing content):

```
Orders, OrderItems, Registrations, Subscriptions, DiscountRedemptions,
CheckIns, BookingSlots (if native booking is built later)
```

RBAC: Payload access-control functions per collection —
e.g. `BlogPosts.update`: only `Staff` with `role in [admin, editor]`;
`Orders.read`: `Staff.role === admin` or the `Customer` who owns the order.
This replaces the manual middleware-based role check from v1 with
declarative rules Payload enforces on every API call automatically.

---

## 3. Commerce & subscription flow

**One-time purchase (shop or event ticket):**
1. Customer checks out → Next.js route creates a Stripe Checkout Session using the product's `stripePriceId`.
2. Discount codes: pass Stripe Coupon/Promotion Code IDs into the session — Stripe validates and applies them, no custom coupon logic needed.
3. Webhook `checkout.session.completed` → create `Order`/`Registration` row, decrement inventory, trigger Resend confirmation email, generate QR code for event tickets.

**Subscriptions:**
1. Checkout Session in `subscription` mode against a `SubscriptionTiers.stripePriceId`.
2. Webhooks (`customer.subscription.*`, `invoice.paid`, `invoice.payment_failed`) sync `Subscriptions` table — this table gates access to members-only `BlogPosts`/content, not a live Stripe call per page view.
3. Failed payments: Stripe's built-in retry/dunning settings handle retries; `invoice.payment_failed` webhook triggers a Resend "update your payment method" email pointing to the Stripe Customer Portal.
4. Upgrade/downgrade/cancel/invoice history: all handled by the **Stripe Customer Portal** link — you don't build this UI.

**Refunds:** issued from the admin dashboard (a button on the `Orders` view calling Stripe's refund API) or directly in Stripe Dashboard; webhook `charge.refunded` updates status.

---

## 4. Events & check-in

- `Registrations` row created at checkout (or free-registration if the event has a free tier).
- On payment/confirmation, generate a signed QR token (`jwt.sign({registrationId}, secret)`) rendered as a QR image, sent via Resend with an `.ics` calendar attachment.
- `/checkin` page (staff-only, mobile-friendly, uses device camera via a JS QR-scanning lib) posts the scanned token to `/api/checkin`, which verifies the signature and flips status to `checked_in`. Prevents duplicate check-ins.
- Waitlist: if `Registrations.count >= Events.capacity`, new signups get `status: waitlisted`; a scheduled job or admin action promotes them and emails via Resend when a spot frees up.
- Attendee list export: CSV export button on the admin `Registrations` view (Payload supports this natively or via a small custom endpoint).

---

## 5. Marketing automations

Keep this on Resend rather than adding a marketing-automation vendor initially:
- **Welcome sequence** and **abandoned cart**: triggered by webhook/DB events (e.g. `order.status = pending` for >2h with no `paid` transition) calling Resend's API from a scheduled Netlify function.
- **Newsletter**: Resend Broadcasts, audience synced from `Customers` who opted in.
- **Event reminders**: scheduled function querying `Events.startsAt` within 24-48h, emailing registered attendees.
- Revisit a dedicated automation tool (Customer.io, Loops) only if sequences get complex enough that hand-rolled scheduling becomes a maintenance burden — not needed for launch.

---

## 6. Analytics & compliance

- **Analytics**: a custom `/admin/analytics` view (or a Payload "globals" dashboard) running SQL aggregates directly — revenue by product/event/subscription, active vs. churned subscribers (from `Subscriptions.status`), registration conversion (`Registrations` vs. page views if you add basic event tracking). No BI tool needed at this scale; add one later if reporting needs outgrow SQL views.
- **Email open/click tracking**: Resend provides this natively in its dashboard/webhooks — pipe into the same analytics view if you want it in one place.
- **Compliance**: cookie consent banner (client-side library, e.g. `vanilla-cookieconsent`), static `Pages` collection for Terms/Privacy/Refund Policy, and invoice PDF generation with VAT fields (Bulgarian requirement) generated server-side per paid `Order` — a template + PDF library, triggered on `checkout.session.completed`.
- **Audit trail**: Payload has built-in versioning/drafts per document; for payments, Stripe's own event log is your audit trail — don't duplicate it, just link to it from the admin `Orders` view.

---

## 7. Revised phasing

| Phase | Scope |
|---|---|
| 0 | Lock down current unauthenticated `GET /api/register`. Stand up Postgres + Payload, define collections. |
| 1 | Migrate events/blog off `lib/content.ts` into Payload. Registrations write to Postgres. Staff/admin login live. |
| 2 | Stripe Checkout for event tickets (replaces manual Payment Links) + QR ticket + check-in page. |
| 3 | Shop: Products collection, cart, Checkout, order confirmation emails, digital downloads. |
| 4 | Subscriptions: tiers, Stripe Billing, members-only content gating, Customer Portal link, dunning emails. |
| 5 | Customer accounts (order history, saved details), discount codes, abandoned-cart + welcome sequences. |
| 6 | 1:1 booking (Cal.com embed), analytics dashboard, compliance pages + invoice PDFs, waitlist. |

Each phase is independently shippable — commerce and subscriptions don't
block on the booking or analytics phases, and the admin dashboard exists
from Phase 1 onward rather than being a separate late-stage build.

---

## 8. What changed from v1

- Admin dashboard is no longer hand-built — Payload generates it from the collection schema, saving the CRUD/media-library/rich-text/SEO-field work entirely.
- Auth is now two Payload collections (`Staff`, `Customers`) instead of Supabase Auth + a custom `profiles` role table — same outcome, fewer moving parts.
- Discount codes, refunds, and dunning are pushed onto Stripe's native features rather than custom logic.
- Added: QR check-in, waitlist, booking, invoice/VAT generation, and marketing automations — none of which existed in v1's scope.
