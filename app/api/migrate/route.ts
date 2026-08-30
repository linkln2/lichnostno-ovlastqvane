import { getPayloadInstance } from "@/lib/payload";

// POST /api/migrate?key=SETUP_KEY — initializes Payload schema (creates tables)
export async function POST(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const expectedKey = process.env.SETUP_KEY;

  if (!expectedKey || key !== expectedKey) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const payload = await getPayloadInstance();

    // Try accessing each collection to trigger schema sync
    const collections = [
      "staff",
      "customers",
      "media",
      "blog-posts",
      "events",
      "event-packages",
      "products",
      "subscription-tiers",
      "pages",
      "orders",
      "registrations",
      "subscriptions",
      "check-ins",
      "social-stats",
    ];

    const results: Record<string, string> = {};
    for (const col of collections) {
      try {
        await payload.find({ collection: col as any, limit: 1, overrideAccess: true });
        results[col] = "ok";
      } catch (err: any) {
        results[col] = `error: ${err.message?.slice(0, 100)}`;
      }
    }

    return Response.json({ success: true, collections: results });
  } catch (err: any) {
    console.error("Migration error:", err);
    return Response.json(
      { error: "Migration failed", detail: err.message },
      { status: 500 },
    );
  }
}
