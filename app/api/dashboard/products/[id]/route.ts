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
    const data: Record<string, unknown> = {};

    // Only update fields that are present in the request
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.priceCents !== undefined) data.priceCents = Number(body.priceCents) || 0;
    if (body.compareAtCents !== undefined) data.compareAtCents = body.compareAtCents ? Number(body.compareAtCents) : null;
    if (body.currency !== undefined) data.currency = body.currency;
    if (body.sku !== undefined) data.sku = body.sku || null;
    if (body.category !== undefined) data.category = body.category;
    if (body.productType !== undefined) data.productType = body.productType;
    if (body.tags !== undefined) data.tags = body.tags || null;
    if (body.images !== undefined) data.images = body.images?.length ? body.images.map((id: string | number) => Number(id) || id) : [];
    if (body.downloadFile !== undefined) data.downloadFile = body.downloadFile ? (Number(body.downloadFile) || body.downloadFile) : null;
    if (body.inventory !== undefined) data.inventory = Number(body.inventory) || 0;
    if (body.lowStockThreshold !== undefined) data.lowStockThreshold = Number(body.lowStockThreshold) || 5;
    if (body.weightGrams !== undefined) data.weightGrams = body.weightGrams ? Number(body.weightGrams) : null;
    if (body.status !== undefined) data.status = body.status;
    if (body.featured !== undefined) data.featured = body.featured;
    if (body.stripePriceId !== undefined) data.stripePriceId = body.stripePriceId || null;
    if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle || null;
    if (body.seoDescription !== undefined) data.seoDescription = body.seoDescription || null;

    const record = await updateRecord("products", id, data);
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
    await deleteRecord("products", id);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
