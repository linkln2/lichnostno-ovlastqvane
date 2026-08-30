import { requireStaff } from "@/lib/dashboard-api";
import { getPayloadInstance } from "@/lib/payload";

// GET /api/dashboard/stats — real aggregate data for the Overview tab
export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();

    // ─── Revenue (last 30 days) ───────────────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ordersResult = await payload.find({
      collection: "orders",
      where: {
        status: { equals: "paid" },
        createdAt: { greater_than_equal: thirtyDaysAgo.toISOString() },
      },
      limit: 0,
      overrideAccess: true,
    });

    const totalRevenueCents = ordersResult.docs.reduce(
      (sum: number, o: any) => sum + (o.totalCents || 0),
      0
    );

    // Revenue by source
    const revenueBySource: Record<string, number> = { shop: 0, event: 0, subscription: 0 };
    for (const o of ordersResult.docs as any[]) {
      const src = o.source || "shop";
      revenueBySource[src] = (revenueBySource[src] || 0) + (o.totalCents || 0);
    }

    // ─── Active subscribers ───────────────────────────────────
    const subsResult = await payload.find({
      collection: "subscriptions",
      where: { status: { equals: "active" } },
      limit: 0,
      overrideAccess: true,
    });
    const activeSubscribers = subsResult.totalDocs;

    // Subscriber count by tier
    const subsByTier: Record<string, number> = {};
    for (const s of subsResult.docs as any[]) {
      const tier = s.tier;
      const tierName = typeof tier === "object" ? tier?.name : `Tier ${tier}`;
      subsByTier[tierName || "Unknown"] = (subsByTier[tierName || "Unknown"] || 0) + 1;
    }

    // ─── Upcoming events ──────────────────────────────────────
    const now = new Date().toISOString();
    const eventsResult = await payload.find({
      collection: "events",
      where: {
        startsAt: { greater_than_equal: now },
        status: { equals: "upcoming" },
      },
      sort: "startsAt",
      limit: 5,
      overrideAccess: true,
    });

    function loc(field: unknown): string {
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          return parsed.en || parsed.bg || field;
        } catch {
          return field;
        }
      }
      if (field && typeof field === "object") {
        const obj = field as Record<string, string>;
        return obj.en || obj.bg || "";
      }
      return String(field ?? "");
    }

    const upcomingEvents = eventsResult.docs.map((e: any) => ({
      id: e.id,
      title: loc(e.title),
      startsAt: e.startsAt,
      location: loc(e.location),
    }));

    // ─── Recent orders (last 10) ──────────────────────────────
    const recentOrdersResult = await payload.find({
      collection: "orders",
      sort: "-createdAt",
      limit: 10,
      overrideAccess: true,
    });

    const recentOrders = recentOrdersResult.docs.map((o: any) => ({
      id: o.id,
      status: o.status,
      totalCents: o.totalCents,
      source: o.source,
      createdAt: o.createdAt,
    }));

    // ─── Registrations count ──────────────────────────────────
    const regsResult = await payload.find({
      collection: "registrations",
      where: { status: { in: ["confirmed", "checked_in"] } },
      limit: 0,
      overrideAccess: true,
    });

    return Response.json({
      revenue30d: totalRevenueCents,
      revenueBySource,
      activeSubscribers,
      subsByTier,
      upcomingEvents,
      upcomingEventsCount: eventsResult.totalDocs,
      recentOrders,
      totalRegistrations: regsResult.totalDocs,
      // Previous period for delta calculation (simplified — just 0 for now)
      prevRevenue30d: 0,
      prevActiveSubscribers: 0,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return Response.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
