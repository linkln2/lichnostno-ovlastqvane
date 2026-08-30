import { requireStaff, updateRecord, deleteRecord, locField } from "@/lib/dashboard-api";

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
      capacity: Number(body.capacity) || 0,
      status: body.status,
    };
    if (body.titleBg !== undefined || body.titleEn !== undefined) {
      data.title = locField(body.titleBg || "", body.titleEn || "");
    }
    if (body.slug) data.slug = body.slug;
    if (body.locationBg !== undefined || body.locationEn !== undefined) {
      data.location = locField(body.locationBg || "", body.locationEn || "");
    }
    if (body.startsAt) data.startsAt = body.startsAt;
    if (body.endsAt !== undefined) data.endsAt = body.endsAt || undefined;

    const record = await updateRecord("events", id, data);
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
    await deleteRecord("events", id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
