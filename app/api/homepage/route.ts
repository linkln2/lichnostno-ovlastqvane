import { getPayloadInstance } from "@/lib/payload";
import { hero, mission, values } from "@/lib/content";

// Static fallback — used when the database is unreachable or the global
// hasn't been saved yet. This ensures the homepage always renders.
function getStaticHomepage() {
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
      cards: values.map((v) => ({
        title: v.title,
        description: v.desc,
      })),
    },
    symbolism: {
      title: { bg: "Символизъм", en: "Symbolism" },
      enabled: true,
      cards: [],
    },
    productsSection: {
      enabled: true,
      heading: { bg: "Магазин", en: "Shop" },
      maxItems: 8,
    },
    membershipSection: {
      enabled: true,
      heading: { bg: "Членство", en: "Membership" },
      description: {
        bg: "Избери пътя, който звездите са прокарали пред теб.",
        en: "Choose the path the stars have laid before you.",
      },
    },
    testimonialsSection: {
      enabled: true,
      heading: { bg: "Отзиви", en: "Testimonials" },
    },
    videoSection: {
      enabled: true,
      heading: { bg: "Видео", en: "Videos" },
    },
    blogSection: {
      enabled: true,
      heading: { bg: "Последни статии", en: "Recent posts" },
      maxItems: 3,
    },
  };
}

// GET /api/homepage — returns the homepage global from Payload, with a
// static fallback from lib/content.ts when the database is unreachable.
export async function GET() {
  try {
    const payload = await getPayloadInstance();
    const data = await payload.findGlobal({ slug: "homepage" });

    if (!data) {
      return Response.json(getStaticHomepage());
    }

    return Response.json(data);
  } catch (err) {
    console.error("Homepage global fetch failed, using static fallback:", err);
    return Response.json(getStaticHomepage());
  }
}
