import { getPayloadInstance } from "@/lib/payload";
import { membershipTiers } from "@/lib/content";

// Public endpoint: returns all subscription tiers for the pricing page.
// No auth required — tiers are public (read: () => true in payload.config.ts).
// Falls back to static content if the database is unreachable.
export async function GET() {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "subscription-tiers",
      sort: "priceCents",
      limit: 50,
      overrideAccess: true,
    });

    return Response.json({
      docs: result.docs.map((t: any) => ({
        id: t.id,
        name: t.name,
        priceCents: t.priceCents,
        interval: t.interval,
        stripePriceId: t.stripePriceId,
        perks: t.perks || [],
      })),
    });
  } catch (err) {
    console.error("Error fetching tiers, falling back to static:", err);
    // Fallback to static content so the membership page is never empty
    return Response.json({
      docs: membershipTiers.map((t, i) => ({
        id: i + 1,
        name: t.name,
        priceCents: t.price * 100,
        interval: "month" as const,
        stripePriceId: "",
        perks: t.perks.map((p) => ({ perk: p })),
      })),
    });
  }
}
