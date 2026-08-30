import { getPayloadInstance } from "@/lib/payload";
import { products } from "@/lib/content";

// Public endpoint: returns a single product by slug.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const payload = await getPayloadInstance();

    const { docs } = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });

    if (docs.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const p = docs[0] as any;
    return Response.json({
      id: p.id,
      name: p.name,
      slug: p.slug || String(p.id),
      priceCents: p.priceCents,
      category: p.category,
      productType: p.productType,
      inventory: p.inventory,
      status: p.status,
      images: p.images || [],
      description: p.description,
      downloadFile: p.downloadFile,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return Response.json({ error: "Failed to load product" }, { status: 500 });
  }
}
