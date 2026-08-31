import { getPayloadInstance } from "@/lib/payload";
import { requireCustomer } from "@/lib/auth-request";

// GET /api/customer/subscriptions — returns subscriptions for the logged-in customer
export async function GET(request: Request) {
  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "subscriptions",
      where: { email: { equals: auth.user.email } },
      sort: "-createdAt",
      overrideAccess: true,
    });

    return Response.json({
      totalDocs: result.totalDocs,
      docs: result.docs.map((s: any) => ({
        id: s.id,
        status: s.status,
        tier: s.tier,
        currentPeriodEnd: s.currentPeriodEnd,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    console.error("Customer subs error:", err);
    return Response.json({ error: "Failed to load subscriptions" }, { status: 500 });
  }
}
