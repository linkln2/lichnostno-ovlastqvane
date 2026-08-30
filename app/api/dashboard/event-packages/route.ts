import { requireStaff, fetchCollection, createRecord, loc } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId");

  const { docs, totalDocs } = await fetchCollection<any>("event-packages", {
    sort: "priceCents",
    limit: 50,
    where: eventId ? { event: { equals: eventId } } : undefined,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((p) => ({
      id: p.id,
      event: p.event,
      name: loc(p.name),
      priceCents: p.priceCents,
      priceDisplay: loc(p.priceDisplay),
      spots: loc(p.spots),
      stripePriceId: p.stripePriceId,
      capacity: p.capacity,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const record = await createRecord("event-packages", {
      event: Number(body.eventId),
      name: { bg: body.nameBg || body.name || "", en: body.nameEn || body.name || "" },
      priceCents: Number(body.priceCents) || 0,
      priceDisplay: {
        bg: body.priceDisplayBg || "",
        en: body.priceDisplayEn || "",
      },
      spots: { bg: body.spotsBg || "", en: body.spotsEn || "" },
      stripePriceId: body.stripePriceId || "",
      capacity: Number(body.capacity) || 0,
    });
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
