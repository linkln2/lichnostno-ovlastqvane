import { requireStaff, fetchCollection } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("orders", {
    sort: "-createdAt",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((o) => ({
      id: o.id,
      status: o.status,
      totalCents: o.totalCents,
      currency: o.currency,
      customer: o.customer,
      items: (o.items || []).map((it: any) => ({
        type: it.type,
        quantity: it.quantity,
        priceCents: it.priceCents,
      })),
      createdAt: o.createdAt,
    })),
  });
}
