"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { GlassCard } from "./GlassCard";
import { Field, inputClass, textareaClass } from "./Modal";
import { cn } from "@/lib/utils";
import { Save, Eye, EyeOff, ChevronDown, ChevronUp, LayoutTemplate, Sparkles, Blocks, ListTree } from "lucide-react";
import {
  useDashboardLang,
  type DashboardLocale,
  dashboardLocaleNames,
} from "./lang-context";

// ─── Types ───────────────────────────────────────────────────────

type Multilingual = Partial<Record<DashboardLocale, string>>;

const LangContext = createContext<DashboardLocale>("bg");

const dashboardLocales: DashboardLocale[] = ["bg", "en", "es", "it", "de"];

type HomepageData = {
  hero: {
    title: Multilingual;
    subtitle: Multilingual;
    primaryCtaText: Multilingual;
    primaryCtaHref: string;
    secondaryCtaText: Multilingual;
    secondaryCtaHref: string;
    showCountdown: boolean;
    showVideoFeed: boolean;
  };
  mission: {
    title: Multilingual;
    text: Multilingual;
    enabled: boolean;
  };
  values: {
    title: Multilingual;
    enabled: boolean;
    cards: { title: Multilingual; description: Multilingual }[];
  };
  symbolism: {
    title: Multilingual;
    enabled: boolean;
    cards: { title: Multilingual; description: Multilingual }[];
  };
  productsSection: {
    enabled: boolean;
    heading: Multilingual;
    maxItems: number;
  };
  membershipSection: {
    enabled: boolean;
    heading: Multilingual;
    description: Multilingual;
  };
  testimonialsSection: {
    enabled: boolean;
    heading: Multilingual;
  };
  videoSection: {
    enabled: boolean;
    heading: Multilingual;
  };
  blogSection: {
    enabled: boolean;
    heading: Multilingual;
    maxItems: number;
  };
};

type SubTab = "hero" | "story" | "sections";

const SUB_TABS: { key: SubTab; label: string; icon: typeof Sparkles; sections: string[] }[] = [
  { key: "hero", label: "Hero", icon: Sparkles, sections: ["hero"] },
  { key: "story", label: "Story", icon: ListTree, sections: ["mission", "values", "symbolism"] },
  { key: "sections", label: "Sections", icon: Blocks, sections: ["productsSection", "membershipSection", "testimonialsSection", "videoSection", "blogSection"] },
];

// ─── Bilingual field ─────────────────────────────────────────────

function BiField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: Multilingual;
  onChange: (val: Multilingual) => void;
  type?: "text" | "textarea";
  placeholder?: string;
}) {
  const lang = useContext(LangContext);

  return (
    <div className="space-y-1.5">
      <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
          {dashboardLocaleNames[lang]}
        </span>
      </label>
      {type === "textarea" ? (
        <textarea
          value={value[lang] || ""}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
          className={cn(textareaClass, "min-h-[80px]")}
          rows={3}
          placeholder={placeholder || dashboardLocaleNames[lang]}
        />
      ) : (
        <input
          type="text"
          value={value[lang] || ""}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
          className={inputClass}
          placeholder={placeholder || dashboardLocaleNames[lang]}
        />
      )}
    </div>
  );
}

// ─── Section wrapper with collapse and visibility toggle ───────

function SectionCard({
  id,
  title,
  enabled,
  onToggle,
  children,
  defaultOpen = true,
}: {
  id: string;
  title: string;
  enabled?: boolean;
  onToggle?: (val: boolean) => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <GlassCard className="overflow-hidden scroll-mt-36" id={id}>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white"
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {title}
          {enabled === false && (
            <span className="ml-2 rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-500 dark:bg-stone-700 dark:text-stone-400">
              Hidden
            </span>
          )}
        </button>
        {onToggle !== undefined && (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={enabled ?? false}
              onChange={(e) => onToggle(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300"
            />
            {enabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </label>
        )}
      </div>
      {open && <div className="p-5">{children}</div>}
    </GlassCard>
  );
}

// ─── Main Website Tab ────────────────────────────────────────────

export function WebsiteTab() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { lang, registerTranslate } = useDashboardLang();
  const [subTab, setSubTab] = useState<SubTab>("hero");

  const fetchHomepage = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/homepage", { credentials: "include" });
      const json = await res.json();
      if (json.data) {
        setData(json.data);
      } else {
        setData({
          hero: {
            title: { bg: "", en: "" },
            subtitle: { bg: "", en: "" },
            primaryCtaText: { bg: "Разгледай", en: "Explore" },
            primaryCtaHref: "/shop",
            secondaryCtaText: { bg: "Научи повече", en: "Learn more" },
            secondaryCtaHref: "/about",
            showCountdown: true,
            showVideoFeed: true,
          },
          mission: { title: { bg: "Мисия", en: "Mission" }, text: { bg: "", en: "" }, enabled: true },
          values: { title: { bg: "Ценности", en: "Values" }, enabled: true, cards: [] },
          symbolism: { title: { bg: "Символизъм", en: "Symbolism" }, enabled: true, cards: [] },
          productsSection: { enabled: true, heading: { bg: "Магазин", en: "Shop" }, maxItems: 8 },
          membershipSection: { enabled: true, heading: { bg: "Членство", en: "Membership" }, description: { bg: "", en: "" } },
          testimonialsSection: { enabled: true, heading: { bg: "Отзиви", en: "Testimonials" } },
          videoSection: { enabled: true, heading: { bg: "Видео", en: "Videos" } },
          blogSection: { enabled: true, heading: { bg: "Последни статии", en: "Recent posts" }, maxItems: 3 },
        });
      }
    } catch {
      setError("Failed to load homepage settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepage();
  }, [fetchHomepage]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/dashboard/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof HomepageData>(
    key: K,
    patch: Partial<HomepageData[K]>,
  ) {
    setData((prev) => (prev ? { ...prev, [key]: { ...prev[key], ...patch } } : prev));
  }

  function isMultilingual(value: unknown): value is Multilingual {
    if (typeof value !== "object" || value === null) return false;
    const obj = value as Multilingual;
    return dashboardLocales.some((l) => typeof obj[l] === "string");
  }

  function collectBiLeaves(obj: unknown, leaves: Multilingual[] = []): Multilingual[] {
    if (isMultilingual(obj)) {
      leaves.push(obj);
      return leaves;
    }
    if (Array.isArray(obj)) {
      for (const item of obj) collectBiLeaves(item, leaves);
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj as object)) {
        collectBiLeaves((obj as Record<string, unknown>)[key], leaves);
      }
    }
    return leaves;
  }

  async function translateAll() {
    if (!data) return;
    setError(null);
    try {
      if (lang === "bg") return;
      const sourceLang = "BG";
      const targetLang = lang === "en" ? "EN" : lang === "es" ? "ES" : lang === "it" ? "IT" : "DE";
      const leaves = collectBiLeaves(data);
      const toTranslate = leaves.filter((l) => l.bg && l.bg.trim() !== "");
      if (toTranslate.length === 0) return;
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          texts: toTranslate.map((l) => l.bg as string),
          sourceLang,
          targetLang,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Translation failed");
      toTranslate.forEach((leaf, i) => {
        leaf[lang] = json.translations[i];
      });
      setData((prev) => (prev ? JSON.parse(JSON.stringify(prev)) : prev));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    }
  }

  // Register translate function with the shared lang context
  useEffect(() => {
    registerTranslate(translateAll);
  }, [registerTranslate, data, lang]);

  if (loading) {
    return (
      <GlassCard className="p-12">
        <div className="text-center text-zinc-500">Loading homepage settings…</div>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard className="p-12">
        <div className="text-center text-zinc-500">Failed to load settings</div>
      </GlassCard>
    );
  }

  return (
    <LangContext.Provider value={lang}>
      <div className="space-y-5">
        {/* Top bar */}
        <div className="sticky top-0 z-30 -mx-6 border-b border-white/60 bg-white/80 px-6 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 md:-mx-8 md:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <LayoutTemplate size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Website</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Edit homepage content. Changes go live after saving.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {saved && (
                <span className="text-sm text-green-600 dark:text-green-400">✓ Saved</span>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1.5 rounded-xl border border-white/60 bg-white/50 p-1 backdrop-blur dark:border-white/10 dark:bg-white/5">
          {SUB_TABS.map((t) => {
            const Icon = t.icon;
            const active = subTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSubTab(t.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-zinc-600 hover:bg-white/60 dark:text-zinc-300 dark:hover:bg-white/5"
                )}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* ─── Hero tab ─── */}
        {subTab === "hero" && (
          <SectionCard id="section-hero" title="Hero" defaultOpen>
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <BiField label="Headline" value={data.hero.title} onChange={(v) => update("hero", { title: v })} />
                <BiField label="Subtitle" value={data.hero.subtitle} onChange={(v) => update("hero", { subtitle: v })} type="textarea" />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <BiField label="Primary button text" value={data.hero.primaryCtaText} onChange={(v) => update("hero", { primaryCtaText: v })} />
                <Field label="Primary button link">
                  <input
                    type="text"
                    value={data.hero.primaryCtaHref}
                    onChange={(e) => update("hero", { primaryCtaHref: e.target.value })}
                    className={inputClass}
                    placeholder="/shop"
                  />
                </Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <BiField label="Secondary button text" value={data.hero.secondaryCtaText} onChange={(v) => update("hero", { secondaryCtaText: v })} />
                <Field label="Secondary button link">
                  <input
                    type="text"
                    value={data.hero.secondaryCtaHref}
                    onChange={(e) => update("hero", { secondaryCtaHref: e.target.value })}
                    className={inputClass}
                    placeholder="/about"
                  />
                </Field>
              </div>
              <div className="flex flex-wrap gap-6 border-t border-white/10 pt-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={data.hero.showCountdown}
                    onChange={(e) => update("hero", { showCountdown: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  Show launch countdown
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={data.hero.showVideoFeed}
                    onChange={(e) => update("hero", { showVideoFeed: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  Show video feed
                </label>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ─── Story tab ─── */}
        {subTab === "story" && (
          <div className="space-y-5">
            {/* Mission — full width */}
            <SectionCard
              id="section-mission"
              title="Mission"
              enabled={data.mission.enabled}
              onToggle={(v) => update("mission", { enabled: v })}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <BiField label="Section title" value={data.mission.title} onChange={(v) => update("mission", { title: v })} />
                <BiField label="Mission text" value={data.mission.text} onChange={(v) => update("mission", { text: v })} type="textarea" />
              </div>
            </SectionCard>

            {/* Values + Symbolism — side by side on large screens */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Values */}
              <SectionCard
                id="section-values"
                title="Values"
                enabled={data.values.enabled}
                onToggle={(v) => update("values", { enabled: v })}
              >
                <div className="space-y-4">
                  <BiField label="Section title" value={data.values.title} onChange={(v) => update("values", { title: v })} />
                  {data.values.cards.map((card, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-white/40 p-4 dark:bg-white/5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500">Card {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cards = [...data.values.cards];
                            cards.splice(i, 1);
                            update("values", { cards });
                          }}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <BiField label="Title" value={card.title} onChange={(v) => {
                          const cards = [...data.values.cards];
                          cards[i] = { ...cards[i], title: v };
                          update("values", { cards });
                        }} />
                        <BiField label="Description" value={card.description} onChange={(v) => {
                          const cards = [...data.values.cards];
                          cards[i] = { ...cards[i], description: v };
                          update("values", { cards });
                        }} type="textarea" />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update("values", { cards: [...data.values.cards, { title: { bg: "", en: "", es: "", it: "", de: "" }, description: { bg: "", en: "", es: "", it: "", de: "" } }] })}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    + Add value card
                  </button>
                </div>
              </SectionCard>

              {/* Symbolism */}
              <SectionCard
                id="section-symbolism"
                title="Symbolism"
                enabled={data.symbolism.enabled}
                onToggle={(v) => update("symbolism", { enabled: v })}
              >
                <div className="space-y-4">
                  <BiField label="Section title" value={data.symbolism.title} onChange={(v) => update("symbolism", { title: v })} />
                  {data.symbolism.cards.map((card, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-white/40 p-4 dark:bg-white/5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-500">Card {i + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cards = [...data.symbolism.cards];
                            cards.splice(i, 1);
                            update("symbolism", { cards });
                          }}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <BiField label="Title" value={card.title} onChange={(v) => {
                          const cards = [...data.symbolism.cards];
                          cards[i] = { ...cards[i], title: v };
                          update("symbolism", { cards });
                        }} />
                        <BiField label="Description" value={card.description} onChange={(v) => {
                          const cards = [...data.symbolism.cards];
                          cards[i] = { ...cards[i], description: v };
                          update("symbolism", { cards });
                        }} type="textarea" />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update("symbolism", { cards: [...data.symbolism.cards, { title: { bg: "", en: "", es: "", it: "", de: "" }, description: { bg: "", en: "", es: "", it: "", de: "" } }] })}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    + Add symbolism card
                  </button>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {/* ─── Sections tab ─── */}
        {subTab === "sections" && (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Featured Products */}
            <SectionCard
              id="section-productsSection"
              title="Featured Products"
              enabled={data.productsSection.enabled}
              onToggle={(v) => update("productsSection", { enabled: v })}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <BiField label="Heading" value={data.productsSection.heading} onChange={(v) => update("productsSection", { heading: v })} />
                <Field label="Max items to show">
                  <input
                    type="number"
                    value={data.productsSection.maxItems}
                    onChange={(e) => update("productsSection", { maxItems: parseInt(e.target.value) || 8 })}
                    className={inputClass}
                    min={1}
                    max={20}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* Membership */}
            <SectionCard
              id="section-membershipSection"
              title="Membership"
              enabled={data.membershipSection.enabled}
              onToggle={(v) => update("membershipSection", { enabled: v })}
            >
              <div className="space-y-4">
                <BiField label="Heading" value={data.membershipSection.heading} onChange={(v) => update("membershipSection", { heading: v })} />
                <BiField label="Description" value={data.membershipSection.description} onChange={(v) => update("membershipSection", { description: v })} type="textarea" />
              </div>
            </SectionCard>

            {/* Testimonials */}
            <SectionCard
              id="section-testimonialsSection"
              title="Testimonials"
              enabled={data.testimonialsSection.enabled}
              onToggle={(v) => update("testimonialsSection", { enabled: v })}
            >
              <BiField label="Heading" value={data.testimonialsSection.heading} onChange={(v) => update("testimonialsSection", { heading: v })} />
            </SectionCard>

            {/* Video Feed */}
            <SectionCard
              id="section-videoSection"
              title="Video Feed"
              enabled={data.videoSection.enabled}
              onToggle={(v) => update("videoSection", { enabled: v })}
            >
              <BiField label="Heading" value={data.videoSection.heading} onChange={(v) => update("videoSection", { heading: v })} />
            </SectionCard>

            {/* Blog */}
            <SectionCard
              id="section-blogSection"
              title="Latest Articles"
              enabled={data.blogSection.enabled}
              onToggle={(v) => update("blogSection", { enabled: v })}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <BiField label="Heading" value={data.blogSection.heading} onChange={(v) => update("blogSection", { heading: v })} />
                <Field label="Max articles to show">
                  <input
                    type="number"
                    value={data.blogSection.maxItems}
                    onChange={(e) => update("blogSection", { maxItems: parseInt(e.target.value) || 3 })}
                    className={inputClass}
                    min={1}
                    max={10}
                  />
                </Field>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Bottom save bar */}
        <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-xl border border-white/10 bg-white/80 p-3 backdrop-blur-xl dark:bg-zinc-900/80">
          {error && <span className="text-sm text-red-500">{error}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </LangContext.Provider>
  );
}
