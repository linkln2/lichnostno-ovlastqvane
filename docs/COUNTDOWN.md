# Launch Countdown Tracker

**Target launch date: 10 November 2026 (10.11.2026)**

---

## Countdown

| | |
| --- | --- |
| **Target date** | 10 November 2026 |
| **Roadmap start** | 29 August 2026 |
| **Total duration** | 73 days (10 weeks + 3 days) |
| **Current status** | 🟡 Phase 1 — Foundation & Layout |

> **Update this file weekly** with the current day count and phase status.

---

## Weekly Tracker

| Week | Dates | Phase | Focus | Status |
| --- | --- | --- | --- | --- |
| Week 1 | 29 Aug – 04 Sep | Phase 1 | Next.js 16 docs, root layout, nav, footer | ⬜ Not started |
| Week 2 | 05 Sep – 11 Sep | Phase 1 | Design tokens, locale state, UI primitives | ⬜ Not started |
| **M1** | **12 Sep** | — | **Milestone 1: Bilingual shell** | ⬜ |
| Week 3 | 12 Sep – 18 Sep | Phase 2 | Home page (hero, mission, how-it-works) | ⬜ Not started |
| Week 4 | 19 Sep – 25 Sep | Phase 2 | About, Services, Events pages | ⬜ Not started |
| Week 5 | 26 Sep – 02 Oct | Phase 2 | Testimonials, Blog, Contact pages | ⬜ Not started |
| **M2** | **03 Oct** | — | **Milestone 2: All marketing pages live** | ⬜ |
| Week 6 | 03 Oct – 09 Oct | Phase 3 | Registration API + form | ⬜ Not started |
| Week 7 | 10 Oct – 16 Oct | Phase 3 | Contact + newsletter APIs & forms | ⬜ Not started |
| Week 8 | 17 Oct – 23 Oct | Phase 3 | Validation, spam protection, admin view | ⬜ Not started |
| **M3** | **24 Oct** | — | **Milestone 3: All forms functional** | ⬜ |
| Week 9 | 25 Oct – 31 Oct | Phase 4 | SEO, accessibility, performance | ⬜ Not started |
| Week 10 | 01 Nov – 07 Nov | Phase 4 | Content finalization, domain setup, analytics | ⬜ Not started |
| Final | 08 Nov – 10 Nov | Phase 4 | Final review, soft launch, public launch | ⬜ Not started |
| **🚀** | **10 Nov 2026** | — | **PUBLIC LAUNCH** | ⬜ |

**Legend:** ⬜ Not started · 🟡 In progress · ✅ Complete · ⚠️ At risk · ❌ Blocked

---

## Days Remaining (Reference Points)

| Date | Days to Launch | Notes |
| --- | --- | --- |
| 29 Aug 2026 | **73 days** | Roadmap start |
| 05 Sep 2026 | 66 days | |
| 12 Sep 2026 | 59 days | **Milestone 1** |
| 19 Sep 2026 | 52 days | |
| 26 Sep 2026 | 45 days | Halfway to M2 |
| 03 Oct 2026 | 38 days | **Milestone 2** |
| 10 Oct 2026 | 31 days | 1 month to launch |
| 17 Oct 2026 | 24 days | |
| 24 Oct 2026 | 17 days | **Milestone 3** |
| 31 Oct 2026 | 10 days | Final stretch |
| 07 Nov 2026 | 3 days | Soft launch target |
| **10 Nov 2026** | **0** | **LAUNCH DAY** |

---

## Critical Path

The following tasks are on the critical path — any delay here delays the launch:

```
Next.js 16 docs review → Root layout → Nav + locale toggle
    → Home page → All marketing pages (M2)
        → Registration API → All forms (M3)
            → SEO + accessibility → Content finalization
                → Domain + DNS → Production deploy → LAUNCH
```

If any critical-path task slips, assess whether to:
1. **Descope** — move non-essentials to post-launch backlog
2. **Accelerate** — add focus time or parallelize
3. **Delay launch** — only as last resort; the 10.11.2026 date is symbolic

---

## Buffer Analysis

| Buffer | Amount | Purpose |
| --- | --- | --- |
| Domain setup buffer | 9 days (1 Nov → 10 Nov) | DNS propagation + fixes |
| Content finalization buffer | 3 days (7 Nov → 10 Nov) | Last-minute copy changes |
| Soft launch buffer | 3 days (7 Nov → 10 Nov) | Private feedback before public |
| Total contingency | ~5 days | Absorbs minor delays |

**If Phase 1–3 are on schedule**, the buffer is sufficient for a smooth launch.
**If Phase 3 (forms) slips past 24 Oct**, consider descoping the admin view or newsletter to post-launch.

---

## Countdown Component (Planned)

A live countdown timer will be displayed on the home page during the pre-launch period (Phase 4), showing time remaining until 10.11.2026.

### Implementation notes

```typescript
// Client component — needs "use client"
// Target: new Date("2026-11-10T00:00:00+02:00")  // Bulgarian timezone (EET, UTC+2)
// Display: days, hours, minutes, seconds
// Bilingual labels via tr()
// Remove/hide after launch date passes
```

The countdown serves as:
1. A **motivation tool** for the team (internal)
2. A **hype builder** for visitors (pre-launch teaser on home page)
3. A **visual anchor** for the "next event" or "launch" CTA

---

## Status Log

Record significant status changes here (most recent first):

| Date | Update | By |
| --- | --- | --- |
| 29 Aug 2026 | Roadmap created. 73 days to launch. Phase 1 starting. | — |
| | | |
