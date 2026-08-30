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

// GET /api/customer/registrations — returns event registrations for the logged-in customer
export async function GET(request: Request) {
  const userInfo = getUserFromCookie(request);
  if (!userInfo || userInfo.collection !== "customers") {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "registrations",
      where: { email: { equals: userInfo.email } },
      sort: "-createdAt",
      overrideAccess: true,
    });

    // Enrich with event details
    const enriched = await Promise.all(
      result.docs.map(async (r: any) => {
        let eventTitle = "";
        let eventStartsAt = "";
        if (r.event) {
          try {
            const event = await payload.findByID({
              collection: "events",
              id: typeof r.event === "object" ? r.event.id : r.event,
              overrideAccess: true,
            });
            if (event) {
              eventTitle = typeof event.title === "string"
                ? (() => { try { const p = JSON.parse(event.title); return p.en || p.bg; } catch { return event.title; } })()
                : (event.title as any)?.en || "";
              eventStartsAt = event.startsAt || "";
            }
          } catch {}
        }
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          package: r.package,
          status: r.status,
          hasQr: !!r.qrToken,
          qrToken: r.qrToken,
          eventTitle,
          eventStartsAt,
          createdAt: r.createdAt,
        };
      })
    );

    return Response.json({
      totalDocs: result.totalDocs,
      docs: enriched,
    });
  } catch (err) {
    console.error("Customer regs error:", err);
    return Response.json({ error: "Failed to load registrations" }, { status: 500 });
  }
}
