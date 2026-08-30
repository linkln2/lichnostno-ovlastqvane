import { getPayload } from "payload";
import config from "@payload-config";

// POST /api/migrate?key=SETUP_KEY — creates all database tables by forcing
// Drizzle schema push. Works in production by temporarily switching NODE_ENV
// and auto-accepting any drizzle prompts.
export async function POST(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const expectedKey = process.env.SETUP_KEY;

  if (!expectedKey || key !== expectedKey) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Force drizzle push and auto-accept prompts
  (process.env as any).NODE_ENV = "development";
  (process.env as any).PAYLOAD_FORCE_DRIZZLE_PUSH = "true";

  // Auto-accept prompts by patching stdin
  const originalIsTTY = process.stdin.isTTY;
  (process.stdin as any).isTTY = false;

  try {
    // Get a fresh payload instance — this triggers connect() which calls pushDevSchema
    const payload = await getPayload({ config });

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
      { error: "Migration failed", detail: err.message?.slice(0, 500) },
      { status: 500 },
    );
  } finally {
    (process.stdin as any).isTTY = originalIsTTY;
  }
}
