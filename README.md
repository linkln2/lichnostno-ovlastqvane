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
| **Event registration** | Form-based registration saved to a local JSON store (no payments yet) |
| **Bilingual content** | Full Bulgarian + English support with a language toggle |
| **Newsletter & contact** | Lead-capture forms for newsletter sign-ups and general inquiries |

The site is content-driven and designed to be easy to maintain, with placeholder content based on publicly available information from the initiative's Facebook presence.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Fonts | `next/font` (Geist) |
| Hosting | [Netlify](https://www.netlify.com) (OpenNext adapter, auto-detected) |
| Data store | Local JSON file (`data/registrations.json`) — see [Roadmap](./ROADMAP.md) for upgrade plan |

> **Note on Next.js 16:** This version introduces breaking changes versus earlier releases. Before writing framework code, consult the bundled guides in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Project Structure

```
webapp/
├── app/                    # Next.js App Router (pages, layouts, routes)
│   ├── layout.tsx          # Root layout (fonts, metadata, shell)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + Tailwind directives
│   └── favicon.ico
├── lib/
│   └── i18n.ts             # Translation dictionary + helpers (BG / EN)
├── data/                   # Local JSON data store (registrations, etc.)
├── public/                 # Static assets (logo, images)
├── docs/                   # Project documentation
├── AGENTS.md               # AI-agent rules (Next.js 16 guidance)
├── CLAUDE.md               # Agent rules pointer
├── CONTRIBUTING.md         # Contribution guidelines
├── ROADMAP.md              # Project roadmap & launch countdown
├── netlify.toml            # Netlify build configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS / Tailwind configuration
└── package.json            # Dependencies & scripts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **20+**
- npm (bundled with Node.js)

### Install & run

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm run dev
```

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

The app is bilingual — **Bulgarian (bg)** is the default locale, with **English (en)** available via a toggle. All UI strings live in a single dictionary at [`lib/i18n.ts`](./lib/i18n.ts).

See [`docs/I18N.md`](./docs/I18N.md) for the full guide on adding and using translations.

## Environment Variables

No environment variables are required for local development. Production secrets (email service, analytics, etc.) will be added as the project grows — see the [Roadmap](./ROADMAP.md).

## Deployment

The app is configured for **Netlify** via [`netlify.toml`](./netlify.toml). Next.js 16 is auto-detected by Netlify's OpenNext adapter — no plugin configuration is needed.

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for the complete deployment guide.

## Documentation

| Document | Description |
| --- | --- |
| [ROADMAP.md](./ROADMAP.md) | Phased project plan with launch countdown to **10.11.2026** |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Architecture, tech decisions, and code conventions |
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
