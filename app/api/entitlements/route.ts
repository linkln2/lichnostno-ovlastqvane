import { getPayloadInstance } from "@/lib/payload";
import { getCustomerEntitlements } from "@/lib/entitlements";

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

// GET /api/entitlements — returns all entitlements for the logged-in customer
export async function GET(request: Request) {
  const userInfo = getUserFromCookie(request);
  if (!userInfo || userInfo.collection !== "customers") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = await getPayloadInstance();

    // Look up the customer record to get the ID
    const customerRes = await payload.find({
      collection: "customers",
      where: { email: { equals: userInfo.email } },
      limit: 1,
      overrideAccess: true,
    });

    if (!customerRes.docs.length) {
      return Response.json({ error: "Customer not found" }, { status: 404 });
    }

    const customer = customerRes.docs[0];
    const entitlements = await getCustomerEntitlements(
      payload,
      String(customer.id),
      userInfo.email,
    );

    return Response.json(entitlements);
  } catch (err) {
    console.error("Entitlements error:", err);
    return Response.json({ error: "Failed to load entitlements" }, { status: 500 });
  }
}
