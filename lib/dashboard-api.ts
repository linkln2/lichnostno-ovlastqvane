import { getPayloadInstance } from "@/lib/payload";
import type { Locale } from "@/lib/i18n";
export { requireStaff } from "@/lib/auth-request";

// Parse a localized JSON field from Payload (stored as {"bg":"...","en":"...","es":"...",...})
export function loc(field: unknown, locale: Locale = "en"): string {
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

// Build a localized field value for Payload (stored as {"bg":"...","en":"...",...})
export function locField(bg: string, en: string, ...rest: Partial<Record<Exclude<Locale, "bg" | "en">, string>>[]) {
  const merged = Object.assign({}, ...rest);
  return { bg, en, ...merged };
}
