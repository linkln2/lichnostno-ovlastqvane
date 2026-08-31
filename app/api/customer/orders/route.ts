import { getPayloadInstance } from "@/lib/payload";
import { requireCustomer } from "@/lib/auth-request";

// GET /api/customer/orders — returns orders for the logged-in customer
export async function GET(request: Request) {
  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();
    const customerResult = await payload.find({
      collection: "customers",
      where: { email: { equals: auth.user.email } },
      limit: 1,
      overrideAccess: true,
    });

    if (customerResult.totalDocs === 0) {
      return Response.json({ docs: [], totalDocs: 0 });
    }

    const customer = customerResult.docs[0] as any;

    return Response.json({
      docs: [],
      totalDocs: 0,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        stripeCustomerId: customer.stripeCustomerId || null,
      },
    });
  } catch (err) {
    console.error("Customer orders error:", err);
    return Response.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
