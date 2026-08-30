import { requireStaff, updateRecord, deleteRecord } from "@/lib/dashboard-api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {
      name: body.name,
      priceCents: Number(body.priceCents) || 0,
      interval: body.interval,
      stripePriceId: body.stripePriceId || "",
    };
    if (Array.isArray(body.perks)) {
      data.perks = body.perks.filter(Boolean).map((p: string) => ({ perk: p }));
    }

    const record = await updateRecord("subscription-tiers", id, data);
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    await deleteRecord("subscription-tiers", id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
