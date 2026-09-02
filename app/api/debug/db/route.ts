import { getPayloadInstance } from "@/lib/payload";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    payloadSecretSet: !!process.env.PAYLOAD_SECRET,
    databaseUriSet: !!process.env.DATABASE_URI,
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    const payload = await getPayloadInstance();
    const queries: Record<string, unknown> = {};

    const testCollections = [
      "orders",
      "subscriptions",
      "events",
      "registrations",
      "products",
      "blog-posts",
    ];

    for (const collection of testCollections) {
      try {
        const result = await payload.find({
          collection: collection as any,
          limit: 1,
          overrideAccess: true,
        });
        queries[collection] = { ok: true, totalDocs: result.totalDocs };
      } catch (queryErr) {
        const message = queryErr instanceof Error ? queryErr.message : String(queryErr);
        queries[collection] = { ok: false, error: message };
      }
    }

    return Response.json({
      ok: true,
      ...checks,
      payloadVersion: "initialized",
      collections: Object.keys(payload.collections || {}).length,
      queries,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return Response.json(
      {
        ok: false,
        ...checks,
        error: message,
        stack: process.env.NODE_ENV === "development" ? stack : undefined,
      },
      { status: 500 }
    );
  }
}
