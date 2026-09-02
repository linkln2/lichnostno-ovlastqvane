import { getPayloadInstance } from "./payload";
import {
  products as staticProducts,
  membershipTiers as staticTiers,
  events as staticEvents,
  blogPosts as staticPosts,
  hero,
  mission,
  values,
  type ProductItem,
  type BlogPost as ContentBlogPost,
  type EventItem as ContentEventItem,
} from "./content";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ShopProduct = {
  id: number | string;
  name: string;
  slug: string;
  priceCents: number;
  category: string;
  productType: string;
  inventory: number;
  status: string;
  images: any[];
  image: string | null;
  description?: any;
  downloadFile?: { id?: number | string; url?: string } | null;
};

export type Tier = {
  id: number | string;
  name: string;
  description: string;
  priceCents: number;
  interval: string;
  stripePriceId?: string;
  perks: string[];
};

export type HomepageContent = {
  hero: {
    title: { bg: string; en: string };
    subtitle: { bg: string; en: string };
    primaryCtaText: { bg: string; en: string };
    primaryCtaHref: string;
    secondaryCtaText: { bg: string; en: string };
    secondaryCtaHref: string;
    showCountdown: boolean;
    showVideoFeed: boolean;
  };
  mission: {
    title: { bg: string; en: string };
    text: { bg: string; en: string };
    enabled: boolean;
  };
  values: {
    title: { bg: string; en: string };
    enabled: boolean;
    cards: { title: { bg: string; en: string }; description: { bg: string; en: string } }[];
  };
  symbolism: {
    title: { bg: string; en: string };
    enabled: boolean;
    cards: { title: { bg: string; en: string }; description: { bg: string; en: string } }[];
  };
  productsSection: { enabled: boolean; heading: { bg: string; en: string }; maxItems: number };
  membershipSection: {
    enabled: boolean;
    heading: { bg: string; en: string };
    description: { bg: string; en: string };
  };
  testimonialsSection: { enabled: boolean; heading: { bg: string; en: string } };
  videoSection: { enabled: boolean; heading: { bg: string; en: string } };
  blogSection: { enabled: boolean; heading: { bg: string; en: string }; maxItems: number };
};

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ShopProduct[]> {
  const staticFallback = (): ShopProduct[] =>
    staticProducts.map((p) => ({
      id: p.slug,
      name: p.name.bg,
      slug: p.slug,
      priceCents: p.price * 100,
      category: p.category,
      productType: "physical",
      inventory: 100,
      status: "published",
      images: [],
      image: p.image ?? null,
    }));

  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "products",
      sort: "-createdAt",
      limit: 50,
      where: { status: { equals: "published" } },
      overrideAccess: true,
    });

    // Fall back to static content when the DB is reachable but empty.
    // This ensures the shop is never empty even before products are seeded.
    if (result.docs.length === 0) {
      return staticFallback();
    }

    return result.docs.map((p: any) => {
      const staticProduct = staticProducts.find((sp) => sp.slug === p.slug);
      const firstImage = p.images?.[0];
      const imageUrl =
        (firstImage?.sizes?.thumbnail?.url || firstImage?.url) ??
        staticProduct?.image ??
        null;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug || String(p.id),
        priceCents: p.priceCents,
        category: p.category,
        productType: p.productType,
        inventory: p.inventory,
        status: p.status,
        images: p.images || [],
        image: imageUrl,
        description: p.description,
        downloadFile: p.downloadFile
          ? { id: p.downloadFile.id, url: p.downloadFile.url || null }
          : null,
      };
    });
  } catch (err) {
    console.error("getProducts: falling back to static:", err);
    return staticFallback();
  }
}

export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (result.docs.length === 0) {
      const sp = staticProducts.find((p) => p.slug === slug);
      if (!sp) return null;
      return {
        id: sp.slug,
        name: sp.name.bg,
        slug: sp.slug,
        priceCents: sp.price * 100,
        category: sp.category,
        productType: "physical",
        inventory: 100,
        status: "published",
        images: [],
        image: sp.image ?? null,
      };
    }
    const p = result.docs[0] as any;
    const staticProduct = staticProducts.find((sp) => sp.slug === p.slug);
    const firstImage = p.images?.[0];
    const imageUrl =
      (firstImage?.sizes?.thumbnail?.url || firstImage?.url) ??
      staticProduct?.image ??
      null;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug || String(p.id),
      priceCents: p.priceCents,
      category: p.category,
      productType: p.productType,
      inventory: p.inventory,
      status: p.status,
      images: p.images || [],
      image: imageUrl,
      description: p.description,
      downloadFile: p.downloadFile
        ? { id: p.downloadFile.id, url: p.downloadFile.url || null }
        : null,
    };
  } catch (err) {
    console.error("getProductBySlug: falling back to static:", err);
    const sp = staticProducts.find((p) => p.slug === slug);
    if (!sp) return null;
    return {
      id: sp.slug,
      name: sp.name.bg,
      slug: sp.slug,
      priceCents: sp.price * 100,
      category: sp.category,
      productType: "physical",
      inventory: 100,
      status: "published",
      images: [],
      image: sp.image ?? null,
      description: null,
      downloadFile: null,
    };
  }
}

// ─── Subscription Tiers ──────────────────────────────────────────────────────

export async function getSubscriptionTiers(): Promise<Tier[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "subscription-tiers",
      sort: "priceCents",
      limit: 20,
      overrideAccess: true,
    });

    // Fall back to static when DB is reachable but empty
    if (result.docs.length === 0) {
      return staticTiers.map((t, i) => ({
        id: `static-tier-${i}`,
        name: t.name.bg,
        description: t.perks[0]?.bg || "",
        priceCents: t.price * 100,
        interval: "month",
        perks: t.perks.map((p) => p.bg),
      }));
    }

    return result.docs.map((t: any) => ({
      id: t.id,
      name: typeof t.name === "string" ? t.name : t.name?.bg || t.name?.en || "",
      description:
        typeof t.description === "string"
          ? t.description
          : t.description?.bg || t.description?.en || "",
      priceCents: t.priceCents,
      interval: t.interval,
      stripePriceId: t.stripePriceId,
      perks: Array.isArray(t.perks)
        ? t.perks.map((pk: any) => (typeof pk === "string" ? pk : pk?.bg || pk?.en || ""))
        : [],
    }));
  } catch (err) {
    console.error("getSubscriptionTiers: falling back to static:", err);
    return staticTiers.map((t, i) => ({
      id: `static-tier-${i}`,
      name: t.name.bg,
      description: t.perks[0]?.bg || "",
      priceCents: t.price * 100,
      interval: "month",
      perks: t.perks.map((p) => p.bg),
    }));
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<ContentEventItem[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "events",
      sort: "startsAt",
      limit: 50,
      overrideAccess: true,
    });

    if (result.docs.length === 0) {
      return staticEvents;
    }

    // Map DB events to the content.ts EventItem shape
    return result.docs.map((e: any) => ({
      slug: e.slug,
      status: e.status || "upcoming",
      kind: e.kind || "seminar",
      title: e.title || { bg: e.title || "", en: e.title || "" },
      date: e.startsAt,
      dateEnd: e.endsAt,
      location: e.location || { bg: "", en: "" },
      description: e.description || { bg: "", en: "" },
      highlights: { bg: [], en: [] },
      price: { bg: "", en: "" },
      packages: e.packages || [],
      capacity: e.capacity || 0,
    }));
  } catch (err) {
    console.error("getEvents: falling back to static:", err);
    return staticEvents;
  }
}

export async function getEventBySlug(slug: string): Promise<ContentEventItem | null> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "events",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (result.docs.length === 0) {
      return staticEvents.find((e) => e.slug === slug) || null;
    }
    const e = result.docs[0] as any;
    return {
      slug: e.slug,
      status: e.status || "upcoming",
      kind: e.kind || "seminar",
      title: e.title || { bg: e.title || "", en: e.title || "" },
      date: e.startsAt,
      dateEnd: e.endsAt,
      location: e.location || { bg: "", en: "" },
      description: e.description || { bg: "", en: "" },
      highlights: { bg: [], en: [] },
      price: { bg: "", en: "" },
      packages: e.packages || [],
      capacity: e.capacity || 0,
    };
  } catch (err) {
    console.error("getEventBySlug: falling back to static:", err);
    return staticEvents.find((e) => e.slug === slug) || null;
  }
}

// ─── Blog Posts ──────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<ContentBlogPost[]> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "blog-posts",
      sort: "-publishAt",
      limit: 20,
      where: { status: { equals: "published" } },
      overrideAccess: true,
    });

    if (result.docs.length === 0) {
      return staticPosts;
    }

    // Map DB blog posts to the content.ts BlogPost shape
    return result.docs.map((p: any) => ({
      slug: p.slug,
      title: p.title || { bg: p.title || "", en: p.title || "" },
      excerpt: p.excerpt || { bg: "", en: "" },
      date: p.publishAt || p.createdAt || new Date().toISOString(),
      readTime: { bg: "5 мин", en: "5 min" },
      cover: p.coverImage?.url || p.coverImage || undefined,
      content: p.body || { bg: "", en: "" },
    }));
  } catch (err) {
    console.error("getBlogPosts: falling back to static:", err);
    return staticPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<ContentBlogPost | null> {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "blog-posts",
      where: { slug: { equals: slug }, status: { equals: "published" } },
      limit: 1,
      overrideAccess: true,
    });
    if (result.docs.length === 0) {
      return staticPosts.find((p) => p.slug === slug) || null;
    }
    const p = result.docs[0] as any;
    return {
      slug: p.slug,
      title: p.title || { bg: p.title || "", en: p.title || "" },
      excerpt: p.excerpt || { bg: "", en: "" },
      date: p.publishAt || p.createdAt || new Date().toISOString(),
      readTime: { bg: "5 мин", en: "5 min" },
      cover: p.coverImage?.url || p.coverImage || undefined,
      content: p.body || { bg: "", en: "" },
    };
  } catch (err) {
    console.error("getBlogPostBySlug: falling back to static:", err);
    return staticPosts.find((p) => p.slug === slug) || null;
  }
}

// ─── Homepage Global ─────────────────────────────────────────────────────────

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const payload = await getPayloadInstance();
    const global = await payload.findGlobal({
      slug: "homepage",
      overrideAccess: true,
    });

    if (!global) {
      return getStaticHomepage();
    }

    // Merge CMS data over static fallback — CMS wins when present
    const staticHp = getStaticHomepage();
    const g = global as any;
    return {
      hero: {
        title: g.hero?.title || staticHp.hero.title,
        subtitle: g.hero?.subtitle || staticHp.hero.subtitle,
        primaryCtaText: g.hero?.primaryCtaText || staticHp.hero.primaryCtaText,
        primaryCtaHref: g.hero?.primaryCtaHref || staticHp.hero.primaryCtaHref,
        secondaryCtaText: g.hero?.secondaryCtaText || staticHp.hero.secondaryCtaText,
        secondaryCtaHref: g.hero?.secondaryCtaHref || staticHp.hero.secondaryCtaHref,
        showCountdown: g.hero?.showCountdown ?? staticHp.hero.showCountdown,
        showVideoFeed: g.hero?.showVideoFeed ?? staticHp.hero.showVideoFeed,
      },
      mission: {
        title: g.mission?.title || staticHp.mission.title,
        text: g.mission?.text || staticHp.mission.text,
        enabled: g.mission?.enabled ?? staticHp.mission.enabled,
      },
      values: {
        title: g.values?.title || staticHp.values.title,
        enabled: g.values?.enabled ?? staticHp.values.enabled,
        cards: g.values?.cards || staticHp.values.cards,
      },
      symbolism: {
        title: g.symbolism?.title || staticHp.symbolism.title,
        enabled: g.symbolism?.enabled ?? staticHp.symbolism.enabled,
        cards: g.symbolism?.cards || staticHp.symbolism.cards,
      },
      productsSection: g.productsSection || staticHp.productsSection,
      membershipSection: g.membershipSection || staticHp.membershipSection,
      testimonialsSection: g.testimonialsSection || staticHp.testimonialsSection,
      videoSection: g.videoSection || staticHp.videoSection,
      blogSection: g.blogSection || staticHp.blogSection,
    };
  } catch (err) {
    console.error("getHomepageContent: falling back to static:", err);
    return getStaticHomepage();
  }
}

function getStaticHomepage(): HomepageContent {
  return {
    hero: {
      title: hero.title,
      subtitle: hero.subtitle,
      primaryCtaText: { bg: "Разгледай", en: "Explore" },
      primaryCtaHref: "/shop",
      secondaryCtaText: { bg: "Научи повече", en: "Learn more" },
      secondaryCtaHref: "/about",
      showCountdown: true,
      showVideoFeed: true,
    },
    mission: {
      title: { bg: "Мисия", en: "Mission" },
      text: mission,
      enabled: true,
    },
    values: {
      title: { bg: "Ценности", en: "Values" },
      enabled: true,
      cards: values.map((v) => ({ title: v.title, description: v.desc })),
    },
    symbolism: {
      title: { bg: "Символизъм", en: "Symbolism" },
      enabled: true,
      cards: [],
    },
    productsSection: { enabled: true, heading: { bg: "Магазин", en: "Shop" }, maxItems: 8 },
    membershipSection: {
      enabled: true,
      heading: { bg: "Членство", en: "Membership" },
      description: {
        bg: "Избери пътя, който звездите са прокарали пред теб.",
        en: "Choose the path the stars have laid before you.",
      },
    },
    testimonialsSection: { enabled: true, heading: { bg: "Отзиви", en: "Testimonials" } },
    videoSection: { enabled: true, heading: { bg: "Видео", en: "Videos" } },
    blogSection: { enabled: true, heading: { bg: "Последни статии", en: "Recent posts" }, maxItems: 3 },
  };
}
