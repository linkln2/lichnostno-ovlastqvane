# Deployment Guide

How to deploy and host the **Личностно овластяване** web app.

---

## Hosting Platform

The app is deployed on **[Netlify](https://www.netlify.com)** using the **OpenNext adapter**, which is auto-detected for Next.js 16 projects.

### Configuration

The deployment is configured via [`netlify.toml`](../netlify.toml):

```toml
[build]
  command = "next build"
  publish = ".next"

# Next.js 16 is auto-detected by Netlify's OpenNext adapter.
# No plugin configuration needed — the adapter is applied automatically.
```

No additional plugin or adapter configuration is required — Netlify detects the Next.js version and applies the OpenNext adapter automatically.

---

## Prerequisites

1. A **Netlify** account
2. The GitHub repository connected: `linkln2/lichnostno-ovlastqvane`
3. Node.js 20+ available in the build environment (Netlify provides this)

---

## Deployment Methods

### Method 1 — Continuous Deployment (recommended)

1. **Connect the repo** to Netlify:
   - Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
   - Select GitHub → choose `linkln2/lichnostno-ovlastqvane`
   - Netlify auto-detects Next.js and reads `netlify.toml`

2. **Configure build settings** (auto-filled from `netlify.toml`):
   - Build command: `next build`
   - Publish directory: `.next`

3. **Deploy** — every push to `main` triggers a new deploy

4. **Deploy previews** — every pull request gets a unique preview URL for review

### Method 2 — Netlify CLI (manual)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (link to existing site or create new)
netlify init

# Deploy a preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## Environment Variables

No environment variables are required for the initial launch. When added, configure them in:

**Netlify UI:** Site settings → Environment variables

| Variable | Purpose | Phase |
| --- | --- | --- |
| `EMAIL_SERVICE_API_KEY` | Transactional email (Resend/SendGrid) | Post-launch |
| `ANALYTICS_ID` | Analytics tracking ID | Phase 4 |
| `ADMIN_PASSWORD` | Admin view protection | Phase 3 |

---

## Data Store Considerations

The app uses a **local JSON file store** in `data/`. On Netlify:

### ⚠️ Important: Ephemeral filesystem

Netlify's serverless functions have an **ephemeral filesystem** — files written at runtime do not persist across invocations and are not shared between instances.

### Solutions

| Approach | When | Notes |
| --- | --- | --- |
| **Git-based storage** (commit to repo) | Pre-launch testing only | Not suitable for production writes |
| **Netlify Blobs** | Launch (simple) | Key-value store, persists across deploys |
| **External DB (Supabase)** | Post-launch (recommended) | Full relational DB, see [ROADMAP.md](../ROADMAP.md) |

**Recommended for launch:** Use **Netlify Blobs** for the JSON data store, or migrate to **Supabase** before launch if time permits in Phase 3/4.

### Implementation note

The API routes in `app/api/*/route.ts` must use a storage backend that works in the serverless environment. Abstract the data layer behind an interface so the backend can be swapped without changing route logic:

```typescript
// lib/store.ts (to be created)
interface DataStore {
  appendRegistration(record: Registration): Promise<void>;
  appendInquiry(record: Inquiry): Promise<void>;
  appendSubscriber(record: Subscriber): Promise<void>;
}

// Implementations: JsonFileStore (dev), NetlifyBlobStore (prod), SupabaseStore (future)
```

---

## Custom Domain

To configure the official domain (e.g., `lichnostno-ovlastqvane.bg`):

1. **Add domain in Netlify:** Site settings → Domain management → Add custom domain
2. **Update DNS records** at your domain registrar:
   - **A record** → Netlify's load balancer IP (provided by Netlify)
   - **CNAME record** → `[site-name].netlify.app` (for `www` subdomain)
3. **Enable HTTPS** — Netlify provides free SSL via Let's Encrypt (automatic)
4. **Configure redirects** if needed (e.g., `www` → apex or vice versa)

### Timeline

Per the [Roadmap](../ROADMAP.md), domain configuration should be complete by **1 November 2026** — leaving a 9-day buffer before the **10 November 2026** launch.

---

## Build & Deploy Checklist

Use this checklist before each production deploy:

### Pre-deploy
- [ ] All tests pass locally
- [ ] `npm run build` succeeds without errors
- [ ] No console errors in dev mode
- [ ] Both languages (BG/EN) render correctly
- [ ] Forms submit and save data correctly
- [ ] Mobile responsiveness verified
- [ ] No hardcoded secrets in code

### Post-deploy
- [ ] Site loads at the production URL
- [ ] Language toggle works
- [ ] All pages accessible (no 404s on core routes)
- [ ] Forms work end-to-end on production
- [ ] SSL/HTTPS active
- [ ] Analytics tracking confirmed (if enabled)
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible

---

## Rollback

Netlify keeps a history of all deploys. To rollback:

1. Go to Site → Deploys in the Netlify UI
2. Find the last known-good deploy
3. Click "Publish" → "Publish deploy"

This makes the previous deploy the active production version instantly.

---

## Monitoring

| Tool | Purpose | When |
| --- | --- | --- |
| Netlify deploy logs | Build errors & warnings | Every deploy |
| Netlify Functions logs | API route errors | On-demand |
| Browser console | Client-side errors | Manual testing |
| Analytics (Plausible/GA4) | Traffic & user behavior | Post-launch (Phase 4) |
| Uptime monitoring | Site availability | Post-launch |

---

## Performance on Netlify

- **Edge caching** — static assets are cached at the CDN edge automatically
- **Image optimization** — `next/image` works with OpenNext on Netlify
- **Serverless functions** — API routes run as serverless functions (cold starts possible)
- **Build timeout** — Netlify Pro allows up to 45 min builds (Free: 15 min)
