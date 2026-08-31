<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:mobile-first-design-rules -->

# Mobile-first design

All UI must be designed for mobile first and then enhanced for larger screens.

- Default Tailwind classes target the smallest breakpoint (0 px). Use `sm:`, `md:`, `lg:`, and `xl:` to add desktop-only enhancements.
- Every page and component must be usable on a 360 px–wide viewport without horizontal scrolling.
- Navigation must provide a mobile affordance (bottom tab bar, hamburger drawer, or off-canvas menu) on screens below `md`.
- Touch targets must be at least 44 × 44 px.
- Tables and charts should scroll horizontally inside a container rather than overflow the viewport.
- Test visually with a mobile device or browser DevTools mobile emulation before committing.

<!-- END:mobile-first-design-rules -->

<!-- BEGIN:project-conventions -->

# Project Conventions

## Build & Dev

- `npm run dev` — Turbopack dev server (port 3001 if 3000 is taken)
- `npm run build` — Production build (Turbopack)
- `npx tsc --noEmit` — Type check (run before committing)
- Deploy: `vercel --prod --yes` or push to `origin/main` (auto-deploy)

## Theme System

- `ThemeProvider` exposes `useTheme()` → `{ theme, toggleTheme, mounted }`
- Default: time-based (dark 19:00–06:00, light otherwise)
- Manual toggle saves to `localStorage` and overrides auto-switching
- All backgrounds must be **opaque in light mode** with `dark:` variants
- Never use semi-transparent backgrounds (`bg-white/85`) on pages with the fixed starfield — it causes low contrast

## Auth & Route Protection

- `proxy.ts` handles redirects: `/login` → `/membership`, `/dashboard` + `/inner-circle` + `/account` require auth
- `proxy.ts` runs on the Node.js runtime (not edge) and is for routing only — real auth checks use `payload.auth({ headers })`
- Shared auth helpers in `lib/auth-request.ts`: `getAuthUser`, `requireStaff`, `requireCustomer`
- Staff whitelist in `lib/auth.ts` — `requireStaff` checks both token validity AND whitelist
- Customer entitlements computed in `lib/entitlements.ts`
- Header fetches `/api/auth/me` + `/api/entitlements` to show/hide member features
- Dashboard layout calls `payload.auth({ headers })` server-side as a second gate beyond proxy

## Content

- Bilingual BG/EN via `lib/i18n.ts` (`tr()` helper) and `lib/content.ts` (structured content)
- Payload CMS collections are localized (bg default, en fallback)
- Static content in `lib/content.ts` is being migrated to Payload

<!-- END:project-conventions -->
