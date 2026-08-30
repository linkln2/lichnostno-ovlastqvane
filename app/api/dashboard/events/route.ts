import { requireStaff, fetchCollection, createRecord, locField, loc } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("events", {
    sort: "-startsAt",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((e) => ({
      id: e.id,
      title: loc(e.title),
      slug: e.slug,
      location: loc(e.location),
      startsAt: e.startsAt,
      endsAt: e.endsAt,
      capacity: e.capacity,
      status: e.status,
      description: typeof e.description === "string" ? e.description : "",
      coverUrl: e.coverUrl || "",
      facebookUrl: e.facebookUrl || "",
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const title = body.title || "";
    const location = body.location || "";
    const record = await createRecord("events", {
      title: locField(title, title),
      slug: body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      location: locField(location, location),
      startsAt: body.startsAt,
      endsAt: body.endsAt || undefined,
      capacity: Number(body.capacity) || 0,
      status: body.status || "upcoming",
      coverUrl: body.coverUrl || undefined,
      facebookUrl: body.facebookUrl || undefined,
    });
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
