import { pageMetadata } from "@/lib/seo";
import { getPayloadInstance } from "@/lib/payload";
import { products } from "@/lib/content";
import ProductDetailView from "./ProductDetailView";

/**
 * Look up a product for metadata. Reads Payload directly and falls back to the
 * static catalogue, so link previews still work if the database is unreachable.
 *
 * Payload's `description` is Lexical rich text, which has no cheap plain-text
 * projection here — the static catalogue's description is used when available,
 * otherwise a generic one built from the name.
 */
async function getProductForMeta(slug: string) {
  const staticProduct = products.find((p) => p.slug === slug);

  try {
    const payload = await getPayloadInstance();
    const { docs } = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (docs.length > 0) {
      const p = docs[0] as any;
      const firstImage = p.images?.[0];
      return {
        name: typeof p.name === "string" ? p.name : staticProduct?.name.bg || "Продукт",
        description: staticProduct?.description.bg,
        image:
          firstImage?.sizes?.og?.url ||
          firstImage?.url ||
          staticProduct?.image,
      };
    }
  } catch (err) {
    console.error("Product metadata lookup failed:", err);
  }

  if (staticProduct) {
    return {
      name: staticProduct.name.bg,
      description: staticProduct.description.bg,
      image: staticProduct.image,
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductForMeta(slug);

  if (!product) {
    return pageMetadata({
      title: "Продуктът не е намерен",
      description: "Този продукт не съществува или вече не се предлага.",
      path: `/shop/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: product.name,
    description:
      product.description || `${product.name} — от магазина на Личностно овластяване.`,
    path: `/shop/${slug}`,
    image: product.image,
  });
}

export default function Page() {
  return <ProductDetailView />;
}
