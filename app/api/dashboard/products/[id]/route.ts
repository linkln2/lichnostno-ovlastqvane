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
    const record = await updateRecord("products", id, {
      name: body.name,
      priceCents: Number(body.priceCents) || 0,
      category: body.category,
      productType: body.productType,
      status: body.status,
      inventory: body.productType === "physical" ? Number(body.inventory) || 0 : undefined,
    });
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
