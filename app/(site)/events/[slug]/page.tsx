import { pageMetadata } from "@/lib/seo";
import { getPayloadInstance } from "@/lib/payload";
import { getEventBySlug } from "@/lib/content";
import EventDetailView from "./EventDetailView";

// Payload stores localized fields as a JSON string or an object.
function loc(field: unknown, locale: "bg" | "en" = "bg"): string {
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return parsed[locale] || parsed.bg || parsed.en || field;
    } catch {
      return field;
    }
  }
  if (field && typeof field === "object") {
    const obj = field as Record<string, string>;
    return obj[locale] || obj.bg || obj.en || "";
  }
  return "";
}

/**
 * Look up an event for metadata purposes. Reads Payload directly rather than
 * calling our own /api/events route over HTTP — a server component fetching
 * its own API is an extra round trip for no benefit.
 *
 * Falls back to the static content module, then to null, so a database
 * problem degrades to generic metadata instead of failing the page.
 */
async function getEventForMeta(slug: string) {
  try {
    const payload = await getPayloadInstance();
    const { docs } = await payload.find({
      collection: "events",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (docs.length > 0) {
      const e = docs[0] as any;
      return {
        title: loc(e.title),
        location: loc(e.location),
        startsAt: e.startsAt as string | undefined,
      };
    }
  } catch (err) {
    console.error("Event metadata lookup failed:", err);
  }

  const staticEvent = getEventBySlug(slug);
  if (staticEvent) {
    return {
      title: staticEvent.title.bg,
      location: staticEvent.location.bg,
      startsAt: staticEvent.date,
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventForMeta(slug);

  if (!event) {
    return pageMetadata({
      title: "Събитието не е намерено",
      description: "Това събитие не съществува или вече е приключило.",
      path: `/events/${slug}`,
      noIndex: true,
    });
  }

  const when = event.startsAt
    ? new Date(event.startsAt).toLocaleDateString("bg-BG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const description = [event.location, when].filter(Boolean).join(" · ") ||
    "Семинар за личностно овластяване.";

  return pageMetadata({
    title: event.title,
    description: `${event.title} — ${description}`,
    path: `/events/${slug}`,
    type: "article",
  });
}

export default function Page() {
  return <EventDetailView />;
}
