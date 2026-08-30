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
      priceCents: Number(body.priceCents) || 0,
      stripePriceId: body.stripePriceId || "",
      capacity: Number(body.capacity) || 0,
    };
    if (body.nameBg !== undefined || body.nameEn !== undefined) {
      data.name = { bg: body.nameBg || "", en: body.nameEn || "" };
    }
    if (body.priceDisplayBg !== undefined || body.priceDisplayEn !== undefined) {
      data.priceDisplay = { bg: body.priceDisplayBg || "", en: body.priceDisplayEn || "" };
    }
    if (body.spotsBg !== undefined || body.spotsEn !== undefined) {
      data.spots = { bg: body.spotsBg || "", en: body.spotsEn || "" };
    }

    const record = await updateRecord("event-packages", id, data);
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
    await deleteRecord("event-packages", id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
