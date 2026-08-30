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

// GET /api/customer/subscriptions — returns subscriptions for the logged-in customer
export async function GET(request: Request) {
  const userInfo = getUserFromCookie(request);
  if (!userInfo || userInfo.collection !== "customers") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "subscriptions",
      where: { email: { equals: userInfo.email } },
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
