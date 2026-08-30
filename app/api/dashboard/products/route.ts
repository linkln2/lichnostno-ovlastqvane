import { requireStaff, createRecord } from "@/lib/dashboard-api";

export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const record = await createRecord("products", {
      name: body.name,
      priceCents: Number(body.priceCents) || 0,
      category: body.category || "digital",
      productType: body.productType || "digital",
      status: body.status || "draft",
      inventory: body.productType === "physical" ? Number(body.inventory) || 0 : undefined,
    });
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
