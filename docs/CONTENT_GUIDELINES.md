# Content Guidelines

Strategy and standards for bilingual content on the **Личностно овластяване** web app.

---

## Bilingual Approach

The site is **fully bilingual** — every piece of user-facing content exists in both:

| Code | Language | Role |
| --- | --- | --- |
| `bg` | Bulgarian (Български) | **Default locale** — primary audience |
| `en` | English | Secondary — for international visitors |

### Rules

1. **No monolingual content.** Every string, heading, button, and page must have both BG and EN versions.
2. **Bulgarian is the source of truth.** Content is originally written in Bulgarian, then translated to English.
3. **Translations are idiomatic, not literal.** Translate meaning and tone, not word-for-word.
4. **UI strings live in `lib/i18n.ts`.** Page-level content strings are added to the `t` dictionary with descriptive keys.
5. **Long-form content** (blog posts, event descriptions) may be stored as structured data with `bg` and `en` fields.

---

## Tone of Voice

### Bulgarian
- **Топъл и директен** — warm but direct
- **Авторитетен, но не патерналистки** — authoritative without being paternalistic
- **Емпowered tone** — speaks to the reader as someone capable of change
- Uses "ти" (informal singular), not "Вие" — creates closeness and trust
- Avoids corporate jargon and clinical language

### English
- **Warm and direct** — mirrors the Bulgarian tone
- **Empowering** — the reader is an active participant, not a patient
- Uses "you" (second person) directly
- Avoids therapy-speak and self-help clichés

### What to avoid
- ❌ Clinical / medical terminology ("лечение", "терапия" as primary framing)
- ❌ Overly mystical language without context ("космически енергии")
- ❌ Aggressive sales pressure ("КУПИ СЕГА!", "LIMITED OFFER!")
- ❌ Generic marketing filler ("световен клас", "иновативен подход")

### What to embrace
- ✅ Personal empowerment language ("овластяване", "вътрешен авторитет")
- ✅ Concrete practices (Theta healing, family constellations, Akasha field work)
- ✅ Authentic voice of Denitsa Vladimirova
- ✅ Community and shared experience framing

---

## Content Map

| Page | Content needed (BG + EN) |
| --- | --- |
| **Home** | Hero headline, mission statement, next-event teaser, 3-step "how it works", testimonial previews, CTA |
| **About** | Organization story, mission (full), values (3–5), team bio for Denitsa Vladimirova |
| **Services** | 3–6 service cards: title, description, duration, format, price range |
| **Events** | Event entries: title, date, location, description, price, capacity, image |
| **Testimonials** | 6–12 participant quotes: name, text, event attended, photo (optional) |
| **Blog** | Articles: title, excerpt, body, date, author, image |
| **Contact** | Contact info (email, phone, social), form labels, success message |

### Contact details (verified)

| Field | Value |
| --- | --- |
| Email | `elegiaood@gmail.com` |
| Phone | `087 944 7749` (intl: `+359 87 944 7749`) |
| Location | Бургас 8000, България / Burgas 8000, Bulgaria |
| Facebook | `https://www.facebook.com/profile.php?id=61562005563695` |
| Instagram | `@lichnostno_ovlastyavane` |
| TikTok | `@azraltar` |

---

## Key Content (From Public Sources)

### Mission statement
> **BG:** "Нашата мисия е да извадим разумите на хората от ръцете на културните инженери и да ги върнем обратно на техните собственици."
>
> **EN:** "Our mission is to take people's minds out of the hands of cultural engineers and return them to their rightful owners."

### Key person — Denitsa Vladimirova
- Certified Theta practitioner
- Constellator (family/systemic constellations)
- Works with the Akasha field
- Leads seminars and individual coaching sessions

### Services to document
| Service (BG) | Service (EN) | Description |
| --- | --- | --- |
| Theta изцеление | Theta Healing | Meditation-based energy healing technique |
| Фамилни констелации | Family Constellations | Systemic therapy approach revealing family dynamics |
| Работа с Акаша | Akasha Field Work | Accessing the Akashic records for insight |
| Индивидуален коучинг | Individual Coaching | One-on-one personal empowerment sessions |
| Семинари | Seminars | Group events on personal development topics |
| Групови сесии | Group Sessions | Facilitated group work and shared processing |

---

## Image Guidelines

- **Logo:** `public/logo.png` — use on header and footer
- **Hero image:** Authentic, warm, human — avoid stock-photo clichés
- **Event images:** Photos from actual events when available
- **Testimonial photos:** Optional, with explicit consent
- **Blog images:** Relevant to article content
- **OG images:** 1200×630px, branded with logo and title
- **Format:** Use `next/image` for all images; provide `width` and `height`
- **Alt text:** Always include descriptive `alt` in both languages contextually

---

## Content Workflow

```
1. Draft in Bulgarian (source of truth)
        │
2. Translate to English (idiomatic)
        │
3. Add to lib/i18n.ts or content data file
        │
4. Review with stakeholder (Denitsa)
        │
5. Publish
```

### For blog posts
1. Write the full article in Bulgarian
2. Translate to English
3. Store as structured content (future CMS or Markdown)
4. Add to the blog list with excerpt and metadata

---

## Placeholder Content Policy

During development (Phases 1–3), **placeholder content** is used:

- Based on publicly available information (Facebook page, public posts)
- Clearly marked in code comments as `// PLACEHOLDER`
- Must be replaced with final, stakeholder-approved content in **Phase 4** (before 10.11.2026 launch)
- No personal data or unverified claims in placeholder content

---

## SEO Content Notes

- Each page has a unique `<title>` and `<meta description>` in both languages
- Headings follow a logical H1 → H2 → H3 hierarchy
- Blog articles target relevant Bulgarian and English search terms
- Event pages include structured data (JSON-LD `Event` schema) — post-launch enhancement
