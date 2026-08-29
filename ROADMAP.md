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

## Post-Launch (Backlog)

Items intentionally deferred until after the 10.11.2026 launch:

- [ ] Online payments for paid events (Stripe integration)
- [ ] Migrate JSON data store to a database (Supabase / Postgres)
- [ ] Admin dashboard with auth (NextAuth)
- [ ] Email automation for registrations (Resend / SendGrid)
- [ ] CMS for blog content (Sanity / Payload)
- [ ] Multi-event calendar with iCal export
- [ ] Video testimonials embeds
- [ ] PWA / offline support
- [ ] Additional languages (Russian, German)

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
