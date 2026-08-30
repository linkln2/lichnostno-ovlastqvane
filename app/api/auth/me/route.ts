import { getPayloadInstance } from "@/lib/payload";

// GET /api/auth/me — returns the currently logged-in user (customer or staff)
export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const tokenMatch = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("payload-token="));

    if (!tokenMatch) {
      return Response.json({ user: null });
    }

    const token = tokenMatch.split("=")[1];
    if (!token) {
      return Response.json({ user: null });
    }

    // Decode the JWT to get collection, id, and email
    // Payload JWTs have payload: { id, collection, email }
    const parts = token.split(".");
    if (parts.length !== 3) {
      return Response.json({ user: null });
    }

    const payloadStr = Buffer.from(parts[1], "base64").toString("utf-8");
    const decoded = JSON.parse(payloadStr);

    if (!decoded.collection || !decoded.email) {
      return Response.json({ user: null });
    }

    // Look up the user in the appropriate collection
    const p = await getPayloadInstance();
    const result = await p.find({
      collection: decoded.collection as any,
      where: { email: { equals: decoded.email } },
      limit: 1,
      overrideAccess: true,
    });

    if (result.totalDocs === 0) {
      return Response.json({ user: null });
    }

    const userDoc = result.docs[0] as any;
    return Response.json({
      user: {
        id: userDoc.id,
        email: userDoc.email,
        name: userDoc.name,
        collection: decoded.collection,
      },
    });
  } catch (err) {
    console.error("Me error:", err);
    return Response.json({ user: null });
  }
}
