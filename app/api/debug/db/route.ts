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
    return Response.json({
      ok: true,
      ...checks,
      payloadVersion: "initialized",
      collections: Object.keys(payload.collections || {}).length,
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
