import { requireStaff } from "@/lib/dashboard-api";
import { getPayloadInstance } from "@/lib/payload";

// GET /api/dashboard/analytics — deeper analytics for the Analytics tab
export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const payload = await getPayloadInstance();

    // ─── Subscriber stats ─────────────────────────────────────
    const activeSubs = await payload.find({
      collection: "subscriptions",
      where: { status: { equals: "active" } },
      limit: 0,
      overrideAccess: true,
    });

    const cancelledSubs = await payload.find({
      collection: "subscriptions",
      where: { status: { equals: "cancelled" } },
      limit: 0,
      overrideAccess: true,
    });

    const pastDueSubs = await payload.find({
      collection: "subscriptions",
      where: { status: { equals: "past_due" } },
      limit: 0,
      overrideAccess: true,
    });

    // ─── Event conversion ─────────────────────────────────────
    // For each upcoming event: views vs registrations
    const now = new Date().toISOString();
    const eventsResult = await payload.find({
      collection: "events",
      sort: "startsAt",
      limit: 20,
      overrideAccess: true,
    });

    const eventStats = await Promise.all(
      eventsResult.docs.map(async (e: any) => {
        const regsResult = await payload.find({
          collection: "registrations",
          where: {
            event: { equals: e.id },
            status: { in: ["confirmed", "checked_in"] },
          },
          limit: 0,
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

        return {
          id: e.id,
          title: loc(e.title),
          views: e.viewCount || 0,
          registrations: regsResult.totalDocs,
          conversionRate:
            e.viewCount > 0
              ? Math.round((regsResult.totalDocs / e.viewCount) * 100)
              : 0,
        };
      })
    );

    // ─── Blog post views ──────────────────────────────────────
    const blogResult = await payload.find({
      collection: "blog-posts",
      sort: "-viewCount",
      limit: 10,
      overrideAccess: true,
    });

    function locBlog(field: unknown): string {
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

    const topBlogPosts = blogResult.docs.map((p: any) => ({
      id: p.id,
      title: locBlog(p.title),
      slug: p.slug,
      views: p.viewCount || 0,
    }));

    // ─── Revenue over time (last 90 days, by day) ─────────────
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const ordersResult = await payload.find({
      collection: "orders",
      where: {
        status: { equals: "paid" },
        createdAt: { greater_than_equal: ninetyDaysAgo.toISOString() },
      },
      sort: "createdAt",
      limit: 500,
      overrideAccess: true,
    });

    // Group by day
    const revenueByDay: Record<string, number> = {};
    for (const o of ordersResult.docs as any[]) {
      const day = (o.createdAt as string).slice(0, 10);
      revenueByDay[day] = (revenueByDay[day] || 0) + (o.totalCents || 0);
    }

    const revenueTimeSeries = Object.entries(revenueByDay)
      .map(([date, cents]) => ({ date, cents }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return Response.json({
      subscribers: {
        active: activeSubs.totalDocs,
        cancelled: cancelledSubs.totalDocs,
        pastDue: pastDueSubs.totalDocs,
        churnRate:
          activeSubs.totalDocs + cancelledSubs.totalDocs > 0
            ? Math.round(
                (cancelledSubs.totalDocs /
                  (activeSubs.totalDocs + cancelledSubs.totalDocs)) *
                  100
              )
            : 0,
      },
      eventStats,
      topBlogPosts,
      revenueTimeSeries,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return Response.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
