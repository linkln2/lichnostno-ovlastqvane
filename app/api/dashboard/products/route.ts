import { requireStaff, fetchCollection, createRecord } from "@/lib/dashboard-api";

// Helper to resolve image URLs from media uploads
function resolveImageUrl(img: any): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (img.url) return img.url;
  if (img.sizes?.thumbnail?.url) return img.sizes.thumbnail.url;
  return null;
}

export async function GET(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const { docs, totalDocs } = await fetchCollection<any>("products", {
    sort: "-createdAt",
    limit: 50,
  });

  return Response.json({
    totalDocs,
    docs: docs.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      excerpt: p.excerpt || "",
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents || 0,
      currency: p.currency || "eur",
      sku: p.sku || "",
      category: p.category,
      productType: p.productType,
      tags: p.tags || "",
      images: (p.images || []).map(resolveImageUrl).filter(Boolean),
      inventory: p.inventory,
      lowStockThreshold: p.lowStockThreshold || 5,
      weightGrams: p.weightGrams || 0,
      status: p.status,
      featured: p.featured || false,
      stripePriceId: p.stripePriceId || "",
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const record = await createRecord("products", {
      name: body.name,
      slug: body.slug || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "",
      excerpt: body.excerpt || "",
      priceCents: Number(body.priceCents) || 0,
      compareAtCents: body.compareAtCents ? Number(body.compareAtCents) : undefined,
      currency: body.currency || "eur",
      sku: body.sku || undefined,
      category: body.category || "digital",
      productType: body.productType || "digital",
      tags: body.tags || undefined,
      inventory: body.productType === "physical" ? Number(body.inventory) || 0 : undefined,
      lowStockThreshold: body.productType === "physical" ? Number(body.lowStockThreshold) || 5 : undefined,
      weightGrams: body.productType === "physical" && body.weightGrams ? Number(body.weightGrams) : undefined,
      status: body.status || "draft",
      featured: body.featured || false,
      stripePriceId: body.stripePriceId || undefined,
      seoTitle: body.seoTitle || undefined,
      seoDescription: body.seoDescription || undefined,
    });
    return Response.json({ success: true, id: record.id });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
