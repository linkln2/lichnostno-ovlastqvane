# Личностно овластяване · Personal Empowerment

Bilingual (Bulgarian / English) marketing and event-registration web app for **Личностно овластяване** — a personal-development initiative offering seminars, coaching, and events led by Denitsa Vladimirova.

> **Mission:** _"Нашата мисия е да извадим разумите на хората от ръцете на културните инженери и да ги върнем обратно на техните собственици."_
> _"Our mission is to take people's minds out of the hands of cultural engineers and return them to their rightful owners."_

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Internationalization (i18n)](#internationalization-i18n)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Roadmap & Launch Countdown](#roadmap--launch-countdown)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This web app serves as the public face of **Личностно овластяване**, providing:

| Area | Description |
| --- | --- |
| **Marketing pages** | Home, About, Services, Events, Testimonials, Blog, Contact |
| **Event registration** | Form-based registration (being migrated to Payload/Postgres) |
| **Bilingual content** | Full Bulgarian + English support with a language toggle |
| **Newsletter & contact** | Lead-capture forms for newsletter sign-ups and general inquiries |
| **Admin dashboard** | Coaching Studio dashboard at `/dashboard` — glassmorphism UI with revenue trend, orders, subscriber tiers, and upcoming events. Website tab supports 5-language editing (BG/EN/ES/IT/DE) with DeepL auto-translation |
| **CMS** | Payload CMS at `/admin` — manages blog, events, products, media, and staff auth (Postgres-backed) |

The site is content-driven and designed to be easy to maintain, with placeholder content based on publicly available information from the initiative's Facebook presence.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Fonts | `next/font` — Fraunces (serif), Inter (UI), JetBrains Mono (data) |
| CMS + Admin | [Payload CMS 3](https://payloadcms.com) (self-hosted, embedded in the app) |
| Database | [Postgres 16](https://www.postgresql.org) (via Payload's Postgres adapter, Docker Compose for dev) |
| Charts | [Recharts](https://recharts.org) (dashboard) |
| Icons | [lucide-react](https://lucide.dev) |
| Hosting | [Netlify](https://www.netlify.com) (OpenNext adapter, auto-detected) |

> **Note on Next.js 16:** This version introduces breaking changes versus earlier releases. Before writing framework code, consult the bundled guides in `node_modules/next/dist/docs/` (see `AGENTS.md`).
>
> **Architecture:** The data layer uses Payload CMS + Postgres (see [`docs/ARCHITECTURE_v2.md`](./docs/ARCHITECTURE_v2.md)). The app is split into three route groups, each with its own root layout: `(site)` for public pages, `(payload)` for the CMS admin, and `(dashboard)` for the Coaching Studio dashboard.

## Project Structure

```
webapp/
├── app/                        # Next.js App Router — route groups
│   ├── (site)/                 #   Public marketing site (own root layout)
│   │   ├── layout.tsx          #     html/body, Header/Footer/LocaleProvider
│   │   ├── page.tsx            #     Home page
│   │   ├── about|services|…    #     Marketing pages
│   │   └── not-found.tsx
│   ├── (payload)/              #   Payload CMS admin (own root layout)
│   │   ├── admin/              #     /admin — generated admin UI
│   │   ├── api/[…slug]/        #     Payload REST/GraphQL API
│   │   └── layout.tsx
│   ├── (dashboard)/            #   Coaching Studio dashboard (own root layout)
│   │   ├── layout.tsx          #     fonts + background blobs
│   │   └── dashboard/page.tsx  #     /dashboard
│   ├── api/                    #   App API routes (register, contact)
│   └── globals.css             #   Tailwind + design tokens + animations
├── components/
│   ├── ui/                     #   shadcn-style primitives (card, button, …)
│   ├── dashboard/              #   Dashboard components (GlassCard, charts, …)
│   └── Header|Footer|…         #   Site components
├── lib/
│   ├── i18n.ts                 #   Translation dictionary + helpers (BG / EN)
│   ├── content.ts              #   Static bilingual content (migrating to Payload)
│   ├── dashboard-data.ts       #   Typed mock data + shapes for the dashboard
│   └── utils.ts                #   cn() class merge helper
├── data/                       #   Legacy JSON store (being phased out)
├── docs/                       #   Project documentation
├── payload.config.ts           #   Payload CMS config (14 collections)
├── docker-compose.yml          #   Postgres for local dev
├── AGENTS.md                   #   AI-agent rules (Next.js 16 guidance)
├── ROADMAP.md                  #   Project roadmap & launch countdown
├── netlify.toml                #   Netlify build configuration
├── next.config.ts              #   Next.js config (withPayload)
└── package.json                #   Dependencies & scripts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **20+**
- npm (bundled with Node.js)
- [Docker](https://www.docker.com) (for local Postgres via `docker-compose.yml`)

### Install & run

```bash
# Start local Postgres
docker compose up -d

# Install dependencies
npm install

# Start the dev server (http://localhost:3001 if 3000 is taken)
npm run dev
```

| Surface | URL | Description |
| --- | --- | --- |
| Public site | `/` | Marketing pages (BG/EN) |
| CMS admin | `/admin` | Payload admin UI (create first staff user on first visit) |
| Studio dashboard | `/dashboard` | Coaching dashboard (mock data) |

### Production build

```bash
npm run build
npm run start
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server (run after `build`) |

## Internationalization (i18n)

The **public site** is bilingual — **Bulgarian (bg)** is the default locale, with **English (en)** available via a toggle. All UI strings live in a single dictionary at [`lib/i18n.ts`](./lib/i18n.ts).

The **dashboard Website tab** supports **5 languages** (BG, EN, ES, IT, DE) with DeepL auto-translation from Bulgarian (requires `DEEPL_API_KEY`).

See [`docs/I18N.md`](./docs/I18N.md) for the full guide on adding and using translations.

## Environment Variables

Local dev requires a `.env` file (see `.env.example`) with:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | Postgres connection string for Payload |
| `PAYLOAD_SECRET` | Payload session/token signing secret |
| `NEXT_PUBLIC_SERVER_URL` | Public base URL of the app |

Production secrets (Stripe, Resend, analytics) will be added as commerce phases land — see the [Roadmap](./ROADMAP.md).

## Deployment

The app is configured for **Netlify** via [`netlify.toml`](./netlify.toml). Next.js 16 is auto-detected by Netlify's OpenNext adapter — no plugin configuration is needed.

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for the complete deployment guide.

## Documentation

| Document | Description |
| --- | --- |
| [ROADMAP.md](./ROADMAP.md) | Phased project plan with launch countdown to **10.11.2026** |
| [docs/ARCHITECTURE_v2.md](./docs/ARCHITECTURE_v2.md) | Current architecture: Payload CMS + Postgres + Stripe + Resend (replaces v1) |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Original v1 architecture (JSON store — superseded, kept for reference) |
| [docs/CONTENT_GUIDELINES.md](./docs/CONTENT_GUIDELINES.md) | Bilingual content strategy and tone of voice |
| [docs/I18N.md](./docs/I18N.md) | Internationalization system guide |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deployment & hosting guide |
| [docs/COUNTDOWN.md](./docs/COUNTDOWN.md) | Launch countdown tracker to **10 November 2026** |
| [docs/WHITEPAPER.md](./docs/WHITEPAPER.md) | Market research: ticketing, calendar, and booking options (BG) |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute to the project |

## Roadmap & Launch Countdown

The public launch is targeted for **10 November 2026 (10.11.2026)**.

- As of **29 August 2026**, there are **73 days** (10 weeks + 3 days) remaining.
- See [ROADMAP.md](./ROADMAP.md) for the full phased plan and [docs/COUNTDOWN.md](./docs/COUNTDOWN.md) for milestone tracking.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

All content and code in this repository is proprietary to **Личностно овластяване** unless otherwise stated. © 2026 Личностно овластяване. All rights reserved.
