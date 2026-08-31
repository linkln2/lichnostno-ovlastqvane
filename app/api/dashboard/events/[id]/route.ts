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
    const data: Record<string, unknown> = {};

    if (body.title !== undefined) {
      data.title = locField(body.title, body.title);
    }
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.location !== undefined) {
      data.location = locField(body.location, body.location);
    }
    if (body.startsAt !== undefined) data.startsAt = body.startsAt;
    if (body.endsAt !== undefined) data.endsAt = body.endsAt || undefined;
    if (body.capacity !== undefined) data.capacity = Number(body.capacity) || 0;
    if (body.status !== undefined) data.status = body.status;
    if (body.kind !== undefined) data.kind = body.kind;
    if (body.coverUrl !== undefined) data.coverUrl = body.coverUrl || undefined;
    if (body.facebookUrl !== undefined) data.facebookUrl = body.facebookUrl || undefined;

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
