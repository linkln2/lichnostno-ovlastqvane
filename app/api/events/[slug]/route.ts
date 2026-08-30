import { getPayloadInstance } from "@/lib/payload";

// Public endpoint: returns a single event with its ticket packages.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const payload = await getPayloadInstance();

    // Find event by slug
    const { docs } = await payload.find({
      collection: "events",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (docs.length === 0) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    const event = docs[0];

    // Fetch packages for this event
    const packagesResult = await payload.find({
      collection: "event-packages",
      where: { event: { equals: event.id } },
      sort: "priceCents",
      limit: 50,
      overrideAccess: true,
    });

    function loc(field: unknown): string {
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          return parsed.en || parsed.bg || field;
        } catch {
          return field;
        }
      }
      if (field && typeof field === "object") {
        const obj = field as Record<string, string>;
        return obj.en || obj.bg || "";
      }
      return String(field ?? "");
    }

    return Response.json({
      id: event.id,
      title: loc(event.title),
      slug: event.slug,
      location: loc(event.location),
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      capacity: event.capacity,
      status: event.status,
      packages: packagesResult.docs.map((p: any) => ({
        id: p.id,
        name: loc(p.name),
        priceCents: p.priceCents,
        priceDisplay: loc(p.priceDisplay),
        spots: loc(p.spots),
        stripePriceId: p.stripePriceId,
        capacity: p.capacity,
      })),
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    return Response.json({ error: "Failed to load event" }, { status: 500 });
  }
}
