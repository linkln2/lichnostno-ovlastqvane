import { getPayloadInstance } from "@/lib/payload";

// Shared helper for dashboard API routes.
// Verifies the payload-token cookie exists, then uses the local Payload API
// with overrideAccess (the proxy already gates /dashboard behind auth).
export async function requireStaff(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("payload-token="));

  if (!token) {
    return { ok: false as const, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const };
}

// Parse a localized JSON field from Payload (stored as {"bg":"...","en":"..."})
export function loc(field: unknown, locale = "en"): string {
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return parsed[locale] || parsed.en || parsed.bg || field;
    } catch {
      return field;
    }
  }
  if (field && typeof field === "object") {
    const obj = field as Record<string, string>;
    return obj[locale] || obj.en || obj.bg || "";
  }
  return String(field ?? "");
}

export async function fetchCollection<T>(
  collection: string,
  options: { limit?: number; sort?: string; where?: Record<string, unknown> } = {},
): Promise<{ docs: T[]; totalDocs: number }> {
  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: collection as any,
    limit: options.limit ?? 50,
    sort: options.sort,
    where: options.where as any,
    overrideAccess: true,
  });
  return { docs: result.docs as T[], totalDocs: result.totalDocs };
}

export async function createRecord(
  collection: string,
  data: Record<string, unknown>,
) {
  const payload = await getPayloadInstance();
  return payload.create({
    collection: collection as any,
    data: data as any,
    overrideAccess: true,
  });
}

export async function updateRecord(
  collection: string,
  id: string | number,
  data: Record<string, unknown>,
) {
  const payload = await getPayloadInstance();
  return payload.update({
    collection: collection as any,
    id: id as any,
    data: data as any,
    overrideAccess: true,
  });
}

export async function deleteRecord(
  collection: string,
  id: string | number,
) {
  const payload = await getPayloadInstance();
  return payload.delete({
    collection: collection as any,
    id: id as any,
    overrideAccess: true,
  });
}

// Build a localized field value for Payload (stored as {"bg":"...","en":"..."})
export function locField(bg: string, en: string) {
  return { bg, en };
}
