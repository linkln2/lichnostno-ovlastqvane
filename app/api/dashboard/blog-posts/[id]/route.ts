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
      status: body.status,
      visibility: body.visibility,
    };
    if (body.titleBg !== undefined || body.titleEn !== undefined) {
      data.title = locField(body.titleBg || "", body.titleEn || "");
    }
    if (body.slug) data.slug = body.slug;
    if (body.excerptBg !== undefined || body.excerptEn !== undefined) {
      data.excerpt = locField(body.excerptBg || "", body.excerptEn || "");
    }
    if (body.publishAt !== undefined) data.publishAt = body.publishAt || undefined;

    const record = await updateRecord("blog-posts", id, data);
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
    await deleteRecord("blog-posts", id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
