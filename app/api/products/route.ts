import { getPayloadInstance } from "@/lib/payload";
import { products } from "@/lib/content";

// Public endpoint: returns published products for the shop grid.
export async function GET() {
  try {
    const payload = await getPayloadInstance();
    const result = await payload.find({
      collection: "products",
      sort: "-createdAt",
      limit: 50,
      where: { status: { equals: "published" } },
      overrideAccess: true,
    });

    return Response.json({
      docs: result.docs.map((p: any) => {
        const staticProduct = products.find((sp) => sp.slug === p.slug);
        const firstImage = p.images?.[0];
        const imageUrl =
          (firstImage?.sizes?.thumbnail?.url || firstImage?.url) ??
          staticProduct?.image ??
          null;
        return {
          id: p.id,
          name: p.name,
          slug: p.slug || String(p.id),
          priceCents: p.priceCents,
          category: p.category,
          productType: p.productType,
          inventory: p.inventory,
          status: p.status,
          images: p.images || [],
          image: imageUrl,
        };
      }),
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return Response.json({ error: "Failed to load products" }, { status: 500 });
  }
}
