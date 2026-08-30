import { requireStaff, createRecord, locField } from "@/lib/dashboard-api";
import { getPayloadInstance } from "@/lib/payload";

// POST /api/dashboard/events/import-facebook
// Body: { facebookUrl: "https://www.facebook.com/events/123456..." }
// Scrapes the Facebook event page and creates an event record.
export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const facebookUrl: string = body.facebookUrl || "";

    if (!facebookUrl || !facebookUrl.includes("facebook.com/events/")) {
      return Response.json(
        { error: "Please provide a valid Facebook event URL" },
        { status: 400 },
      );
    }

    // Extract event ID from URL
    const eventIdMatch = facebookUrl.match(/\/events\/(\d+)/);
    const facebookEventId = eventIdMatch?.[1] || "";

    if (!facebookEventId) {
      return Response.json(
        { error: "Could not extract event ID from URL" },
        { status: 400 },
      );
    }

    // Check if already imported
    const payload = await getPayloadInstance();
    const existing = await payload.find({
      collection: "events",
      where: { facebookEventId: { equals: facebookEventId } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) {
      return Response.json({
        success: true,
        imported: false,
        message: "Event already imported",
        id: existing.docs[0].id,
      });
    }

    // Fetch the Facebook event page (mobile version is easier to scrape)
    const mobileUrl = `https://mbasic.facebook.com/events/${facebookEventId}`;
    const fbRes = await fetch(mobileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EventImporter/1.0)",
      },
      redirect: "follow",
    });

    if (!fbRes.ok) {
      return Response.json(
        { error: `Failed to fetch Facebook event (status ${fbRes.status}). The event may be private.` },
        { status: 400 },
      );
    }

    const html = await fbRes.text();

    // Parse event details from the HTML
    const title = extractTitle(html);
    const location = extractLocation(html);
    const startsAt = extractStartDate(html);
    const endsAt = extractEndDate(html);
    const description = extractDescription(html);
    const coverUrl = extractCoverImage(html);

    if (!title) {
      return Response.json(
        { error: "Could not parse event title from Facebook page. The event may be private or require login." },
        { status: 400 },
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);

    const record = await createRecord("events", {
      title: locField(title, title),
      slug,
      location: locField(location, location),
      startsAt: startsAt || new Date().toISOString(),
      endsAt: endsAt || undefined,
      capacity: 0,
      status: "upcoming",
      coverUrl: coverUrl || undefined,
      facebookUrl,
      facebookEventId,
    });

    return Response.json({
      success: true,
      imported: true,
      id: record.id,
      event: { title, location, startsAt, coverUrl },
    });
  } catch (err: any) {
    console.error("Facebook import error:", err);
    return Response.json(
      { error: err.message || "Failed to import Facebook event" },
      { status: 500 },
    );
  }
}

// ─── HTML parsing helpers ────────────────────────────────────────

function extractTitle(html: string): string {
  // <title>Event Name | Facebook</title> or og:title
  const ogMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
  if (ogMatch) return decodeEntities(ogMatch[1]);
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    const raw = decodeEntities(titleMatch[1]);
    return raw.replace(/\s*\|\s*Facebook\s*$/i, "").trim();
  }
  // mbasic: <h3 ...>Title</h3> in event header
  const h3Match = html.match(/<h3[^>]*>([^<]+)<\/h3>/i);
  if (h3Match) return decodeEntities(h3Match[1]).trim();
  return "";
}

function extractLocation(html: string): string {
  // Look for location patterns
  const locMatch = html.match(/location[^>]*>?\s*<[^>]*>\s*([^<]+)/i);
  if (locMatch) return decodeEntities(locMatch[1]).trim();
  // mbasic pattern
  const tableMatch = html.match(/>([^<]+(?:Hall|Center|Centre|Studio|Hotel|Sofia|Plovdiv|Varna)[^<]*)</i);
  if (tableMatch) return decodeEntities(tableMatch[1]).trim();
  return "";
}

function extractStartDate(html: string): string | null {
  // Try og:start_time or meta
  const metaMatch = html.match(/<meta\s+property="event:start_time"\s+content="([^"]+)"/i);
  if (metaMatch) return metaMatch[1];
  // Try to find a date pattern
  const dateMatch = html.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  if (dateMatch) return dateMatch[1];
  return null;
}

function extractEndDate(html: string): string | null {
  const metaMatch = html.match(/<meta\s+property="event:end_time"\s+content="([^"]+)"/i);
  if (metaMatch) return metaMatch[1];
  return null;
}

function extractDescription(html: string): string {
  const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
  if (descMatch) return decodeEntities(descMatch[1]);
  return "";
}

function extractCoverImage(html: string): string | null {
  const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
  if (imgMatch) return imgMatch[1];
  return null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}
