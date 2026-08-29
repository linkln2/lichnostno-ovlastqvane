# Architecture

Technical architecture and code conventions for the **Личностно овластяване** web app.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser (Client)               │
│   React 19 components · Tailwind CSS 4 · i18n    │
└───────────────────────┬─────────────────────────┘
                        │  HTTP / SSR / RSC
┌───────────────────────▼─────────────────────────┐
│              Next.js 16 (App Router)             │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │  Pages   │  │  Layouts  │  │  API Routes  │  │
│  │ (RSC)    │  │  (Root)   │  │  (/api/*)    │  │
│  └──────────┘  └───────────┘  └──────┬───────┘  │
└──────────────────────────────────────┼──────────┘
                                       │
                          ┌────────────▼────────────┐
                          │   Local JSON Data Store  │
                          │  data/registrations.json │
                          │  data/inquiries.json     │
                          │  data/subscribers.json   │
                          └─────────────────────────┘
```

The app is a **single Next.js application** using the App Router. Pages are React Server Components (RSC) by default, with client components used only where interactivity is required (forms, language toggle, countdown timer).

---

## Tech Stack Details

### Next.js 16 (App Router)

> ⚠️ **Next.js 16 has breaking changes.** Always consult `node_modules/next/dist/docs/` before writing framework code. See `AGENTS.md`.

Key conventions used:
- **File-based routing** via `app/` directory
- **React Server Components (RSC)** as the default rendering model
- **Route handlers** (`app/api/*/route.ts`) for API endpoints
- **Metadata API** for SEO (`export const metadata` in layouts/pages)
- **`next/font`** for optimized font loading (Geist Sans + Geist Mono)

### React 19

- Server Components for static and data-fetching UI
- Client Components (`"use client"`) for interactive elements only
- No need for `Suspense` boundaries unless streaming dynamic data

### Tailwind CSS 4

- Configuration via `postcss.config.mjs` (no `tailwind.config.js` needed in v4)
- Global directives in `app/globals.css`
- Design tokens defined with CSS custom properties
- Utility-first approach — avoid custom CSS unless necessary

### TypeScript 5

- Strict mode enabled (see `tsconfig.json`)
- Path alias `@/*` maps to project root
- Shared types in `lib/` (e.g., `Locale` type in `i18n.ts`)

---

## Directory Layout

```
app/
├── layout.tsx              # Root layout — fonts, metadata, <html>, body shell
├── page.tsx                # Home page (/)
├── globals.css             # Tailwind imports + global styles + design tokens
├── about/page.tsx          # /about
├── services/page.tsx       # /services
├── events/
│   ├── page.tsx            # /events — list of upcoming + past events
│   └── [slug]/page.tsx     # /events/[slug] — event detail + registration
├── testimonials/page.tsx   # /testimonials
├── blog/
│   ├── page.tsx            # /blog — article list
│   └── [slug]/page.tsx     # /blog/[slug] — individual article
├── contact/page.tsx        # /contact
├── api/
│   ├── register/route.ts   # POST — event registration
│   ├── contact/route.ts    # POST — contact form
│   └── newsletter/route.ts # POST — newsletter signup
├── sitemap.ts              # Dynamic sitemap
├── robots.ts               # Robots.txt
└── not-found.tsx           # Custom 404 (bilingual)

lib/
├── i18n.ts                 # Locale types, translation dictionary, tr() helper
└── (future: data.ts, validation.ts, etc.)

data/
├── registrations.json      # Event registrations
├── inquiries.json          # Contact form submissions
└── subscribers.json        # Newsletter subscribers

public/
├── logo.png                # Brand logo
└── (og images, icons, etc.)
```

---

## Data Layer

At launch, the app uses a **file-based JSON store** in `data/`. This is intentionally simple — suitable for the expected launch volume.

### Write pattern (API routes)

```typescript
// Pseudocode — actual implementation in Phase 3
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "registrations.json");

async function appendRecord(record: Registration) {
  const raw = await fs.readFile(filePath, "utf-8").catch(() => "[]");
  const records = JSON.parse(raw);
  records.push({ ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  await fs.writeFile(filePath, JSON.stringify(records, null, 2));
}
```

### Why not a database now?

- Launch volume is low (seminars, not mass-market)
- No payments yet — no transactional integrity needed
- Keeps deployment simple (no DB provisioning on Netlify)
- **Post-launch migration to Supabase/Postgres is on the backlog** (see [ROADMAP.md](../ROADMAP.md))

### Concurrency note

JSON file writes are not atomic. For the launch volume this is acceptable. If concurrent writes become an issue before the DB migration, a simple file-lock or queue can be added.

---

## Rendering Strategy

| Page | Rendering | Reason |
| --- | --- | --- |
| Home, About, Services | Static (RSC) | Content is mostly static |
| Events list | Dynamic (RSC) | Needs current date filtering |
| Event detail | Dynamic (RSC) | Per-event data |
| Blog list / post | Static (RSC) | Content updates infrequently |
| Contact | Static + Client form | Form needs client interactivity |
| Registration | Static + Client form | Form needs client interactivity |
| API routes | Server | Data writes |

---

## Code Conventions

### File naming
- Pages and layouts: `page.tsx`, `layout.tsx` (Next.js convention)
- Components: `PascalCase.tsx` (e.g., `EventCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- API routes: `route.ts` inside route folder

### Component structure
- Default to Server Components; add `"use client"` only when needed
- Keep components small and focused
- Co-locate types with their implementation

### Styling
- Tailwind utility classes in JSX — no separate CSS files per component
- Shared design tokens in `globals.css` via CSS custom properties
- Responsive: mobile-first (`sm:`, `md:`, `lg:` prefixes)

### Imports
- Use `@/*` path alias for project-internal imports
- Group imports: external → internal → relative

### Error handling
- API routes return appropriate HTTP status codes
- User-facing errors use i18n strings (`form_error`, etc.)
- Avoid try/catch on every line — handle at boundaries

---

## Security Considerations

- **Input validation** on all API routes (server-side, always)
- **Honeypot field** on forms for basic spam protection
- **No secrets in code** — use environment variables for any future API keys
- **Rate limiting** to be added before scaling (post-launch)
- **CORS** — default Next.js behavior is sufficient for same-origin API calls
- **Data privacy** — registrations contain PII (name, email, phone); the JSON store must not be publicly accessible (configure in `netlify.toml` or migrate to DB)

---

## Performance Budget

| Metric | Target |
| --- | --- |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| INP (Interaction to Next Paint) | < 200ms |
| Bundle size (JS) | < 200 KB gzipped |
| Images | `next/image` with proper sizing |

---

## Future Architecture Evolution

Based on the market research in [`WHITEPAPER.md`](./WHITEPAPER.md), the
post-launch evolution follows a phased approach — starting with low-cost
third-party tools and building custom systems only when volume justifies it.

```
Launch (now)              Post-Launch P1           Post-Launch P2           Post-Launch P3
─────────────             ─────────────────         ─────────────────         ─────────────────
JSON files                Stripe Payment Links      Supabase (Postgres)       Custom events module
No payments          ──→  Cal.com (1:1 booking) ──→ Airtable/Notion API  ──→  Stripe Checkout API
No auth                   (no backend needed)       Zapier (email auto)       QR tickets + admin
No email                                            NextAuth (admin)          Sanity/Payload CMS
Static events                                       Resend (email)            Native booking system
```

### Key decisions (from white paper)

| Area | Launch | Post-Launch P1 | Post-Launch P2 | Post-Launch P3 |
| --- | --- | --- | --- | --- |
| **Payments** | Free registration form | Stripe Payment Links (zero code) | — | Stripe Checkout API (custom) |
| **1:1 booking** | Contact form | Cal.com embed (free plan) | — | Native booking system |
| **Event data** | Static (`lib/content.ts`) | — | Airtable/Notion API | Database (Supabase) |
| **Email** | None | — | Zapier + Gmail/Resend | Resend (transactional) |
| **Auth** | None | — | NextAuth (admin view) | Full admin panel |
| **Blog** | Static content | — | — | Sanity / Payload CMS |

> **Why phased?** Stripe Payment Links require zero development (just a URL per
> event). Cal.com's free plan covers 1:1 bookings without backend work.
> Airtable/Notion gives a non-technical admin a CMS without building one. The
> custom platform (Phase 3) is only worth building when events run monthly+ and
> the volume justifies the development investment. See
> [`WHITEPAPER.md`](./WHITEPAPER.md) for the full market research and pricing
> comparison.
