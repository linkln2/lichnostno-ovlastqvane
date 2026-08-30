import { requireStaff, fetchCollection, createRecord } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("subscription-tiers", {
    sort: "priceCents",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((t) => ({
      id: t.id,
      name: t.name,
      priceCents: t.priceCents,
      interval: t.interval,
      stripePriceId: t.stripePriceId,
      perks: t.perks || [],
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const record = await createRecord("subscription-tiers", {
      name: body.name,
      priceCents: Number(body.priceCents) || 0,
      interval: body.interval || "month",
      stripePriceId: body.stripePriceId || "",
      perks: Array.isArray(body.perks)
        ? body.perks.filter(Boolean).map((p: string) => ({ perk: p }))
        : [],
    });
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
