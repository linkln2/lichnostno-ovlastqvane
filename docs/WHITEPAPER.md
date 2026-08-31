# Whitepaper — Technical Feature Reference

## Личностно овластяване · Personal Empowerment Web App

*Comprehensive catalog of all features, pages, API routes, and systems*

Last updated: 31 August 2026

---

## 1. Overview

The **Личностно овластяване** web app is a bilingual (Bulgarian/English) platform combining a public marketing site, e-commerce shop, event ticketing, membership subscriptions, a gated member area, and a staff admin dashboard — all built on a single Next.js codebase with Payload CMS for content management and Stripe for payments.

### Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19 + Tailwind CSS 4 |
| CMS / Admin | Payload CMS 3 (self-hosted, embedded) |
| Database | PostgreSQL 16 (Payload Postgres adapter) |
| Payments | Stripe (subscriptions, one-time, billing portal) |
| Email | Resend (transactional) |
| Fonts | Fraunces (serif), Inter (UI), JetBrains Mono (data) |
| Charts | Recharts (dashboard) |
| Hosting | Vercel (production), Netlify (configured) |
| QR Codes | `html5-qrcode` (scanner), custom JWT tokens |

---

## 2. Route Architecture

The app uses Next.js route groups, each with its own root layout:

| Group | Path | Purpose |
| --- | --- | --- |
| Public site | `app/(site)/` | Marketing, shop, events, membership, blog, legal |
| Dashboard | `app/(dashboard)/` | Staff-only Coaching Studio |
| Payload admin | `app/(payload)/` | Auto-generated `/admin` UI + REST/GraphQL API |
| App API | `app/api/` | Custom routes for commerce, auth, dashboard, webhooks |

---

## 3. Public Site Pages

| Page | Route | Features |
| --- | --- | --- |
| **Home** | `/` | Hero with logo, launch countdown timer, mission & values with orbiting solar system animation, caduceus symbolism cards, video feed (TikTok/Instagram tabs), shop preview carousel, membership tier cards, testimonials, recent blog posts, starfield background with particles |
| **About** | `/about` | Mission, values, team bio, particle/starfield effects |
| **Services** | `/services` | Service catalog cards + FAQ section |
| **Events** | `/events` | Upcoming & past events list |
| **Event detail** | `/events/[slug]` | Event info, ticket package selection, Stripe checkout, waitlist when sold out, view tracking |
| **Testimonials** | `/testimonials` | Participant stories grid |
| **Blog** | `/blog` | Published posts list |
| **Blog post** | `/blog/[slug]` | Full article + view count tracking |
| **Feed / Videos** | `/feed` | TikTok and Facebook embed tabs, follow CTAs |
| **Shop** | `/shop` | Product grid from Payload, category filters |
| **Product detail** | `/shop/[slug]` | Product info + Stripe checkout modal |
| **Membership** | `/membership` | Tier cards from Payload, inline login form, account activation, Stripe subscription checkout |
| **Membership success** | `/membership/success` | Post-payment confirmation |
| **Inner Circle** | `/inner-circle` | Gated member-only video feed (requires active membership) |
| **Account** | `/account` | Customer profile, active memberships, event tickets, product orders, logout |
| **Contact** | `/contact` | Contact form → saves to JSON store |
| **Legal** | `/legal/[slug]` | Terms, Privacy, Refund policy pages |
| **404** | `not-found` | Bilingual not-found with home link |

---

## 4. Dashboard (Staff Only)

| Page | Route | Features |
| --- | --- | --- |
| **Coaching Studio** | `/dashboard` | Overview tab (KPIs, revenue chart, momentum ring, recent orders, subscriber tier donut, upcoming events), Products tab (CRUD), Events tab (CRUD + Facebook import), Blog tab (CRUD), Orders tab (list + refund), Subscribers tab, Registrations tab, Analytics tab, Settings tab (social stats) |
| **Check-in scanner** | `/checkin` | QR code scanner using camera, validates tickets via `/api/checkin` |

---

## 5. API Routes

### 5.1 Public / Customer API

| Route | Methods | Description |
| --- | --- | --- |
| `GET /api/products` | GET | List published products |
| `GET /api/products/[slug]` | GET | Single product by slug |
| `GET /api/events/[slug]` | GET | Event + packages with spots-left/waitlist math |
| `GET /api/subscription-tiers` | GET | Membership tiers |
| `POST /api/register` | POST | Create event registration |
| `POST /api/contact` | POST | Save contact message |
| `POST /api/track` | POST | Increment view count (blog/event) |
| `GET /api/qr/[token]` | GET | PNG QR code image for a ticket |

### 5.2 Authentication

| Route | Methods | Description |
| --- | --- | --- |
| `POST /api/auth/login` | POST | Staff login (whitelisted emails, auto-provisions staff) |
| `POST /api/auth/customer-login` | POST | Customer login (requires active subscription + activated account) |
| `POST /api/auth/signup` | POST | Customer self-registration |
| `POST /api/auth/activate` | POST | Set password for subscriber after Stripe purchase |
| `GET /api/auth/me` | GET | Current user from token cookie |
| `POST /api/auth/logout` | POST | Clear auth cookie |

### 5.3 Commerce & Entitlements

| Route | Methods | Description |
| --- | --- | --- |
| `POST /api/checkout` | POST | Stripe Checkout for subscriptions, event tickets, products |
| `POST /api/portal` | POST | Stripe customer billing portal |
| `GET /api/entitlements` | GET | Customer memberships, tickets, products |
| `POST /api/webhooks/stripe` | POST | Stripe webhook: checkout, subscriptions, invoices |

### 5.4 Customer Self-Service

| Route | Methods | Description |
| --- | --- | --- |
| `GET /api/customer/orders` | GET | Customer order history |
| `GET /api/customer/registrations` | GET | Customer event registrations |
| `GET /api/customer/subscriptions` | GET | Customer subscriptions |

### 5.5 Staff Dashboard API

| Route | Methods | Description |
| --- | --- | --- |
| `GET /api/dashboard/stats` | GET | Overview: revenue, subscribers, events, orders |
| `GET /api/dashboard/analytics` | GET | Deep analytics: conversion, top blog, revenue time series |
| `GET/POST /api/dashboard/products` | GET, POST | List / create products |
| `PATCH/DELETE /api/dashboard/products/[id]` | PATCH, DELETE | Update / delete product |
| `GET/POST /api/dashboard/events` | GET, POST | List / create events |
| `PATCH/DELETE /api/dashboard/events/[id]` | PATCH, DELETE | Update / delete event |
| `GET/POST /api/dashboard/event-packages` | GET, POST | List / create event packages |
| `PATCH/DELETE /api/dashboard/event-packages/[id]` | PATCH, DELETE | Update / delete package |
| `GET/POST /api/dashboard/subscription-tiers` | GET, POST | List / create tiers |
| `PATCH/DELETE /api/dashboard/subscription-tiers/[id]` | PATCH, DELETE | Update / delete tier |
| `GET/POST /api/dashboard/blog-posts` | GET, POST | List / create blog posts |
| `PATCH/DELETE /api/dashboard/blog-posts/[id]` | PATCH, DELETE | Update / delete post |
| `GET /api/dashboard/orders` | GET | List all orders |
| `POST /api/dashboard/orders/[id]/refund` | POST | Stripe refund + mark order refunded |
| `GET /api/dashboard/registrations` | GET | List all registrations |
| `GET /api/dashboard/subscriptions` | GET | List all subscriptions |
| `GET/POST /api/dashboard/social-stats` | GET, POST | List / create social stats |
| `PATCH/DELETE /api/dashboard/social-stats/[id]` | PATCH, DELETE | Update / delete social stats |
| `POST /api/dashboard/upload` | POST | Upload file to media collection |
| `POST /api/dashboard/events/import-facebook` | POST | Scrape Facebook event → create event record |

### 5.6 Setup / Migration

| Route | Methods | Description |
| --- | --- | --- |
| `POST /api/setup` | POST | One-time staff + product seed (requires `?key=`) |
| `POST /api/migrate` | POST | Force Drizzle schema push (requires `?key=`) |

---

## 6. Payload CMS Collections

| Collection | Auth | Access | Key Fields |
| --- | --- | --- | --- |
| **Staff** | Yes | `isStaff` role-based | `name`, `role` (owner/admin/editor) |
| **Customers** | Yes | Public create | `name`, `phone`, `city`, `stripeCustomerId` |
| **Media** | No | Public read, staff CUD | Upload to `public/media`, `alt` |
| **Blog Posts** | No | Public read, staff CUD | `title` (loc), `slug`, `excerpt`, `body`, `coverImage`, `status`, `publishAt`, `viewCount` |
| **Events** | No | Public read, staff CUD | `title` (loc), `slug`, `description`, `location`, `startsAt`, `endsAt`, `capacity`, `status`, `packages`, `viewCount`, `facebookEventId` |
| **Event Packages** | No | Public read, staff CUD | `event` relation, `name` (loc), `priceCents`, `spots`, `stripePriceId` |
| **Products** | No | Public read, staff CUD | `name`, `slug`, `description`, `priceCents`, `category`, `inventory`, `images`, `stripePriceId` |
| **Subscription Tiers** | No | Public read, staff CUD | `name`, `priceCents`, `interval`, `stripePriceId`, `perks[]` |
| **Pages** | No | Public read, staff CUD | `title`, `slug`, `content`, `seoTitle`, `seoDescription` |
| **Orders** | No | Staff only | `customer`, `source`, `stripeSessionId`, `status`, `totalCents`, `items[]` |
| **Registrations** | No | Public create, staff read | `customer`, `event`, `package`, `status`, `qrToken` |
| **Subscriptions** | No | Staff only | `customer`, `tier`, `stripeSubscriptionId`, `status`, `currentPeriodStart/End`, `cancelAtPeriodEnd` |
| **Check-Ins** | No | Staff only | `registration`, `staff`, `checkedInAt` |
| **Social Stats** | No | Public read, staff CUD | `platform`, `handle`, `followers`, `posts`, `engagementRate` |

**Localization:** bg (default), en (fallback) — enabled on title, excerpt, body, description, name fields.

---

## 7. Authentication & Access Model

### Staff Auth
- Whitelisted emails in `lib/auth.ts`
- `/api/auth/login` auto-creates staff user if missing
- `requireStaff` middleware protects all `/api/dashboard/*` routes
- `proxy.ts` redirects `/admin` → `/dashboard` if already authenticated

### Customer Auth
- Customers sign up via `/api/auth/signup` or are auto-created on Stripe checkout
- After Stripe purchase, customers receive an activation link to set a password (`/api/auth/activate`)
- Login via `/api/auth/customer-login` requires an active subscription
- `lib/entitlements.ts` computes: `hasActiveMembership`, `hasTierAtLeast`, `hasEventTicket`, `ownsProduct`

### Route Protection (`proxy.ts`)
- `/login` → redirects to `/membership`
- `/dashboard`, `/inner-circle`, `/account` → require `payload-token` cookie, else redirect to `/membership`

---

## 8. Commerce & Stripe Integration

### Checkout Types
1. **Subscriptions** — `POST /api/checkout` with `mode: "subscription"` + `tierId`
2. **Event tickets** — `POST /api/checkout` with `eventPackageId`
3. **Products** — `POST /api/checkout` with `productId`

### Stripe Webhook Lifecycle
- `checkout.session.completed` → create registrations + orders, decrement inventory, send confirmation email
- `customer.subscription.created/updated` → create/update subscription records
- `customer.subscription.deleted` → mark subscription as cancelled
- `invoice.payment_failed` → send dunning email

### Billing Portal
- `POST /api/portal` creates a Stripe Customer Portal session for self-service subscription management

---

## 9. Email System (Resend)

| Function | Trigger | Content |
| --- | --- | --- |
| `sendOrderConfirmation` | Product purchase | Order details, product info |
| `sendTicketConfirmation` | Event registration | Ticket details + embedded QR code image |
| `sendSubscriptionWelcome` | New subscription | Welcome message, tier perks |
| `sendPaymentFailed` | Failed invoice | Dunning notice with retry info |

---

## 10. Theme System

- **ThemeProvider** exposes `useTheme()` → `{ theme, toggleTheme, mounted }`
- **Default:** Time-based (dark mode 19:00–06:00, light otherwise)
- **Manual toggle:** Saves to `localStorage`, overrides auto-switching
- **Toggle UI:** Sun/moon icon button in navbar (desktop) + labeled button in mobile menu
- **Hydration-safe:** Server renders light, client adjusts after mount
- All section backgrounds are opaque in light mode with `dark:` variants

---

## 11. Internationalization

- **Languages:** Bulgarian (bg, default) + English (en)
- **Dictionary:** `lib/i18n.ts` with `tr(key, locale)` helper
- **Content:** `lib/content.ts` holds bilingual structured content
- **CMS:** Payload collections are localized (bg/en)
- **UI:** Language toggle in header (BG/EN pills), persisted via `LocaleProvider`

---

## 12. Components

### Site Components
| Component | Purpose |
| --- | --- |
| `Header` | Sticky nav with logo, menu, theme toggle, language toggle, auth-aware links |
| `Footer` | 4-column grid: Company, Discover, Offerings, Support + contact + social + copyright |
| `LocaleProvider` | React context for locale state (localStorage persistence) |
| `ThemeProvider` | Dark/light theme with time-based default + manual toggle |
| `CookieConsent` | GDPR consent banner |
| `CountdownTimer` | Launch countdown to target date |
| `ParticleBurst` | Animated particle effect for hero/mission sections |
| `SolarSystemOrbits` | Decorative orbiting planets animation |
| `StarfieldBackground` | Canvas-based animated starfield with colored stars + comets |
| `RegistrationForm` | Event registration form component |
| `TikTokEmbed` | TikTok video feed embed |
| `FacebookEmbed` | Facebook page embed |

### Dashboard Components
| Component | Purpose |
| --- | --- |
| `DashboardShell` | Main layout with tab switcher + overview |
| `Sidebar` / `Topbar` | Navigation |
| `StatCard` | KPI metric card |
| `MomentumRing` | Circular progress indicator |
| `GlassCard` | Glassmorphism container |
| `RevenueChart` | Revenue trend (Recharts) |
| `RecentOrdersTable` | Orders data table |
| `UpcomingEventsList` | Event list widget |
| `SubscriberTierDonut` | Tier distribution donut chart |
| Tab components | Products, Events, Blog, Orders, Subscribers, Registrations, Analytics, Settings |

---

## 13. Business Logic Libraries

| File | Exports | Purpose |
| --- | --- | --- |
| `lib/auth.ts` | `WHITELISTED_EMAILS`, `isWhitelisted` | Staff email whitelist |
| `lib/entitlements.ts` | `getCustomerEntitlements`, `hasMembership`, `hasTierAtLeast`, `hasEventTicket`, `ownsProduct` | Customer gating logic |
| `lib/stripe.ts` | `getStripe`, `createSubscriptionCheckoutSession`, `createPortalSession` | Stripe helpers |
| `lib/email.ts` | `sendOrderConfirmation`, `sendTicketConfirmation`, `sendSubscriptionWelcome`, `sendPaymentFailed` | Transactional emails |
| `lib/i18n.ts` | `locales`, `defaultLocale`, `tr`, `localeNames` | Translations |
| `lib/payload.ts` | `getPayloadInstance`, `ensureEvent` | Payload instance + helpers |
| `lib/content.ts` | Static content objects | Bilingual marketing copy, events, blog, products, tiers |
| `lib/dashboard-api.ts` | `requireStaff`, `fetchCollection`, `createRecord`, `updateRecord`, `deleteRecord`, `loc` | Dashboard API utilities |
| `lib/qr.ts` | `generateQrToken`, `verifyQrToken` | JWT QR tokens for tickets |
| `lib/utils.ts` | `cn` | Class name merge helper |

---

## 14. SEO & Discovery

- `app/sitemap.ts` — static + dynamic URLs (events, blog, products)
- `app/robots.ts` — disallows `/admin`, `/dashboard`, `/api`, `/checkin`
- Per-page metadata with Open Graph tags
- Blog post and event view tracking via `/api/track`

---

## 15. Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | Postgres connection string |
| `PAYLOAD_SECRET` | Payload session/token signing |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL |
| `STRIPE_SECRET_KEY` | Stripe API secret |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `RESEND_API_KEY` | Resend email API key |
| `FROM_EMAIL` | Sender email address |
| `SETUP_KEY` | One-time setup/migrate endpoint key |
| `INITIAL_STAFF_PASSWORD` | Staff seed password |

---

## 16. Deployment

- **Production:** Vercel (auto-deploy on push to `main`)
- **Build:** `npm run build` (Turbopack, ~21s build time)
- **Database:** PostgreSQL (managed or Docker for dev)
- **Static generation:** 54 pages prerendered
- **Dynamic routes:** Event/blog/product detail, all API routes

---

## 17. Known Gaps & Recommendations

1. **Thank-you/cancel pages** — Stripe checkout redirects to `/thank-you` and `/cancel` but these pages don't exist yet
2. **Customer orders API** — `/api/customer/orders` returns only profile, not actual orders
3. **QR scanner page protection** — `/checkin` page itself isn't protected by `proxy.ts`
4. **Setup/migrate endpoints** — Should be removed or disabled after initial deployment
5. **Demo analytics fallbacks** — Dashboard stats fall back to simulated numbers when no real data exists
6. **Placeholder content** — `lib/content.ts` contains dummy products and TikTok URLs to be replaced with real data via Payload
