# Roadmap

**Личностно овластяване · Personal Empowerment** — Web App Roadmap

---

## Launch Target

| | |
| --- | --- |
| **Launch date** | **10 November 2026 (10.11.2026)** |
| **Roadmap authored** | 29 August 2026 |
| **Days remaining** | **73 days** (10 weeks + 3 days) |
| **Status** | 🟡 In progress — scaffolding complete, pages pending |

The roadmap is organized into **4 phases** that fit within the 73-day window to launch. Each phase ends with a reviewable milestone. Dates are working targets and may shift — see [`docs/COUNTDOWN.md`](./docs/COUNTDOWN.md) for live tracking.

---

## Phase 1 — Foundation & Layout  _(Weeks 1–2 · 29 Aug – 12 Sep)_

> Goal: A navigable, bilingual shell with the design system in place.

- [ ] Read Next.js 16 docs (`node_modules/next/dist/docs/`) for layout, page, and route conventions
- [ ] Build root layout with Geist fonts, metadata, and `<html lang>` wiring
- [ ] Create shared navigation bar with language toggle (BG / EN)
- [ ] Create footer with tagline, nav links, contact, and social
- [ ] Set up Tailwind design tokens (colors, spacing, typography) in `globals.css`
- [ ] Implement locale state (cookie or URL-based) and `tr()` integration
- [ ] Add logo to header with responsive sizing
- [ ] Create reusable UI primitives: `Button`, `Section`, `Card`, `Badge`

**Milestone 1 — 12 Sep:** Bilingual shell renders on all routes with working language toggle.

---

## Phase 2 — Core Pages & Content  _(Weeks 3–5 · 13 Sep – 3 Oct)_

> Goal: All marketing pages built with placeholder bilingual content.

- [ ] **Home** — hero, mission, next-event teaser, "how it works", testimonials preview, CTA
- [ ] **About** — story, mission, values, team (Denitsa Vladimirova bio)
- [ ] **Services** — programs & services cards (seminars, coaching, Theta, constellations)
- [ ] **Events** — upcoming + past events list with detail views
- [ ] **Testimonials** — participant stories grid
- [ ] **Blog** — article list + individual post pages
- [ ] **Contact** — contact form + contact info + map placeholder
- [ ] Populate `lib/i18n.ts` with all page content strings (BG + EN)
- [ ] Add placeholder images / OG graphics to `public/`

**Milestone 2 — 3 Oct:** All 7 marketing pages live with bilingual content and navigation.

---

## Phase 3 — Event Registration & Forms  _(Weeks 6–8 · 4 Oct – 24 Oct)_

> Goal: Functional registration, contact, and newsletter flows.

- [ ] Create `POST /api/register` route — validates and saves to `data/registrations.json`
- [ ] Build event registration form component (name, email, phone, city, package, notes)
- [ ] Add success / error states with i18n strings
- [ ] Create `POST /api/contact` route — saves inquiries to `data/inquiries.json`
- [ ] Build contact form with validation
- [ ] Create `POST /api/newsletter` route — saves subscribers to `data/subscribers.json`
- [ ] Add newsletter signup component in footer
- [ ] Input validation (server + client) and spam protection (honeypot)
- [ ] Admin view (protected) to list registrations

**Milestone 3 — 24 Oct:** Users can register for events, send messages, and subscribe — data persists to JSON.

---

## Phase 4 — Polish, SEO & Launch  _(Weeks 9–10 + 3 days · 25 Oct – 10 Nov)_

> Goal: Production-ready, optimized, and deployed.

- [ ] SEO: per-page metadata, Open Graph tags, `sitemap.ts`, `robots.ts`
- [ ] Accessibility audit (keyboard nav, ARIA, color contrast)
- [ ] Mobile responsiveness review across all pages
- [ ] Performance pass — image optimization, font loading, lazy loading
- [ ] Add 404 / error pages with bilingual content
- [ ] Analytics integration (Plausible or GA4)
- [ ] Final content review with stakeholder (Denitsa)
- [ ] Replace placeholder content with final copy
- [ ] DNS + domain configuration
- [ ] Netlify production deploy + smoke tests
- [ ] Soft launch (private link) for feedback
- [ ] **Public launch on 10.11.2026**

**Milestone 4 — 10 Nov:** Site is live to the public at the official domain.

---

## Post-Launch — Phased Monetization & Growth

Items deferred until after the 10.11.2026 launch. The sequence below is based on
the market research in [`docs/WHITEPAPER.md`](./docs/WHITEPAPER.md) — start with
low-cost, low-dev tools, then build custom systems when volume justifies it.

### Post-Launch Phase 1 — First Sales _(target: within 2 weeks of launch)_

> Goal: Revenue path live with minimal development.

- [ ] **Stripe Payment Links** — create a payment link per event in the Stripe
      dashboard; wire the "Register" button to open the link. Zero custom code
      needed — just a URL per event in `lib/content.ts`.
- [ ] **Cal.com embed** — embed a free Cal.com booking page on the Services
      page for 1:1 coaching sessions. No backend needed — iframe or React embed.
- [ ] Keep the existing free registration form as a fallback (bank transfer /
      cash at the door option)
- [ ] Track registrations manually (Stripe dashboard + JSON store) until Phase 3

**Rationale:** Stripe Payment Links cost only the Stripe processing fee (~2.9% +
0.30 BGN) with no platform fee. Cal.com's free plan supports 1 user with
unlimited bookings. Combined, these two give a complete revenue path with
~1 day of work. See [Whitepaper §3, Option B](./docs/WHITEPAPER.md#опция-б--stripe-payment-links--checkout-page-леко-собствено-решение).

### Post-Launch Phase 2 — Growth & Automation _(target: month 2–3)_

> Goal: Non-technical event management + automated confirmations.

- [ ] **Airtable or Notion API** for event calendar — Denitsa adds/edits events
      in a spreadsheet; the site fetches them via public API. Replaces static
      data in `lib/content.ts` for events.
- [ ] **Zapier** automation — Stripe payment → add row to Airtable → send
      confirmation email (via Gmail or Resend free tier)
- [ ] **Email confirmations** — automated email on successful registration with
      event details and calendar invite attachment
- [ ] Migrate JSON data store to **Supabase** (Postgres) — needed before volume
      makes file-based storage unreliable
- [ ] Admin dashboard with **NextAuth** — protected view to list registrations,
      inquiries, and subscribers

**Rationale:** Airtable/Notion gives a non-technical admin a CMS-like interface
without building one. Zapier bridges Stripe → email without code. See
[Whitepaper §4](./docs/WHITEPAPER.md#4-опции-за-календар-на-събития).

### Post-Launch Phase 3 — Custom Platform _(target: month 4–6, when events are monthly+)_

> Goal: Full custom event system — no third-party ticketing dependency.

- [ ] **Custom events module** in the app — database-driven event list, seat
      capacity / availability tracking, Stripe Checkout Sessions via API
- [ ] **QR code tickets** — generate unique QR per registration, email
      automatically, scan at the door (simple mobile check-in page)
- [ ] **Admin panel** — create/edit events, view registrations, export attendee
      lists, check-in management
- [ ] **CMS for blog** — migrate from static content to Sanity or Payload for
      blog post management
- [ ] Replace Cal.com embed with native booking system (if volume justifies)

**Rationale:** Only worth the development investment when events run monthly or
more frequently. Until then, Stripe Payment Links + Cal.com + Airtable cover
the needs at a fraction of the cost. See
[Whitepaper §3, Option C](./docs/WHITEPAPER.md#опция-в--собствена-система-вградена-в-приложението-stripe-api--база-данни).

### Post-Launch Phase 4 — Enhancement Backlog

Features with no firm timeline — pick up as needed:

- [ ] Multi-event calendar with iCal export
- [ ] Video testimonials embeds
- [ ] PWA / offline support
- [ ] Additional languages (Russian, German)
- [ ] Ticket Tailor / Humanitix integration (if marketplace discoverability
      becomes valuable — see [Whitepaper §2.1](./docs/WHITEPAPER.md#21-международни-платформи-за-продажба-на-билети))

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Content delays from stakeholder | Medium | High | Use placeholder content; finalize in Phase 4 |
| Next.js 16 breaking changes | Medium | Medium | Read bundled docs before coding; test early |
| Domain/DNS issues at launch | Low | High | Configure by 1 Nov, leaving 9-day buffer |
| JSON store concurrency | Low | Low | Acceptable for launch volume; migrate post-launch |
| Scope creep | Medium | High | Strict phase boundaries; backlog non-essentials |

---

## Summary Timeline

```
Aug 29 ─────── Sep 12 ─────── Oct 3 ─────── Oct 24 ─────── Nov 10
  │   Phase 1   │   Phase 2   │   Phase 3  │   Phase 4   │
  │  Foundation │  Core Pages │  Forms/API │  Polish     │  🚀 LAUNCH
  ▼             ▼             ▼             ▼             ▼
  Start        M1            M2            M3            10.11.2026
```
