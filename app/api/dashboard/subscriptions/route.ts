import { requireStaff, fetchCollection } from "@/lib/dashboard-api";

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("subscriptions", {
    sort: "-createdAt",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((s) => ({
      id: s.id,
      status: s.status,
      customer: s.customer,
      tier: s.tier,
      stripeSubscriptionId: s.stripeSubscriptionId,
      currentPeriodStart: s.currentPeriodStart,
      currentPeriodEnd: s.currentPeriodEnd,
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    })),
  });
}
