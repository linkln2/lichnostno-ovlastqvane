import { getPayloadInstance } from "@/lib/payload";

// POST /api/migrate?key=SETUP_KEY — initializes Payload schema (creates tables)
// Forces schema push even in production by temporarily setting NODE_ENV
export async function POST(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const expectedKey = process.env.SETUP_KEY;

  if (!expectedKey || key !== expectedKey) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Save original NODE_ENV and temporarily set to development
  // so Payload's postgres adapter runs pushDevSchema
  const originalNodeEnv = process.env.NODE_ENV;
  (process.env as any).NODE_ENV = "development";

  try {
    // Clear any cached payload instance so it re-initializes
    const payloadMod = await import("payload");
    const configMod = await import("@payload-config");
    const payload = await payloadMod.getPayload({ config: configMod.default });

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
        const res = await payload.find({ collection: col as any, limit: 1, overrideAccess: true });
        results[col] = `ok (${res.totalDocs} docs)`;
      } catch (err: any) {
        results[col] = `error: ${err.message?.slice(0, 200)}`;
      }
    }

    return Response.json({ success: true, collections: results });
  } catch (err: any) {
    console.error("Migration error:", err);
    return Response.json(
      { error: "Migration failed", detail: err.message },
      { status: 500 },
    );
  } finally {
    // Restore original NODE_ENV
    (process.env as any).NODE_ENV = originalNodeEnv;
  }
}
