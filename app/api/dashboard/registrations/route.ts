import { requireStaff, fetchCollection } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("registrations", {
    sort: "-createdAt",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      city: r.city,
      event: r.event,
      status: r.status,
      locale: r.locale,
      createdAt: r.createdAt,
    })),
  });
}
