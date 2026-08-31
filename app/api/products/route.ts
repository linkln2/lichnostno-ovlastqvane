import { getPayloadInstance } from "@/lib/payload";
import { products as staticProducts } from "@/lib/content";

// Public endpoint: returns published products for the shop grid.
// Falls back to static content if the database is unreachable.
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
        const staticProduct = staticProducts.find((sp) => sp.slug === p.slug);
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
    console.error("Error fetching products, falling back to static:", err);
    // Fallback to static content so the shop is never empty
    return Response.json({
      docs: staticProducts.map((p) => ({
        id: p.slug,
        name: p.name,
        slug: p.slug,
        priceCents: p.price * 100,
        category: p.category,
        productType: "physical",
        inventory: 100,
        status: "published",
        images: [],
        image: p.image,
      })),
    });
  }
}
