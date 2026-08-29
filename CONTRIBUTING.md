# Contributing

Thank you for your interest in contributing to **Личностно овластяване**! This document outlines how to work on the project effectively.

---

## Before You Start

1. **Read the docs:**
   - [README.md](./README.md) — project overview and setup
   - [ROADMAP.md](./ROADMAP.md) — current phase and priorities
   - [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — code conventions and structure
   - [docs/I18N.md](./docs/I18N.md) — how bilingual content works
   - [docs/CONTENT_GUIDELINES.md](./docs/CONTENT_GUIDELINES.md) — tone and content standards

2. **Check the roadmap** — work on tasks within the current phase. Don't jump ahead to backlog items.

3. **Read `AGENTS.md`** — Next.js 16 has breaking changes. Always consult `node_modules/next/dist/docs/` before writing framework code.

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/linkln2/lichnostno-ovlastqvane.git
cd lichnostno-ovlastqvane

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Git Workflow

### Branches

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready code; auto-deploys to Netlify |
| `feature/<name>` | New features (e.g., `feature/home-page`) |
| `fix/<name>` | Bug fixes (e.g., `fix/locale-toggle`) |
| `docs/<name>` | Documentation changes |

### Commit messages

Use clear, descriptive commit messages in the imperative mood:

```
Add event registration form component

- Create form with name, email, phone, city, package, notes fields
- Wire up to POST /api/register
- Add bilingual success/error states

Generated with [Devin](https://devin.ai)
```

### Pull requests

1. Create a feature branch from `main`
2. Make your changes — keep PRs focused (one feature/fix per PR)
3. Test locally: `npm run build` must pass
4. Verify both languages (BG + EN) work
5. Open a PR against `main` with a clear description
6. Netlify will generate a deploy preview — verify it works

---

## Code Standards

### TypeScript
- Strict mode is enabled — no `any` types without justification
- Use the shared `Locale` type from `lib/i18n.ts` for locale values
- Prefer type inference; add explicit types for function signatures and exports

### React / Next.js
- **Server Components by default** — only use `"use client"` when interactivity is required
- **No hardcoded strings** — all user-facing text goes through `tr(key, locale)`
- **Tailwind utility classes** — no custom CSS unless absolutely necessary
- **`next/image`** for all images — provide `width` and `height`
- **`next/font`** — don't import fonts directly; use the Geist setup in `layout.tsx`

### File organization
- Pages in `app/` following Next.js App Router conventions
- Shared components in `app/components/` (to be created)
- Utilities and types in `lib/`
- Static assets in `public/`
- Documentation in `docs/`

### Comments
- **Do not add or remove comments unless asked** (per project convention)
- If you find an existing comment was accidentally deleted, restore it
- Code should be self-documentating — use clear names over comments

---

## Bilingual Content Checklist

Every PR that adds or changes user-facing content must:

- [ ] Add strings to `lib/i18n.ts` with both `bg` and `en` values
- [ ] Use `tr(key, locale)` in components — no hardcoded text
- [ ] Verify Bulgarian is the source (written first, then translated)
- [ ] Ensure English is idiomatic, not literal
- [ ] Test both languages in the browser

---

## Testing

Currently there is no automated test suite. Before submitting a PR:

- [ ] `npm run build` passes without errors
- [ ] Dev server runs without console errors
- [ ] All pages load in both BG and EN
- [ ] Forms submit and show success/error states
- [ ] Mobile layout is responsive (test at 375px, 768px, 1024px widths)
- [ ] Navigation and language toggle work

---

## Review Process

1. **Self-review** your PR before requesting review
2. **Deploy preview** — check the Netlify preview URL
3. **Stakeholder review** — content changes may need approval from Denitsa
4. **Merge** — squash and merge into `main` once approved

---

## Reporting Issues

If you find a bug or have a feature request:

1. Check existing [GitHub Issues](https://github.com/linkln2/lichnostno-ovlastqvane/issues) to avoid duplicates
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Screenshots (if applicable)
   - Browser and device info

---

## Questions?

- **Technical:** Open a GitHub issue or discussion
- **Content:** Refer to [docs/CONTENT_GUIDELINES.md](./docs/CONTENT_GUIDELINES.md)
- **Roadmap/timeline:** Refer to [ROADMAP.md](./ROADMAP.md) and [docs/COUNTDOWN.md](./docs/COUNTDOWN.md)
