import { getPayloadInstance } from "@/lib/payload";
import { requireCustomer } from "@/lib/auth-request";

// GET /api/customer/registrations — returns event registrations for the logged-in customer
export async function GET(request: Request) {
  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "registrations",
      where: { email: { equals: auth.user.email } },
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
