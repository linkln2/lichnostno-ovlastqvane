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

    // Count confirmed registrations per package (for sold-out / waitlist logic)
    const registrationsResult = await payload.find({
      collection: "registrations",
      where: {
        event: { equals: event.id },
        status: { in: ["confirmed", "checked_in"] },
      },
      limit: 0, // just need the count per package
      overrideAccess: true,
    });

    // Build a count map: packageId → count
    const regCountByPackage: Record<number, number> = {};
    for (const reg of registrationsResult.docs as any[]) {
      const pkgId = reg.eventPackage;
      if (pkgId) {
        const id = typeof pkgId === "object" ? pkgId.id : pkgId;
        regCountByPackage[id] = (regCountByPackage[id] || 0) + 1;
      }
    }

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
        spotsLeft: p.capacity > 0 ? Math.max(0, p.capacity - (regCountByPackage[p.id] || 0)) : null,
        isSoldOut: p.capacity > 0 && (regCountByPackage[p.id] || 0) >= p.capacity,
      })),
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    return Response.json({ error: "Failed to load event" }, { status: 500 });
  }
}
