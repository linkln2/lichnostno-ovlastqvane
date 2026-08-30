import { getPayloadInstance } from "@/lib/payload";

// Public endpoint: returns all subscription tiers for the pricing page.
// No auth required — tiers are public (read: () => true in payload.config.ts).
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
    console.error("Error fetching tiers:", err);
    return Response.json({ error: "Failed to load tiers" }, { status: 500 });
  }
}
