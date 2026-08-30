import { getPayloadInstance } from "@/lib/payload";

function getUserFromCookie(request: Request): { email: string; collection: string } | null {
  const cookie = request.headers.get("cookie") || "";
  const tokenMatch = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("payload-token="));

  if (!tokenMatch) return null;

  const token = tokenMatch.split("=")[1];
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadStr = Buffer.from(parts[1], "base64").toString("utf-8");
    const decoded = JSON.parse(payloadStr);
    if (!decoded.collection || !decoded.email) return null;
    return { email: decoded.email, collection: decoded.collection };
  } catch {
    return null;
  }
}

// GET /api/customer/orders — returns orders for the logged-in customer
export async function GET(request: Request) {
  const userInfo = getUserFromCookie(request);
  if (!userInfo || userInfo.collection !== "customers") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = await getPayloadInstance();
    const customerResult = await payload.find({
      collection: "customers",
      where: { email: { equals: userInfo.email } },
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
