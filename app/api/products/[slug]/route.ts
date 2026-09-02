import { getPayloadInstance } from "@/lib/payload";
import { products } from "@/lib/content";

// Public endpoint: returns a single product by slug.
// Falls back to static content if the database is unreachable.
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
    const staticProduct = products.find((sp) => sp.slug === p.slug);
    const firstImage = p.images?.[0];
    const imageUrl =
      (firstImage?.sizes?.thumbnail?.url || firstImage?.url) ??
      staticProduct?.image ??
      null;
    const downloadFile = p.downloadFile
      ? {
          id: p.downloadFile.id,
          url: p.downloadFile.url || p.downloadFile.sizes?.thumbnail?.url || null,
          filename: p.downloadFile.filename || p.downloadFile.name || null,
        }
      : null;
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
      downloadFile,
      image: imageUrl,
    });
  } catch (err) {
    console.error("Error fetching product, falling back to static:", err);
    // Fallback to static content
    const staticProduct = products.find((p) => p.slug === slug);
    if (!staticProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json({
      id: staticProduct.slug,
      name: staticProduct.name.bg,
      slug: staticProduct.slug,
      priceCents: staticProduct.price * 100,
      category: staticProduct.category,
      productType: "physical",
      inventory: 100,
      status: "published",
      images: [],
      description: staticProduct.description.bg,
      downloadFile: null,
      image: staticProduct.image,
    });
  }
}
