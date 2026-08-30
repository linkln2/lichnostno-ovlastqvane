import { requireStaff, fetchCollection, createRecord, loc } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("products", {
    sort: "-createdAt",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((p) => ({
      id: p.id,
      name: p.name,
      priceCents: p.priceCents,
      category: p.category,
      productType: p.productType,
      inventory: p.inventory,
      status: p.status,
    })),
  });
}

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
